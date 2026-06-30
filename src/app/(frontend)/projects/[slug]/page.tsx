import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Project } from '@/payload-types'

import { CaseStudy } from '@/components/CaseStudy'
import { generateProjectMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { unstable_cache } from 'next/cache'
import { cacheTags } from '@/utilities/cacheTags'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return projects.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProjectPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  const project = await queryProjectBySlug({ slug: decodedSlug })

  if (!project) {
    return <div className="container py-24">Project not found.</div>
  }

  return (
    <article className="pb-24" style={{ backgroundColor: '#f5f0eb' }}>
      <PageClient />
      <CaseStudy project={project} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const project = await queryProjectBySlug({ slug: decodedSlug })

  return generateProjectMeta({
    project,
    path: `/projects/${decodedSlug}`,
  })
}

// Published projects read through the Next Data Cache; `revalidateProject` busts
// these tags on every edit. Draft preview always bypasses the cache below.
const getCachedProjectBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'projects',
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
    ['project-by-slug', slug],
    {
      tags: [cacheTags.collection('projects'), cacheTags.docBySlug('projects', slug)],
      revalidate: 3600,
    },
  )()

const queryProjectBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  if (draft) {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'projects',
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

  return getCachedProjectBySlug(slug)
})
