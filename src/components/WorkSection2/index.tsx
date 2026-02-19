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
        className="absolute pointer-events-none overflow-visible hidden md:block" 
        style={{ 
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1 
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* TOP CONNECTOR - from Safe Auto circle (bottom-right edge, going down-right then out) */}
        <line 
          x1="58%" 
          y1="52%" 
          x2="70%" 
          y2="58%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        <circle cx="70%" cy="58%" r="6" fill="#307fe2" />
        <line 
          x1="70%" 
          y1="58%" 
          x2="102%" 
          y2="65%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        
        {/* LEFT CONNECTOR - from USAA circle (upper-left edge, angled up-left) */}
        <line 
          x1="20%" 
          y1="62%" 
          x2="10%" 
          y2="55%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        <circle cx="10%" cy="55%" r="6" fill="#307fe2" />
        <line 
          x1="10%" 
          y1="55%" 
          x2="-2%" 
          y2="48%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        
        {/* RIGHT CONNECTOR - from Tecovas circle (right edge, steeper angle down-right) */}
        <line 
          x1="82%" 
          y1="78%" 
          x2="90%" 
          y2="92%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        <circle cx="90%" cy="92%" r="6" fill="#307fe2" />
        <line 
          x1="90%" 
          y1="92%" 
          x2="102%" 
          y2="102%" 
          stroke="#307fe2" 
          strokeWidth="4"
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
