import type { Metadata } from 'next'

import type { Media, Page, Post, Project, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import {
  SITE_DESCRIPTION,
  SITE_OG_IMAGE,
  SITE_SHORT_NAME,
  defaultTwitter,
  formatPageTitle,
  getPagePath,
} from './siteMetadata'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = `${serverUrl}${SITE_OG_IMAGE.url}`

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

const buildTwitter = (title: string, description: string, imageUrl: string): Metadata['twitter'] => ({
  ...defaultTwitter,
  title,
  description,
  images: [imageUrl],
})

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)
  const description = doc?.meta?.description || SITE_DESCRIPTION
  const title = formatPageTitle(doc?.meta?.title)
  const path = getPagePath(doc?.slug)

  return {
    description,
    openGraph: mergeOpenGraph({
      description,
      images: [
        {
          url: ogImage,
          width: SITE_OG_IMAGE.width,
          height: SITE_OG_IMAGE.height,
          alt: SITE_OG_IMAGE.alt,
        },
      ],
      title,
      url: path,
    }),
    twitter: buildTwitter(title, description, ogImage),
    alternates: {
      canonical: path,
    },
    title,
  }
}

export const generateProjectMeta = (args: {
  project: Partial<Project> | null
  path: string
}): Metadata => {
  const { project, path } = args

  const projectTitle = project?.campaignTitle
    ? `${project.campaignTitle} — ${project.clientName || project.title}`
    : project?.title

  const title = projectTitle ? formatPageTitle(projectTitle) : formatPageTitle(null)
  const description = project?.workBubbleHoverText?.trim() || SITE_DESCRIPTION
  const ogImage = getImageURL(
    project?.thumbnail && typeof project.thumbnail === 'object' ? project.thumbnail : null,
  )

  return {
    description,
    openGraph: mergeOpenGraph({
      description,
      images: [
        {
          url: ogImage,
          width: SITE_OG_IMAGE.width,
          height: SITE_OG_IMAGE.height,
          alt: projectTitle ? `${projectTitle} — ${SITE_SHORT_NAME}` : SITE_OG_IMAGE.alt,
        },
      ],
      title,
      url: path,
    }),
    twitter: buildTwitter(title, description, ogImage),
    alternates: {
      canonical: path,
    },
    title: projectTitle || undefined,
  }
}
