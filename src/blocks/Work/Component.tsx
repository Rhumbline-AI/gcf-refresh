import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { WorkSection } from '@/components/WorkSection'
import type { Project } from '@/payload-types'

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

  // Fetch the full project data
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'projects',
    depth: 1,
    where: {
      id: {
        in: projectIds,
      },
    },
  })

  // Sort to maintain the order from the CMS
  const sortedProjects = projectIds
    .map((id) => result.docs.find((p) => p.id === id))
    .filter((p): p is Project => p !== undefined)

  if (sortedProjects.length === 0) {
    return null
  }

  return <WorkSection projects={sortedProjects} title={title} />
}
