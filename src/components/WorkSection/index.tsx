'use client'

import { motion } from 'framer-motion'
import React from 'react'
import dotMatrixBg from '@/images/dot-matrix-background.gif'
import type { Project } from '@/payload-types'

export function WorkSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  // For now, hardcode 3 projects layout - we'll expand this later
  const displayProjects = projects.slice(0, 3)

  // Circle sizes for reference
  const mediumDiameter = 340
  const xlargeDiameter = 575

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
        {/* LEFT CONNECTOR - from The Venetian circle (bottom-left edge) */}
        <line 
          x1="26%" 
          y1="38%" 
          x2="16%" 
          y2="52%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        <circle cx="16%" cy="52%" r="6" fill="#307fe2" />
        <line 
          x1="16%" 
          y1="52%" 
          x2="-2%" 
          y2="68%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        
        {/* RIGHT CONNECTOR - from USAA circle (bottom-right edge) */}
        <line 
          x1="74%" 
          y1="38%" 
          x2="84%" 
          y2="52%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        <circle cx="84%" cy="52%" r="6" fill="#307fe2" />
        <line 
          x1="84%" 
          y1="52%" 
          x2="102%" 
          y2="62%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        
        {/* BOTTOM CONNECTOR - from Safe Auto circle (bottom-left edge) */}
        <line 
          x1="42%" 
          y1="88%" 
          x2="30%" 
          y2="98%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        <circle cx="30%" cy="98%" r="6" fill="#307fe2" />
        <line 
          x1="30%" 
          y1="98%" 
          x2="-2%" 
          y2="115%" 
          stroke="#307fe2" 
          strokeWidth="4"
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
