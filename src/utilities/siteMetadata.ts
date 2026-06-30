import type { Metadata } from 'next'

export const SITE_NAME = 'GCF'
export const SITE_SHORT_NAME = 'GCF'
export const SITE_DEFAULT_TITLE = 'GCF | Creative, Strategy and Production Agency'
export const SITE_DESCRIPTION =
  'We engineer combustible ideas. GCF identifies energy sources, blind spots, and acceleration points to fuel undeniable brand growth.'

/** Default social share image — 1200×628, served from /public/og-image.jpg */
export const SITE_OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 628,
  alt: 'GCF — We engineer combustible ideas',
} as const

export const defaultTwitter: NonNullable<Metadata['twitter']> = {
  card: 'summary_large_image',
  title: SITE_DEFAULT_TITLE,
  description: SITE_DESCRIPTION,
  images: [SITE_OG_IMAGE.url],
}

export function getPagePath(slug?: string | string[] | null): string {
  if (!slug || slug === 'home') return '/'
  if (Array.isArray(slug)) return `/${slug.join('/')}`
  return `/${slug}`
}

/**
 * Returns the page title verbatim from the CMS SEO field (falling back to the
 * site default when empty). We intentionally do NOT auto-append "| GCF" here:
 * editors fill in the full SEO title in Payload, so what they type is exactly
 * what renders. Auto-appending (combined with the old root title template) was
 * producing doubled/tripled "| GCF | GCF" suffixes.
 */
export function formatPageTitle(title?: string | null): string {
  const trimmed = title?.trim()
  return trimmed || SITE_DEFAULT_TITLE
}
