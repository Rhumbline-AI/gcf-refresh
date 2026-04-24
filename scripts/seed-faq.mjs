/**
 * Idempotent seed for the FAQ page + header nav item.
 *
 * Run once after the FAQ data was lost from the production DB:
 *   npm run seed:faq
 *
 * - Creates a published page with slug "faq" containing a populated FAQ block
 *   (placeholder questions you can edit in the admin afterwards).
 * - Adds a "FAQ" nav item to the Header global if one isn't already there.
 *
 * Safe to re-run — checks for existing data before creating.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { config as loadEnv } from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env.local first (for dev DB credentials), then .env as fallback.
loadEnv({ path: path.resolve(__dirname, '../.env.local') })
loadEnv({ path: path.resolve(__dirname, '../.env') })

const { getPayload } = await import('payload')
const config = (await import('../src/payload.config.ts')).default

const FAQ_SLUG = 'faq'

const placeholderItems = [
  {
    question: 'What is GCF?',
    answer: 'Growth Catalyst Firm — a strategic agency that engineers combustible ideas to fuel undeniable brand growth.',
  },
  {
    question: 'How do you work with clients?',
    answer: 'We partner with growth-minded brands to identify acceleration points, design ignition strategies, and execute with precision.',
  },
  {
    question: 'What types of brands do you work with?',
    answer: 'We work with brands ready to break through plateaus — from emerging challengers to established category leaders looking for their next chapter.',
  },
]

// Convert a plain string to Lexical rich-text format expected by Payload's richText field
function lexParagraph(text) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          textFormat: 0,
        },
      ],
      direction: 'ltr',
    },
  }
}

async function main() {
  const payload = await getPayload({ config })

  // 1. Find or create the FAQ page
  const existingPages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: FAQ_SLUG } },
    limit: 1,
    depth: 0,
  })

  if (existingPages.docs.length > 0) {
    console.log(`✓ FAQ page already exists (id: ${existingPages.docs[0].id}). Skipping create.`)
  } else {
    const created = await payload.create({
      collection: 'pages',
      // Skip revalidatePath — that's a Next.js runtime concern, not relevant to a one-off seed
      context: { disableRevalidate: true },
      data: {
        title: 'FAQ',
        slug: FAQ_SLUG,
        _status: 'published',
        hero: { type: 'none' },
        layout: [
          {
            blockType: 'faq',
            heading: 'FAQS',
            items: placeholderItems.map(({ question, answer }) => ({
              question,
              answer: lexParagraph(answer),
            })),
          },
        ],
      },
    })
    console.log(`✓ Created FAQ page (id: ${created.id})`)
  }

  // 2. Ensure Header global has a /faq nav item
  const header = await payload.findGlobal({ slug: 'header', depth: 0 })
  const navItems = header?.navItems || []

  const hasFaqLink = navItems.some((item) => {
    const link = item?.link
    if (!link) return false
    if (link.type === 'custom' && link.url === '/faq') return true
    if (link.label?.toLowerCase() === 'faq') return true
    return false
  })

  if (hasFaqLink) {
    console.log('✓ Header already has FAQ nav item. Skipping.')
  } else {
    await payload.updateGlobal({
      slug: 'header',
      context: { disableRevalidate: true },
      data: {
        navItems: [
          ...navItems,
          {
            link: {
              type: 'custom',
              label: 'FAQ',
              url: '/faq',
              newTab: false,
            },
          },
        ],
      },
    })
    console.log('✓ Added FAQ nav item to Header global')
  }

  console.log('\nDone. Visit /admin to edit the FAQ content, and /faq to view the live page.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
