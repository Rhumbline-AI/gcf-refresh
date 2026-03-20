'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap, registerGSAP, ScrollTrigger } from '@/utilities/gsapSetup'
import dotMatrixBg from '@/images/dot-matrix-background.gif'
import blueNoiseBg from '@/images/blue-noise-background.jpg'
import type { Project } from '@/payload-types'

registerGSAP()

function FloatingWrapper({
  children,
  className,
  style,
  entranceDelay = 0,
  floatAmount = 8,
  floatDuration = 4,
  swayAmount = 4,
  rotateAmount = 1.5,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  entranceDelay?: number
  floatAmount?: number
  floatDuration?: number
  swayAmount?: number
  rotateAmount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const tweens: gsap.core.Tween[] = []

    const entrance = gsap.fromTo(
      el,
      { opacity: 0, scale: 0.8, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        delay: entranceDelay,
        ease: 'power2.out',
        onComplete: () => {
          tweens.push(
            gsap.to(el, {
              y: floatAmount,
              duration: floatDuration,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            }),
            gsap.to(el, {
              x: swayAmount,
              duration: floatDuration * 1.3,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            }),
            gsap.to(el, {
              rotation: rotateAmount,
              duration: floatDuration * 1.6,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            }),
          )
        },
      },
    )

    return () => {
      entrance.kill()
      tweens.forEach((t) => t.kill())
    }
  }, [entranceDelay, floatAmount, floatDuration, swayAmount, rotateAmount])

  return (
    <div ref={ref} className={className} style={{ opacity: 0, ...style }}>
      {children}
    </div>
  )
}

export function WorkSection2({ projects, title }: { projects: Project[]; title?: string | null }) {
  const sectionRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !sectionRef.current) return

    const lines = svgRef.current.querySelectorAll('line')
    const circles = svgRef.current.querySelectorAll('circle')

    lines.forEach((line) => {
      const length = line.getTotalLength?.() || 300
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
    })
    circles.forEach((circle) => {
      gsap.set(circle, { scale: 0, transformOrigin: 'center', opacity: 0 })
    })

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline()
        lines.forEach((line, i) => {
          tl.to(line, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, i * 0.15)
        })
        circles.forEach((circle, i) => {
          tl.to(circle, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }, 0.3 + i * 0.2)
        })
      },
    })

    return () => st.kill()
  }, [])

  if (projects.length === 0) return null

  const displayProjects = projects.slice(0, 3)

  return (
    <section 
      ref={sectionRef}
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
        ref={svgRef}
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

      {/* MOBILE: staggered cascade layout */}
      <div className="flex flex-col gap-4 px-4 md:hidden">
        {displayProjects.map((project, i) => (
          <FloatingWrapper
            key={project.id}
            className={i % 2 === 0 ? 'self-end' : 'self-start'}
            entranceDelay={0.1 + i * 0.15}
            floatAmount={6}
            floatDuration={3.5 + i * 0.4}
            swayAmount={3}
            rotateAmount={1}
          >
            <ProjectCircle project={project} size="mobile" />
          </FloatingWrapper>
        ))}
      </div>

      {/* DESKTOP: absolute positioned layout */}
      <div className="hidden md:block">
        <div className="relative mx-auto w-full max-w-7xl -mb-32" style={{ minHeight: '380px' }}>
          {displayProjects[1] && (
            <FloatingWrapper
              className="absolute"
              style={{ top: '0%', left: '10%', zIndex: 2 }}
              entranceDelay={0.1}
              floatAmount={10}
              floatDuration={3.8}
              swayAmount={5}
              rotateAmount={1.2}
            >
              <ProjectCircle project={displayProjects[1]} size="medium" />
            </FloatingWrapper>
          )}

          {displayProjects[2] && (
            <FloatingWrapper
              className="absolute"
              style={{ top: '0%', right: '10%', zIndex: 2 }}
              entranceDelay={0.2}
              floatAmount={12}
              floatDuration={4.2}
              swayAmount={6}
              rotateAmount={1.8}
            >
              <ProjectCircle project={displayProjects[2]} size="medium" />
            </FloatingWrapper>
          )}
        </div>

        <div className="relative w-full flex justify-center" style={{ zIndex: 2 }}>
          {displayProjects[0] && (
            <FloatingWrapper
              entranceDelay={0.3}
              floatAmount={14}
              floatDuration={5}
              swayAmount={4}
              rotateAmount={1}
            >
              <ProjectCircle project={displayProjects[0]} size="xlarge" />
            </FloatingWrapper>
          )}
        </div>
      </div>
    </section>
  )
}

type ProjectCircleProps = {
  project: Project
  size: 'mobile' | 'medium' | 'xlarge'
}

const circleSizes = {
  mobile: { diameter: 190, image: 182, blue: 176 },
  medium: { diameter: 374, image: 363, blue: 341 },
  xlarge: { diameter: 575, image: 564, blue: 540 },
}

function ProjectCircle({ project, size }: ProjectCircleProps) {
  const { diameter, image: imageSize, blue: blueCircleSize } = circleSizes[size]
  
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
  
  const circleContent = (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center cursor-pointer rounded-full"
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
        filter: `drop-shadow(0 12px 28px rgba(0,0,0,0.12)) drop-shadow(0 4px 10px rgba(0,0,0,0.06))`,
      }}
      onMouseEnter={size !== 'mobile' ? handleMouseEnter : undefined}
      onMouseLeave={size !== 'mobile' ? handleMouseLeave : undefined}
    >
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id={`grain2-${project.id}`}>
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
        <div 
          className="absolute inset-0 rounded-full opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            filter: `url(#grain2-${project.id})`,
            backgroundColor: '#fff',
          }}
        />
      </div>
      
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
      
      <div
        ref={titleRef}
        className="absolute inset-0 flex items-center justify-start text-white font-bold"
        style={{
          fontSize: size === 'xlarge' ? '2.5rem' : size === 'mobile' ? '1rem' : '1.75rem',
          padding: size === 'mobile' ? '0 1.25rem' : '0 3rem',
          fontFamily: 'var(--font-inter)',
          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          zIndex: 3,
        }}
      >
        {project.title}
      </div>
      
      <div
        ref={hoverContentRef}
        className={`absolute inset-0 flex flex-col items-start justify-center ${size === 'mobile' ? 'hidden' : ''}`}
        style={{
          opacity: 0,
          transform: 'translateY(20px)',
          padding: '0 3rem 0 4rem',
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

  if (size === 'mobile') {
    return (
      <a href={`/work/${project.slug || ''}`} className="block rounded-full">
        {circleContent}
      </a>
    )
  }

  return circleContent
}
