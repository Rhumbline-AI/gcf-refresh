import type { Metadata } from 'next'

export const SITE_NAME = 'Growth Catalyst Firm'
export const SITE_SHORT_NAME = 'GCF'
export const SITE_DEFAULT_TITLE = 'Growth Catalyst Firm'
export const SITE_DESCRIPTION =
  'We engineer combustible ideas. Growth Catalyst Firm identifies energy sources, blind spots, and acceleration points to fuel undeniable brand growth.'

/** Default social share image — 1200×628, served from /public/og-image.jpg */
export const SITE_OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 628,
  alt: 'Growth Catalyst Firm — We engineer combustible ideas',
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

export function formatPageTitle(title?: string | null): string {
  if (!title) return SITE_DEFAULT_TITLE
  return `${title} | ${SITE_SHORT_NAME}`
}
