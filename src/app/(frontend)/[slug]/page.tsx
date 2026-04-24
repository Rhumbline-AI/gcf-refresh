import type { Metadata } from 'next'
import type { Page as PageType } from '@/payload-types'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { HomePageLivePreview } from './HomePageLivePreview'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const params = await paramsPromise
  const { slug = 'home' } = params ?? {}
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page
  const isHome = decodedSlug === 'home'
  const isWork = decodedSlug === 'work'

  // Pages whose article wrapper should carry a background color so it bleeds
  // up behind the footer's torn-paper shadow (no white gap before the footer).
  const pageBackgrounds: Record<string, string> = {
    faq: '#307fe2',
    pov: '#f7f2ee',
  }
  const pageBg = pageBackgrounds[decodedSlug]

  // Pages where the hero (or last block) is responsible for filling the visual
  // area down to the footer overlap — no extra bottom padding on the article.
  const fullBleedSlugs = new Set(['contact'])
  const isFullBleed = fullBleedSlugs.has(decodedSlug)

  return (
    <article
      className={`${isFullBleed ? 'pb-0' : 'pb-24'} page-${decodedSlug} ${isWork ? 'dot-matrix-bg' : ''}`}
      style={pageBg ? { backgroundColor: pageBg } : undefined}
    >
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {isHome ? (
        <HomePageLivePreview initialPage={page as PageType}>
          <RenderBlocks blocks={layout} />
        </HomePageLivePreview>
      ) : (
        <>
          <RenderHero {...hero} />
          <RenderBlocks blocks={layout} />
        </>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const params = await paramsPromise
  const { slug = 'home' } = params ?? {}
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
