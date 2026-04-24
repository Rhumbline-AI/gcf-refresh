#!/usr/bin/env node
/**
 * One-time migration: upload local public/media/ files to Vercel Blob and
 * update the production media table so URLs point at the blob URLs instead
 * of /api/media/file/...
 *
 * Idempotent: any row whose URL already starts with `https://` is treated as
 * already-migrated and skipped. Safe to re-run after partial failure.
 *
 * Usage:
 *   node scripts/migrate-media-to-blob.mjs            # dry run, no writes
 *   node scripts/migrate-media-to-blob.mjs --apply    # actually upload + update DB
 *
 * Reads:
 *   DATABASE_URI            (.env.local)  → production Neon Postgres
 *   BLOB_READ_WRITE_TOKEN   (.env.local)  → production Vercel Blob
 */

import { config as loadEnv } from 'dotenv'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

// .env.local takes precedence (this is where the prod Neon URI + Blob token live)
loadEnv({ path: path.join(projectRoot, '.env.local') })
loadEnv({ path: path.join(projectRoot, '.env') })

const APPLY = process.argv.includes('--apply')
const MEDIA_DIR = path.join(projectRoot, 'public', 'media')

const SIZE_KEYS = ['thumbnail', 'square', 'small', 'medium', 'large', 'xlarge', 'og']

function log(...args) {
  console.log('[migrate-media]', ...args)
}

function fmtBytes(n) {
  if (!n) return '0B'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n = n / 1024
    i++
  }
  return `${n.toFixed(1)}${units[i]}`
}

async function main() {
  const dbUri = process.env.DATABASE_URI
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (!dbUri) throw new Error('DATABASE_URI not set (expected in .env.local)')
  if (!blobToken) throw new Error('BLOB_READ_WRITE_TOKEN not set (expected in .env.local)')

  log(`mode: ${APPLY ? 'APPLY (writing to Blob + DB)' : 'DRY RUN (no writes)'}`)
  log(`media dir: ${MEDIA_DIR}`)

  if (!existsSync(MEDIA_DIR)) throw new Error(`Media dir not found: ${MEDIA_DIR}`)

  const { default: pg } = await import('pg')
  const { put } = await import('@vercel/blob')

  const client = new pg.Client({ connectionString: dbUri })
  await client.connect()
  log('connected to DB')

  // Pull every media row + every size variant filename + URL.
  const sizeSelects = SIZE_KEYS.flatMap((k) => [
    `sizes_${k}_filename AS s_${k}_fn`,
    `sizes_${k}_url AS s_${k}_url`,
  ]).join(', ')
  const { rows } = await client.query(
    `SELECT id, filename, url, mime_type, ${sizeSelects} FROM media ORDER BY id`,
  )
  log(`found ${rows.length} media rows`)

  let mainUploaded = 0
  let sizesUploaded = 0
  let mainSkipped = 0
  let sizesSkipped = 0
  let missingFiles = 0
  let dbUpdates = 0
  let totalBytes = 0

  for (const row of rows) {
    const updates = {} // column -> new value

    // Main file
    const mainStatus = await processOne(row.filename, row.url, row.mime_type)
    if (mainStatus.action === 'uploaded') {
      mainUploaded++
      totalBytes += mainStatus.bytes
      updates.url = mainStatus.url
    } else if (mainStatus.action === 'skipped-already-blob') {
      mainSkipped++
    } else if (mainStatus.action === 'missing') {
      missingFiles++
    }

    // Size variants
    for (const k of SIZE_KEYS) {
      const fn = row[`s_${k}_fn`]
      const u = row[`s_${k}_url`]
      if (!fn) continue
      const sizeMime = row.mime_type // size variants share parent mime type by default
      const status = await processOne(fn, u, sizeMime)
      if (status.action === 'uploaded') {
        sizesUploaded++
        totalBytes += status.bytes
        updates[`sizes_${k}_url`] = status.url
      } else if (status.action === 'skipped-already-blob') {
        sizesSkipped++
      } else if (status.action === 'missing') {
        missingFiles++
      }
    }

    // Persist URL updates
    if (Object.keys(updates).length > 0 && APPLY) {
      const setClauses = Object.keys(updates)
        .map((col, i) => `${col} = $${i + 2}`)
        .join(', ')
      const values = [row.id, ...Object.values(updates)]
      await client.query(`UPDATE media SET ${setClauses} WHERE id = $1`, values)
      dbUpdates++
    } else if (Object.keys(updates).length > 0) {
      dbUpdates++
    }
  }

  await client.end()

  log('---')
  log(`main files:   uploaded=${mainUploaded}, already-blob=${mainSkipped}`)
  log(`size variants: uploaded=${sizesUploaded}, already-blob=${sizesSkipped}`)
  log(`missing on disk: ${missingFiles}`)
  log(`db rows that ${APPLY ? 'were' : 'would be'} updated: ${dbUpdates}`)
  log(`bytes ${APPLY ? 'uploaded' : 'would upload'}: ${fmtBytes(totalBytes)}`)
  if (!APPLY) log('DRY RUN — re-run with --apply to actually migrate.')

  async function processOne(filename, currentUrl, mimeType) {
    if (!filename) return { action: 'noop' }
    // Already a blob URL (or other absolute URL) → leave alone.
    if (currentUrl && /^https?:\/\//i.test(currentUrl)) {
      return { action: 'skipped-already-blob' }
    }

    const filePath = path.join(MEDIA_DIR, filename)
    if (!existsSync(filePath)) {
      log(`MISSING on disk: ${filename}`)
      return { action: 'missing' }
    }

    const stat = await fs.stat(filePath)

    if (!APPLY) {
      log(`would upload ${filename} (${fmtBytes(stat.size)})`)
      return { action: 'uploaded', url: '<dry-run>', bytes: stat.size }
    }

    const data = await fs.readFile(filePath)
    // Upload at the same filename so future references stay predictable.
    // addRandomSuffix:false matches what the @payloadcms/storage-vercel-blob
    // adapter does so the URL pattern is identical to fresh uploads.
    const blob = await put(filename, data, {
      access: 'public',
      token: blobToken,
      contentType: mimeType || undefined,
      addRandomSuffix: false,
      allowOverwrite: true,
    })
    log(`✓ ${filename} → ${blob.url}`)
    return { action: 'uploaded', url: blob.url, bytes: stat.size }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
