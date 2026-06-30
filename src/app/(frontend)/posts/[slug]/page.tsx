import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { unstable_cache } from 'next/cache'
import { cacheTags } from '@/utilities/cacheTags'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pb-64 md:pb-80" style={{ backgroundColor: '#ffffff' }}>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="container">
        <RichText
          className="max-w-2xl [&>*:first-child]:mt-0 [&_p]:text-base [&_p]:md:text-[1.05rem] [&_p]:leading-[1.75] [&_p]:text-[#333] [&_p]:font-light [&_p]:mb-6 [&_h2]:text-2xl [&_h2]:font-light [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-light [&_h3]:mt-8 [&_h3]:mb-3"
          data={post.content}
          enableGutter={false}
          enableProse={false}
        />
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

// Published posts read through the Next Data Cache; `revalidatePost` busts these
// tags on every edit. Draft preview always bypasses the cache below.
const getCachedPostBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'posts',
        draft: false,
        limit: 1,
        overrideAccess: false,
        pagination: false,
        where: {
          slug: {
            equals: slug,
          },
        },
      })
      return result.docs?.[0] || null
    },
    ['post-by-slug', slug],
    { tags: [cacheTags.collection('posts'), cacheTags.docBySlug('posts', slug)], revalidate: 3600 },
  )()

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  if (draft) {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      draft: true,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })
    return result.docs?.[0] || null
  }

  return getCachedPostBySlug(slug)
})
