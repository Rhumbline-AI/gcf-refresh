import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Post } from '../../../payload-types'
import { cacheTags } from '../../../utilities/cacheTags'

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const { revalidatePath, revalidateTag } = await import('next/cache')
    if (doc._status === 'published') {
      const path = `/posts/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidatePath('/pov')
      revalidateTag('posts-sitemap')
      revalidateTag(cacheTags.collection('posts'))
      revalidateTag(cacheTags.collection('pages'))
      if (doc.slug) revalidateTag(cacheTags.docBySlug('posts', doc.slug))
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath('/pov')
      revalidateTag('posts-sitemap')
      revalidateTag(cacheTags.collection('posts'))
      revalidateTag(cacheTags.collection('pages'))
      if (previousDoc.slug) revalidateTag(cacheTags.docBySlug('posts', previousDoc.slug))
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const { revalidatePath, revalidateTag } = await import('next/cache')
    const path = `/posts/${doc?.slug}`

    revalidatePath(path)
    revalidatePath('/pov')
    revalidateTag('posts-sitemap')
    revalidateTag(cacheTags.collection('posts'))
    revalidateTag(cacheTags.collection('pages'))
    if (doc?.slug) revalidateTag(cacheTags.docBySlug('posts', doc.slug))
  }

  return doc
}
