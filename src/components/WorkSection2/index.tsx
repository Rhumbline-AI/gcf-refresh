'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import dotMatrixBg from '@/images/dot-matrix-background.gif'
import blueNoiseBg from '@/images/blue-noise-background.jpg'
import type { Project } from '@/payload-types'

function FloatingWrapper({
  children,
  className,
  style,
  entranceDelay = 0,
  floatAmount = 8,
  floatDuration = 4,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  entranceDelay?: number
  floatAmount?: number
  floatDuration?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.fromTo(
      ref.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: entranceDelay,
        ease: 'power2.out',
        onComplete: () => {
          if (!ref.current) return
          gsap.to(ref.current, {
            y: floatAmount,
            duration: floatDuration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          })
        },
      },
    )
  }, [entranceDelay, floatAmount, floatDuration])

  return (
    <div ref={ref} className={className} style={{ opacity: 0, ...style }}>
      {children}
    </div>
  )
}

export function WorkSection2({ projects, title }: { projects: Project[]; title?: string | null }) {
  if (projects.length === 0) return null

  const displayProjects = projects.slice(0, 3)

  return (
    <section 
      className="relative pt-0 pb-0 md:pt-0 md:pb-0"
      style={{
        backgroundImage: `url(${dotMatrixBg.src})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px',
        backgroundPosition: '0 0',
        backgroundColor: '#ffffff',
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
          y1="32%" 
          x2="16%" 
          y2="46%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        <circle cx="16%" cy="46%" r="6" fill="#307fe2" />
        <line 
          x1="16%" 
          y1="46%" 
          x2="-2%" 
          y2="62%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        
        {/* BOTTOM CONNECTOR - from large center circle (bottom-right edge) */}
        <line 
          x1="58%" 
          y1="80%" 
          x2="66%" 
          y2="88%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        <circle cx="66%" cy="88%" r="6" fill="#307fe2" />
        <line 
          x1="66%" 
          y1="88%" 
          x2="102%" 
          y2="96%" 
          stroke="#307fe2" 
          strokeWidth="4"
        />
        
        {/* DECORATIVE PARTIAL CIRCLE - left side of screen */}
        <circle 
          cx="-2%" 
          cy="75%" 
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
          <FloatingWrapper
            className="absolute"
            style={{ top: '0%', left: '10%', zIndex: 2 }}
            entranceDelay={0.1}
            floatAmount={8}
            floatDuration={3.8}
          >
            <ProjectCircle project={displayProjects[1]} size="medium" />
          </FloatingWrapper>
        )}

        {/* Top Right Circle */}
        {displayProjects[2] && (
          <FloatingWrapper
            className="absolute"
            style={{ top: '0%', right: '10%', zIndex: 2 }}
            entranceDelay={0.2}
            floatAmount={10}
            floatDuration={4.2}
          >
            <ProjectCircle project={displayProjects[2]} size="medium" />
          </FloatingWrapper>
        )}
      </div>

      {/* Bottom Row - Large centered circle */}
      <div className="relative w-full flex justify-center" style={{ zIndex: 2 }}>
        {/* Bottom Center Circle - Large */}
        {displayProjects[0] && (
          <FloatingWrapper
            entranceDelay={0.3}
            floatAmount={12}
            floatDuration={5}
          >
            <ProjectCircle project={displayProjects[0]} size="xlarge" />
          </FloatingWrapper>
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

    gsap.killTweensOf([blueCircleRef.current, imageRef.current, titleRef.current, hoverContentRef.current])
    
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

    gsap.killTweensOf([blueCircleRef.current, imageRef.current, titleRef.current, hoverContentRef.current])
    
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
