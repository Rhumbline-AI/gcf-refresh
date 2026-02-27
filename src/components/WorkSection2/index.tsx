'use client'

import { motion } from 'framer-motion'
import React, { useRef, useState } from 'react'
import { gsap } from 'gsap'
import dotMatrixBg from '@/images/dot-matrix-background.gif'
import blueNoiseBg from '@/images/blue-noise-background.jpg'
import type { Project } from '@/payload-types'

export function WorkSection2({ projects, title }: { projects: Project[]; title?: string | null }) {
  if (projects.length === 0) return null

  // For now, hardcode 3 projects layout
  const displayProjects = projects.slice(0, 3)

  return (
    <section 
      className="relative py-8 md:py-12 -mt-24 md:-mt-32"
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
        {/* LEFT CONNECTOR - from top-left circle (bottom-left edge) */}
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
        
        {/* BOTTOM CONNECTOR - from large center circle (bottom-right edge) */}
        <line 
          x1="58%" 
          y1="88%" 
          x2="68%" 
          y2="105%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        <circle cx="68%" cy="105%" r="6" fill="#307fe2" />
        <line 
          x1="68%" 
          y1="105%" 
          x2="102%" 
          y2="115%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        
        {/* DECORATIVE PARTIAL CIRCLE - left side of screen */}
        <circle 
          cx="-2%" 
          cy="85%" 
          r="160" 
          fill="none"
          stroke="#307fe2" 
          strokeWidth="4"
        />
      </svg>

      {/* Top Row - Two smaller circles */}
      <div className="relative mx-auto w-full max-w-7xl -mb-32" style={{ minHeight: '380px' }}>
        {/* Top Left Circle */}
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
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ProjectCircle project={displayProjects[1]} size="medium" />
          </motion.div>
        )}

        {/* Top Right Circle */}
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
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProjectCircle project={displayProjects[2]} size="medium" />
          </motion.div>
        )}
      </div>

      {/* Bottom Row - Large centered circle */}
      <div className="relative w-full flex justify-center">
        {/* Bottom Center Circle - Large */}
        {displayProjects[0] && (
          <motion.div
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
  project: Project
  size: 'medium' | 'xlarge'
}

function ProjectCircle({ project, size }: ProjectCircleProps) {
  const diameter = size === 'xlarge' ? 575 : 374
  const imageSize = size === 'xlarge' ? 564 : 363
  const blueCircleSize = size === 'xlarge' ? 540 : 341
  
  const containerRef = useRef<HTMLDivElement>(null)
  const blueCircleRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const hoverContentRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const thumbnailUrl = typeof project.thumbnail === 'object' && project.thumbnail !== null 
    ? project.thumbnail.url 
    : null

  const handleMouseEnter = () => {
    setIsHovered(true)
    
    gsap.to(blueCircleRef.current, {
      filter: 'blur(30px)',
      duration: 0.4,
      ease: 'power2.out',
    })
    
    gsap.to(imageRef.current, {
      filter: 'blur(20px)',
      opacity: 0.2,
      duration: 0.4,
      ease: 'power2.out',
    })
    
    gsap.to(titleRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.out',
    })
    
    gsap.to(hoverContentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      delay: 0.1,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    
    gsap.to(blueCircleRef.current, {
      filter: 'blur(0px)',
      duration: 0.4,
      ease: 'power2.out',
    })
    
    gsap.to(imageRef.current, {
      filter: 'blur(0px)',
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    })
    
    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    })
    
    gsap.to(hoverContentRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: 'power2.out',
    })
  }
  
  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center cursor-pointer"
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* SVG filter for film grain effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id={`grain-${project.id}`}>
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.8" 
              numOctaves="4" 
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="monoNoise"
            />
            <feBlend 
              in="SourceGraphic" 
              in2="monoNoise" 
              mode="multiply" 
            />
          </filter>
        </defs>
      </svg>
      
      {/* Solid blue circle with noise texture and grain filter */}
      <div
        ref={blueCircleRef}
        className="absolute rounded-full overflow-hidden"
        style={{
          width: `${blueCircleSize}px`,
          height: `${blueCircleSize}px`,
          backgroundColor: '#307fe2',
          backgroundImage: `url(${blueNoiseBg.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          zIndex: 1,
        }}
      >
        {/* Grain overlay */}
        <div 
          className="absolute inset-0 rounded-full opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            filter: `url(#grain-${project.id})`,
            backgroundColor: '#fff',
          }}
        />
      </div>
      
      {/* Project image */}
      {thumbnailUrl && (
        <img
          ref={imageRef}
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
      
      {/* Title overlay - visible by default */}
      <div
        ref={titleRef}
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
      
      {/* Hover content - hidden by default */}
      <div
        ref={hoverContentRef}
        className="absolute inset-0 flex flex-col items-start justify-center px-12 pl-16"
        style={{
          opacity: 0,
          transform: 'translateY(20px)',
          zIndex: 4,
        }}
      >
        <p 
          className="text-white mb-6"
          style={{
            fontSize: size === 'xlarge' ? '1.5rem' : '1.125rem',
            fontFamily: 'var(--font-inter)',
            fontWeight: 300,
            lineHeight: 1.4,
            maxWidth: '80%',
          }}
        >
          {project.title === 'Tecovas' && 'How boots became a brand platform.'}
          {project.title === 'The Venetian' && 'Reimagining luxury hospitality.'}
          {project.title === 'USAA' && 'Banking on trust and service.'}
          {project.title === 'Safe Auto' && 'Making insurance accessible.'}
          {!['Tecovas', 'The Venetian', 'USAA', 'Safe Auto'].includes(project.title) && 'Discover the story behind this project.'}
        </p>
        <a 
          href={`/work/${project.slug || ''}`}
          className="text-white font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
          style={{
            fontSize: size === 'xlarge' ? '1rem' : '0.875rem',
            fontFamily: 'var(--font-inter)',
          }}
        >
          See Case Study &gt;
        </a>
      </div>
    </div>
  )
}
