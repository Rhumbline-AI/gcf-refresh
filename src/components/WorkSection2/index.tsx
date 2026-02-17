'use client'

import { motion } from 'framer-motion'
import React from 'react'
import dotMatrixBg from '@/images/dot-matrix-background.gif'
import type { Project } from '@/payload-types'

export function WorkSection2({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  // For now, hardcode 3 projects layout
  const displayProjects = projects.slice(0, 3)

  return (
    <section 
      className="relative py-8 md:py-12 -mt-8 md:-mt-12"
      style={{
        backgroundImage: `url(${dotMatrixBg.src})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px',
        backgroundPosition: '0 0',
      }}
    >
      {/* Background SVG for all connecting lines - full viewport width */}
      <svg 
        className="absolute pointer-events-none overflow-visible" 
        style={{ 
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: '100%',
          zIndex: 1 
        }}
        preserveAspectRatio="none"
      >
        {/* Line from bottom-left circle - diagonal going up and to the LEFT edge */}
        <line 
          x1="28%" 
          y1="620" 
          x2="0" 
          y2="400" 
          stroke="#307fe2" 
          strokeWidth="3"
        />
        
        {/* Bottom-right connector arm - elbow shape */}
        {/* First segment: vertical line up from bottom-right circle */}
        <line 
          x1="72%" 
          y1="620" 
          x2="72%" 
          y2="520" 
          stroke="#307fe2" 
          strokeWidth="3"
        />
        {/* Node at the elbow */}
        <circle cx="72%" cy="520" r="5" fill="#307fe2" />
        
        {/* Second segment: horizontal line to right viewport edge */}
        <line 
          x1="72%" 
          y1="520" 
          x2="100%" 
          y2="520" 
          stroke="#307fe2" 
          strokeWidth="3"
        />
      </svg>

      {/* Top Row - Large centered circle */}
      <div className="relative w-full flex justify-center mb-8">
        {/* Top Center Circle - Large */}
        {displayProjects[0] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ProjectCircle project={displayProjects[0]} size="xlarge" />
          </motion.div>
        )}
      </div>

      {/* Bottom Row - Two smaller circles */}
      <div className="relative mx-auto w-full max-w-7xl" style={{ minHeight: '380px' }}>
        {/* Bottom Left Circle */}
        {displayProjects[1] && (
          <motion.div
            className="absolute"
            style={{
              top: '0%',
              left: '10%',
              zIndex: 2,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProjectCircle project={displayProjects[1]} size="medium" />
          </motion.div>
        )}

        {/* Bottom Right Circle */}
        {displayProjects[2] && (
          <motion.div
            className="absolute"
            style={{
              top: '0%',
              right: '10%',
              zIndex: 2,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ProjectCircle project={displayProjects[2]} size="medium" />
          </motion.div>
        )}
      </div>
    </section>
  )
}

type ProjectCircleProps = {
  project: Project
  size: 'medium' | 'xlarge'
}

function ProjectCircle({ project, size }: ProjectCircleProps) {
  const diameter = size === 'xlarge' ? 575 : 340 // xlarge increased by 15%
  const imageSize = size === 'xlarge' ? 564 : 330 // Image size
  const blueCircleSize = size === 'xlarge' ? 540 : 310 // Blue circle smaller - thinner border
  
  // Extract image URL from thumbnail Media object
  const thumbnailUrl = typeof project.thumbnail === 'object' && project.thumbnail !== null 
    ? project.thumbnail.url 
    : null
  
  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
      }}
    >
      {/* Solid blue circle - smaller than image, creates thin border effect */}
      <div
        className="absolute rounded-full"
        style={{
          width: `${blueCircleSize}px`,
          height: `${blueCircleSize}px`,
          backgroundColor: '#307fe2',
          zIndex: 1,
        }}
      />
      
      {/* Project image - slightly smaller, blue shows around edges */}
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={project.title}
          style={{
            width: `${imageSize}px`,
            height: `${imageSize}px`,
            objectFit: 'contain',
            zIndex: 2,
          }}
        />
      )}
      
      {/* Title overlay (z-index: 3) */}
      <div
        className="absolute inset-0 flex items-center justify-start px-12 text-white font-bold"
        style={{
          fontSize: size === 'xlarge' ? '2.5rem' : '1.75rem',
          fontFamily: 'var(--font-inter)',
          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          zIndex: 3,
        }}
      >
        {project.title}
      </div>
    </div>
  )
}
