import React from 'react'
import { WorkSection } from '@/components/WorkSection'
import type { Project } from '@/payload-types'
import { getCachedProjectsByIds } from '@/utilities/getCachedProjectsByIds'

type WorkBlockProps = {
  title?: string | null
  projects?: (number | Project)[] | null
}

export const WorkBlock = async ({ title, projects }: WorkBlockProps) => {
  // Handle missing or empty projects
  if (!projects || projects.length === 0) {
    return null
  }

  // Get project IDs (whether they're numbers or objects)
  const projectIds = projects.map((p) => (typeof p === 'object' ? p.id : p))

  // Fetch the full project data (cached; busted by revalidateProject on edit)
  const docs = await getCachedProjectsByIds(projectIds)

  // Sort to maintain the order from the CMS
  const sortedProjects = projectIds
    .map((id) => docs.find((p) => p.id === id))
    .filter((p): p is Project => p !== undefined)

  if (sortedProjects.length === 0) {
    return null
  }

  return <WorkSection projects={sortedProjects} title={title} />
}
