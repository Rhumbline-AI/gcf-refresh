import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

const BLOB_STORE_BASE_URL = process.env.BLOB_STORE_BASE_URL

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
    ],
  },
  async rewrites() {
    const rules = await (typeof redirects === 'function' ? redirects() : [])
    if (!BLOB_STORE_BASE_URL) return { beforeFiles: [], afterFiles: [], fallback: [] }

    return {
      beforeFiles: [
        {
          source: '/api/media/file/:path*',
          destination: `${BLOB_STORE_BASE_URL}/media/:path*`,
        },
      ],
      afterFiles: [
        {
          source: '/media/:path*',
          destination: `${BLOB_STORE_BASE_URL}/media/:path*`,
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
