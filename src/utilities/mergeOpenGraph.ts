import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { SITE_DEFAULT_TITLE, SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE } from './siteMetadata'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  locale: 'en_US',
  url: getServerSideURL(),
  siteName: SITE_NAME,
  title: SITE_DEFAULT_TITLE,
  description: SITE_DESCRIPTION,
  images: [SITE_OG_IMAGE],
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
