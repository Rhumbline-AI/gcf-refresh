#!/usr/bin/env node
/**
 * Verifies local Postgres is running and (optionally) that the app database exists.
 * Run from project root: node scripts/check-postgres.mjs
 * Or: npm run check:db
 */

import { config } from 'dotenv'
import net from 'net'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

// Load .env from project root
config({ path: path.join(projectRoot, '.env') })

const HOST = '127.0.0.1'
const PORT = 5432

function checkPort() {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    const timeout = 2000
    socket.setTimeout(timeout)
    socket.on('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.on('error', () => resolve(false))
    socket.on('timeout', () => {
      socket.destroy()
      resolve(false)
    })
    socket.connect(PORT, HOST)
  })
}

async function checkDatabase() {
  const uri = process.env.DATABASE_URI
  if (!uri) {
    console.log('  ⚠ DATABASE_URI is not set in .env')
    return
  }

  // Parse for display (hide password)
  const parsed = uri.replace(/:([^:@]+)@/, ':****@')
  console.log('  DATABASE_URI:', parsed)

  try {
    const { default: pg } = await import('pg')
    const client = new pg.Client({ connectionString: uri })
    await client.connect()
    const res = await client.query(
      "SELECT datname FROM pg_database WHERE datname = current_database()"
    )
    const dbName = res.rows[0]?.datname
    await client.end()
    console.log('  ✓ Connected. Current database:', dbName)
  } catch (err) {
    console.log('  ✗ Connection failed:', err.message)
    if (uri.includes('<password>')) {
      console.log('\n  → Replace <password> in .env with your Postgres password.')
    }
    if (uri.includes('gcf-refresh-2026') && !uri.includes('gcf_refresh_2026')) {
      console.log(
        '  → Postgres database names cannot contain hyphens. Use gcf_refresh_2026 in DATABASE_URI.'
      )
    }
  }
}

async function main() {
  console.log('Postgres check (127.0.0.1:5432)\n')

  console.log('1. Port 5432 reachable?')
  const portOpen = await checkPort()
  if (portOpen) {
    console.log('   ✓ Yes – something is listening on 127.0.0.1:5432\n')
  } else {
    console.log('   ✗ No – nothing is listening on 127.0.0.1:5432')
    console.log('\n   Start Postgres first, e.g.:')
    console.log('   docker compose -f docker-compose.postgres.yml up -d')
    console.log('   or start your local Postgres service.\n')
    process.exit(1)
  }

  console.log('2. DATABASE_URI connection and database')
  await checkDatabase()
  console.log('')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
