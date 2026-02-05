import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { WorkSection } from '@/components/WorkSection'

export const WorkBlock = async () => {
  const payload = await getPayload({ config })
  
  // Fetch all projects to display in the scattered view
  const projects = await payload.find({
    collection: 'projects',
    limit: 100,
    depth: 1,
  })

  return <WorkSection projects={projects.docs} />
}
