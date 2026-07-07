import type { Media, Post } from '@/payload-types'

/** One row in the POV Articles block (linked post + optional legacy manual fields). */
export type POVArticleItem = {
  post?: (number | null) | Post
  listingSummary?: string | null
  /** @deprecated Legacy manual entry — use `post` instead */
  logo?: (number | null) | Media
  /** @deprecated Legacy manual entry — use `post` instead */
  title?: string
  /** @deprecated Legacy manual entry — use `post` instead */
  description?: string | null
  /** @deprecated Legacy manual entry — use `post` instead */
  link?: string | null
}

export type ResolvedPOVArticle = {
  title: string
  logoUrl: string | null
  description: string | null
  link: string | null
}

const getMediaUrl = (media: unknown): string | null => {
  if (media && typeof media === 'object' && 'url' in media && typeof media.url === 'string') {
    return media.url
  }
  return null
}

/**
 * Resolves a POV listing row from a linked Post (preferred) or legacy manual fields.
 */
export const resolvePOVArticle = (item: POVArticleItem): ResolvedPOVArticle | null => {
  const post = typeof item.post === 'object' && item.post !== null ? item.post : null

  if (post) {
    return {
      title: post.title,
      logoUrl: getMediaUrl(post.publicationLogo),
      description: item.listingSummary?.trim() || post.meta?.description?.trim() || null,
      link: post.slug ? `/posts/${post.slug}` : null,
    }
  }

  // Legacy manual entries (existing POV rows before post linking)
  if (!item.title?.trim()) return null

  return {
    title: item.title,
    logoUrl: getMediaUrl(item.logo),
    description: item.description?.trim() || null,
    link: item.link?.trim() || null,
  }
}
