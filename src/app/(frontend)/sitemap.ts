import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const siteUrl = getServerSideURL()

  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const projects = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const pageEntries: MetadataRoute.Sitemap = pages.docs.map((page) => ({
    url: `${siteUrl}${page.slug === 'home' ? '' : `/${page.slug}`}`,
    lastModified: page.updatedAt,
    changeFrequency: page.slug === 'home' ? 'weekly' : 'monthly',
    priority: page.slug === 'home' ? 1.0 : 0.8,
  }))

  const projectEntries: MetadataRoute.Sitemap = projects.docs.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...pageEntries, ...projectEntries]
}
