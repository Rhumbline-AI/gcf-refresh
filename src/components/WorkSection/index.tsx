'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import React, { useState } from 'react'

import { getClientSideURL } from '@/utilities/getURL'

import type { Project, WorkProject } from './types'

// Organic scattered positions (top %, left %) – avoids overlap, works for many projects
const SCATTER_POSITIONS: Array<{ top: number; left: number }> = [
  { top: 15, left: 20 },
  { top: 72, left: 25 },
  { top: 28, left: 48 },
  { top: 78, left: 65 },
  { top: 22, left: 80 },
  { top: 55, left: 38 },
  { top: 8, left: 55 },
  { top: 88, left: 42 },
  { top: 42, left: 12 },
  { top: 38, left: 70 },
  { top: 65, left: 8 },
  { top: 18, left: 35 },
  { top: 82, left: 78 },
  { top: 52, left: 52 },
  { top: 12, left: 88 },
  { top: 48, left: 5 },
  { top: 5, left: 72 },
  { top: 75, left: 18 },
  { top: 32, left: 62 },
  { top: 58, left: 85 },
]

const CIRCLE_SIZE = 96

function buildThumbnailUrl(thumbnail: Project['thumbnail']): string | null {
  if (!thumbnail || typeof thumbnail !== 'object' || !thumbnail.url) return null
  const url = thumbnail.url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return getClientSideURL() + url
}

type Props =
  | { projects: Project[]; livePreview?: true }
  | { projects: WorkProject[]; livePreview?: false }

export function WorkSection({ projects, livePreview = false }: Props) {
  if (projects.length === 0) return null

  return (
    <section className="relative overflow-hidden py-20">
      <div className="container">
        <h2 className="mb-2 text-3xl font-semibold tracking-tight md:text-4xl">Work</h2>
        <p className="text-muted-foreground mb-16 max-w-xl text-lg">
          Selected projects, scattered across the grid.
        </p>
      </div>

      {/* Dot-grid background + scattered circles container */}
      <div
        className="relative mx-auto w-full max-w-5xl text-neutral-200 dark:text-neutral-800"
        style={{
          minHeight: 'min(85vh, 640px)',
          backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {livePreview && isProjectArray(projects)
          ? projects.map((project, i) => {
              const pos = SCATTER_POSITIONS[i % SCATTER_POSITIONS.length]
              return (
                <LiveProjectCircle
                  key={project.id}
                  initialProject={project}
                  top={pos.top}
                  left={pos.left}
                  index={i}
                />
              )
            })
          : projects.map((project, i) => {
              const pos = SCATTER_POSITIONS[i % SCATTER_POSITIONS.length]
              const p = project as WorkProject
              return (
                <WorkCircle
                  key={p.id}
                  project={p}
                  top={pos.top}
                  left={pos.left}
                  index={i}
                />
              )
            })}
      </div>
    </section>
  )
}

function isProjectArray(projects: Project[] | WorkProject[]): projects is Project[] {
  return projects.length > 0 && 'slug' in projects[0]
}

type LiveProjectCircleProps = {
  initialProject: Project
  top: number
  left: number
  index: number
}

function LiveProjectCircle({ initialProject, top, left, index }: LiveProjectCircleProps) {
  const { data: project } = useLivePreview({
    initialData: initialProject,
    serverURL: getClientSideURL(),
    depth: 1,
  })
  const thumbnailUrl = buildThumbnailUrl(project.thumbnail)
  return (
    <WorkCircle
      project={{ id: project.id, title: project.title, thumbnailUrl }}
      top={top}
      left={left}
      index={index}
    />
  )
}

type WorkCircleProps = {
  project: WorkProject
  top: number
  left: number
  index: number
}

function WorkCircle({ project, top, left, index }: WorkCircleProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="absolute z-10 flex flex-col items-center"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <motion.div
        className="relative flex flex-col items-center"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          y: {
            duration: 2.5 + (index % 5) * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        <motion.div
          className="relative shrink-0 overflow-hidden rounded-full border-2 border-white shadow-lg dark:border-neutral-800"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
          animate={{
            scale: isHovered ? 1.12 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              width={CIRCLE_SIZE}
              height={CIRCLE_SIZE}
              className="object-cover"
            />
          ) : (
            <div
              className="size-full bg-neutral-200 dark:bg-neutral-700"
              style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
            />
          )}
        </motion.div>

        <motion.span
          className="pointer-events-none absolute left-1/2 top-full max-w-[140px] -translate-x-1/2 truncate pt-3 text-center text-sm font-medium text-neutral-900 dark:text-neutral-100"
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 4,
          }}
          transition={{ duration: 0.2 }}
        >
          {project.title}
        </motion.span>
      </motion.div>
    </motion.div>
  )
}
