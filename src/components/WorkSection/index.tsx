'use client'

import { motion } from 'framer-motion'
import React from 'react'
import dotMatrixBg from '@/images/dot-matrix-background.gif'

import type { WorkProject } from './types'

export function WorkSection({ projects }: { projects: WorkProject[] }) {
  if (projects.length === 0) return null

  // For now, hardcode 3 projects layout - we'll expand this later
  const displayProjects = projects.slice(0, 3)

  return (
    <section 
      className="relative overflow-hidden py-16 md:py-24 -mt-16 md:-mt-24"
      style={{
        backgroundImage: `url(${dotMatrixBg.src})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px',
        backgroundPosition: '0 0',
      }}
    >
      <div className="container">
        <h2 className="mb-16 text-4xl md:text-5xl font-light text-center" style={{ fontFamily: 'var(--font-inter)' }}>
          The work
        </h2>
      </div>

      {/* Circles container */}
      <div className="relative mx-auto w-full max-w-7xl" style={{ minHeight: '900px' }}>
        {/* SVG for connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {/* Line from USAA (top-left) to The Venetian (bottom-center) */}
          <line 
            x1="18%" 
            y1="15%" 
            x2="47%" 
            y2="70%" 
            stroke="#307fe2" 
            strokeWidth="2"
          />
          {/* Dot at The Venetian connection point */}
          <circle cx="47%" cy="70%" r="6" fill="#307fe2" />
          
          {/* Line from Tecovas (top-right) to dot */}
          <line 
            x1="82%" 
            y1="15%" 
            x2="88%" 
            y2="45%" 
            stroke="#307fe2" 
            strokeWidth="2"
          />
          {/* Dot at end */}
          <circle cx="88%" cy="45%" r="6" fill="#307fe2" />
        </svg>

        {/* Top Left Circle - USAA */}
        {displayProjects[2] && (
          <motion.div
            className="absolute"
            style={{
              top: '0%',
              left: '15%',
              zIndex: 2,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ProjectCircle project={displayProjects[2]} size="medium" />
          </motion.div>
        )}

        {/* Top Right Circle - Tecovas */}
        {displayProjects[1] && (
          <motion.div
            className="absolute"
            style={{
              top: '0%',
              right: '15%',
              zIndex: 2,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProjectCircle project={displayProjects[1]} size="medium" />
          </motion.div>
        )}

        {/* Bottom Center Circle - The Venetian (larger) */}
        {displayProjects[0] && (
          <motion.div
            className="absolute"
            style={{
              top: '48%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ProjectCircle project={displayProjects[0]} size="xlarge" />
          </motion.div>
        )}
      </div>
    </section>
  )
}

type ProjectCircleProps = {
  project: WorkProject
  size: 'medium' | 'xlarge'
}

function ProjectCircle({ project, size }: ProjectCircleProps) {
  const diameter = size === 'xlarge' ? 500 : 340
  
  return (
    <div
      className="rounded-full flex items-center justify-start text-white font-bold shadow-2xl px-12"
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
        backgroundColor: '#307fe2',
        fontSize: size === 'xlarge' ? '2.5rem' : '1.75rem',
        fontFamily: 'var(--font-inter)',
      }}
    >
      {project.title}
    </div>
  )
}
