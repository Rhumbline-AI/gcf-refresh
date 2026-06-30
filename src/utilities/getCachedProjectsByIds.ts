import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Project } from '@/payload-types'
import { cacheTags } from './cacheTags'

/**
 * Cached fetch of projects by id, used by the Work/Work2 blocks on the home and
 * work pages. The query result is stored in the Next Data Cache and tagged with
 * the projects collection tag, so any project edit (via `revalidateProject`)
 * busts it. This keeps repeat navigations from re-hitting Neon on every render.
 *
 * Behavior mirrors the previous inline query exactly (depth: 1, same `where`),
 * only adding caching — so block output is unchanged.
 */
export const getCachedProjectsByIds = (ids: (number | string)[]): Promise<Project[]> =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'projects',
        depth: 1,
        where: {
          id: {
            in: ids,
          },
        },
      })
      return result.docs as Project[]
    },
    ['projects-by-ids', ids.join(',')],
    { tags: [cacheTags.collection('projects')], revalidate: 3600 },
  )()
