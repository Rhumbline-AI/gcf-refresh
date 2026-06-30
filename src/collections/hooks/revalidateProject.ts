import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Project } from '../../payload-types'
import { cacheTags } from '../../utilities/cacheTags'

// Project content surfaces in several places, so a single edit may need to
// invalidate multiple statically-generated routes:
//   • /work/[slug]       — the case study page itself
//   • /projects/[slug]   — legacy alias still rendered at build time
//   • /work              — the work index (orb list of projects)
//   • /                  — the home page (work blocks reference projects)
//
// Projects don't use drafts, so there's no _status gate — every save should
// publish-through immediately.
const revalidateAllProjectPaths = async (doc: Project, previousDoc?: Partial<Project>) => {
  const { revalidatePath, revalidateTag } = await import('next/cache')

  const slugsToRevalidate = new Set<string>()
  if (doc?.slug) slugsToRevalidate.add(doc.slug)
  if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
    slugsToRevalidate.add(previousDoc.slug)
  }

  for (const slug of slugsToRevalidate) {
    revalidatePath(`/work/${slug}`)
    revalidatePath(`/projects/${slug}`)
    revalidateTag(cacheTags.docBySlug('projects', slug))
  }

  revalidatePath('/work')
  revalidatePath('/')

  // Busts both the per-slug case-study caches AND the Work/Work2 block project
  // lists rendered on the home and work pages.
  revalidateTag(cacheTags.collection('projects'))
}

export const revalidateProject: CollectionAfterChangeHook<Project> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating project: ${doc?.slug}`)
    await revalidateAllProjectPaths(doc, previousDoc)
  }
  return doc
}

export const revalidateProjectDelete: CollectionAfterDeleteHook<Project> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating after project delete: ${doc?.slug}`)
    await revalidateAllProjectPaths(doc as Project)
  }
  return doc
}
