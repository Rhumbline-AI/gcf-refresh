'use client'

import { RenderHero } from '@/heros/RenderHero'
import { WorkSection } from '@/components/WorkSection'
import { useLivePreview } from '@payloadcms/live-preview-react'
import React from 'react'
import { getClientSideURL } from '@/utilities/getURL'
import type { Page as PageType } from '@/payload-types'
import type { Project } from '@/payload-types'

type Props = {
  initialPage: PageType
  initialProjects: Project[]
  /** Server-rendered layout blocks (avoids pulling payload config into client bundle) */
  children?: React.ReactNode
}

export function HomePageLivePreview({ initialPage, initialProjects, children }: Props) {
  const { data: page } = useLivePreview({
    initialData: initialPage,
    serverURL: getClientSideURL(),
    depth: 2,
  })

  return (
    <>
      <RenderHero {...page.hero} />
      {children}
      {initialProjects.length > 0 && (
        <WorkSection projects={initialProjects} livePreview />
      )}
    </>
  )
}
