'use client'

import { motion } from 'framer-motion'
import React from 'react'
import dotMatrixBg from '@/images/dot-matrix-background.gif'
import type { Project } from '@/payload-types'

export function WorkSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  // For now, hardcode 3 projects layout - we'll expand this later
  const displayProjects = projects.slice(0, 3)

  return (
    <section 
      className="relative py-16 md:py-24 -mt-16 md:-mt-24"
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
        {/* Line from The Venetian - diagonal going down and to the LEFT edge */}
        <line 
          x1="28%" 
          y1="480" 
          x2="0" 
          y2="750" 
          stroke="#307fe2" 
          strokeWidth="3"
        />
        
        {/* Tecovas connector arm - elbow shape */}
        {/* First segment: vertical line down from Tecovas */}
        <line 
          x1="72%" 
          y1="480" 
          x2="72%" 
          y2="580" 
          stroke="#307fe2" 
          strokeWidth="3"
        />
        {/* Node at the elbow */}
        <circle cx="72%" cy="580" r="5" fill="#307fe2" />
        
        {/* Second segment: horizontal line to right viewport edge */}
        <line 
          x1="72%" 
          y1="580" 
          x2="100%" 
          y2="580" 
          stroke="#307fe2" 
          strokeWidth="3"
        />
      </svg>

      <div className="container">
        <h2 className="mb-16 text-4xl md:text-5xl font-light text-center" style={{ fontFamily: 'var(--font-inter)' }}>
          The work
        </h2>
      </div>

      {/* Top Row - Two circles */}
      <div className="relative mx-auto w-full max-w-7xl -mb-16" style={{ minHeight: '420px' }}>
        {/* Top Left Circle - The Venetian */}
        {displayProjects[0] && (
          <motion.div
            className="absolute"
            style={{
              top: '0%',
              left: '10%',
              zIndex: 2,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ProjectCircle project={displayProjects[0]} size="medium" />
          </motion.div>
        )}

        {/* Top Right Circle - Tecovas */}
        {displayProjects[1] && (
          <motion.div
            className="absolute"
            style={{
              top: '0%',
              right: '10%',
              zIndex: 2,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProjectCircle project={displayProjects[1]} size="medium" />
          </motion.div>
        )}
      </div>

      {/* Bottom Row - Large centered circle */}
      <div className="relative w-full flex justify-center">
        {/* Bottom Center Circle - USAA (larger) */}
        {displayProjects[2] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ProjectCircle project={displayProjects[2]} size="xlarge" />
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
  const diameter = size === 'xlarge' ? 500 : 340
  const imageSize = size === 'xlarge' ? 490 : 330 // Image size
  const blueCircleSize = size === 'xlarge' ? 470 : 310 // Blue circle smaller - thinner border
  
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
