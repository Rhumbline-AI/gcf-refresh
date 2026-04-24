import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

// Strip whitespace/newlines — the Vercel-managed env var came through with a
// trailing literal `\n` which would corrupt rewrite destinations.
const BLOB_STORE_BASE_URL = process.env.BLOB_STORE_BASE_URL?.trim()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      ...(BLOB_STORE_BASE_URL
        ? [
            {
              hostname: new URL(BLOB_STORE_BASE_URL).hostname,
              protocol: 'https',
            },
          ]
        : []),
      // Always allow any Vercel Blob public store. Without this, any environment
      // where BLOB_STORE_BASE_URL isn't explicitly set (e.g. local dev pointing
      // at the prod Neon DB) throws `next/image` 500s for media URLs that came
      // from the storage-vercel-blob adapter.
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  async rewrites() {
    const rules = await (typeof redirects === 'function' ? redirects() : [])
    if (!BLOB_STORE_BASE_URL) return { beforeFiles: [], afterFiles: [], fallback: [] }

    // Files in our Blob store live at the ROOT of the store
    // (e.g. https://<store>.public.blob.vercel-storage.com/foo.mp4),
    // NOT under a /media/ prefix — that's a default the upstream template
    // assumed but our migration + adapter don't use. The previous rewrites
    // were tacking on `/media/` and producing 404s on production for every
    // upload made AFTER the bulk migration (those rows store url
    // `/api/media/file/foo.mp4`, which then got rewritten to a path that
    // doesn't exist). Drop the prefix so the legacy URL pattern proxies
    // straight through to the actual Blob object.
    return {
      beforeFiles: [
        {
          source: '/api/media/file/:path*',
          destination: `${BLOB_STORE_BASE_URL}/:path*`,
        },
      ],
      afterFiles: [
        {
          source: '/media/:path*',
          destination: `${BLOB_STORE_BASE_URL}/:path*`,
        },
      ],
      fallback: [],
    }
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
}

// devBundleServerPackages: true bundles server packages in dev to avoid duplicate modules
// and "__webpack_modules__[moduleId] is not a function" / Invalid hook call errors
export default withPayload(nextConfig, { devBundleServerPackages: true })
