'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap, registerGSAP, ScrollTrigger } from '@/utilities/gsapSetup'
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
  cursorFactor = 0.04,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  entranceDelay?: number
  floatAmount?: number
  floatDuration?: number
  swayAmount?: number
  rotateAmount?: number
  cursorFactor?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const cursorOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const tweens: gsap.core.Tween[] = []
    let st: ScrollTrigger | null = null

    gsap.set(el, { opacity: 0, scale: 0.6, y: 60 })

    // Use bottom of viewport (top 100%) so orbs partially below the fold still animate in promptly.
    // Previously `top 80%` left the third orb invisible until the user scrolled.
    st = ScrollTrigger.create({
      trigger: el,
      start: 'top 100%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          delay: entranceDelay,
          ease: 'power3.out',
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
        })
      },
    })

    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = -(e.clientX - cx) * cursorFactor
      const dy = -(e.clientY - cy) * cursorFactor
      const maxD = 40
      cursorOffset.current = {
        x: Math.max(-maxD, Math.min(maxD, dx)),
        y: Math.max(-maxD, Math.min(maxD, dy)),
      }
      gsap.to(el, {
        '--cx': `${cursorOffset.current.x}px`,
        '--cy': `${cursorOffset.current.y}px`,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      } as gsap.TweenVars)
    }

    if (!isTouch) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      st?.kill()
      tweens.forEach((t) => t.kill())
      if (!isTouch) window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [entranceDelay, floatAmount, floatDuration, swayAmount, rotateAmount, cursorFactor])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        translate: 'var(--cx, 0px) var(--cy, 0px)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function WorkSection2({
  projects,
  title,
  showCtaButton,
  ctaButtonLabel,
  ctaButtonLink,
}: {
  projects: Project[]
  title?: string | null
  showCtaButton?: boolean
  ctaButtonLabel?: string
  ctaButtonLink?: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)
  const orb3Ref = useRef<HTMLDivElement>(null)
  const recalcConnectorsRef = useRef<(() => void) | null>(null)

  const [sizeKey, setSizeKey] = useState<{ small: keyof typeof circleSizes; large: keyof typeof circleSizes }>({ small: 'medium', large: 'xlarge' })
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 768) setSizeKey({ small: 'mobile', large: 'mobileLarge' })
      else if (w < 1024) setSizeKey({ small: 'tablet', large: 'tabletLarge' })
      else setSizeKey({ small: 'medium', large: 'xlarge' })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!svgRef.current || !sectionRef.current) return
    const svg = svgRef.current
    const section = sectionRef.current
    let animated = false

    const sa = (el: Element | null, attrs: Record<string, string | number>) => {
      if (!el) return
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)))
    }

    // Manual line length — more reliable than getTotalLength() on <line> elements
    const lineLen = (line: Element) => {
      const x1 = parseFloat(line.getAttribute('x1') || '0')
      const y1 = parseFloat(line.getAttribute('y1') || '0')
      const x2 = parseFloat(line.getAttribute('x2') || '0')
      const y2 = parseFloat(line.getAttribute('y2') || '0')
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    }

    const calcConnectors = () => {
      const sRect = section.getBoundingClientRect()
      const W = sRect.width
      const H = sRect.height

      const getOrb = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) return null
        const r = ref.current.getBoundingClientRect()
        return {
          cx: r.left - sRect.left + r.width / 2,
          cy: r.top - sRect.top + r.height / 2,
          r: r.width / 2,
        }
      }

      const o1 = getOrb(orb1Ref) // left medium orb
      const o3 = getOrb(orb3Ref) // center xlarge orb

      // Mobile-aware bend offset: clamp the X bend to keep dots safely inside the viewport.
      const isMobile = W < 768
      const minEdgeGap = isMobile ? 24 : 12

      if (o1) {
        // LEFT connector: comes from LOW, elbow BELOW orb, arm angles UP into orb bottom
        const lBendX = Math.max(minEdgeGap, o1.cx - o1.r * (isMobile ? 1.0 : 1.30))
        const lBendY = o1.cy + o1.r * 1.15
        const lOrbX  = o1.cx - o1.r * 0.48
        const lOrbY  = o1.cy + o1.r * 0.72
        sa(svg.querySelector('.ll1'), { x1: -80, y1: H * 0.85, x2: lBendX, y2: lBendY })
        sa(svg.querySelector('.ll2'), { x1: lBendX, y1: lBendY, x2: lOrbX, y2: lOrbY })
        sa(svg.querySelector('.dl'),  { cx: lBendX, cy: lBendY })

        // Decorative ring: anchored to left orb, upper-left
        const dcR = o1.r * 0.78
        sa(svg.querySelector('.dec-ring'), { cx: o1.cx - o1.r * 0.48, cy: o1.cy - o1.r * 0.42, r: dcR })
      }

      if (o3) {
        // RIGHT connector: comes from HIGH, elbow far out at orb-level, arm goes horizontal into orb side
        const bBendX = Math.min(W - minEdgeGap, o3.cx + o3.r * (isMobile ? 1.1 : 1.50))
        const bBendY = o3.cy + o3.r * 0.35
        const bOrbX  = o3.cx + o3.r * 0.80
        const bOrbY  = o3.cy + o3.r * 0.38
        sa(svg.querySelector('.bl1'), { x1: W + 80, y1: H * 0.15, x2: bBendX, y2: bBendY })
        sa(svg.querySelector('.bl2'), { x1: bBendX, y1: bBendY, x2: bOrbX, y2: bOrbY })
        sa(svg.querySelector('.db'),  { cx: bBendX, cy: bBendY })
      }

      if (!animated) {
        // Set initial hidden state AFTER coordinates are correct
        svg.querySelectorAll<SVGLineElement>('line').forEach(line => {
          const len = lineLen(line)
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
        })
        svg.querySelectorAll('.dot').forEach(d => gsap.set(d, { opacity: 0 }))
        const ring = svg.querySelector('.dec-ring')
        if (ring && o1) {
          const len = 2 * Math.PI * (o1.r * 0.78)
          gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 })
        }
      } else {
        // Animation already played — clear GSAP CSS styles so lines render at full length always
        svg.querySelectorAll<SVGLineElement>('line').forEach(line => {
          line.style.strokeDasharray = ''
          line.style.strokeDashoffset = ''
        })
        const ring = svg.querySelector<SVGElement>('.dec-ring')
        if (ring) {
          ring.style.strokeDasharray = ''
          ring.style.strokeDashoffset = ''
        }
      }
    }

    let rafId: number | null = null
    const scheduleCalc = () => {
      if (rafId != null) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        rafId = null
        calcConnectors()
      })
    }

    calcConnectors()

    const ro = new ResizeObserver(scheduleCalc)
    ro.observe(section)
    if (orb1Ref.current) ro.observe(orb1Ref.current)
    if (orb3Ref.current) ro.observe(orb3Ref.current)
    window.addEventListener('resize', scheduleCalc)
    recalcConnectorsRef.current = scheduleCalc

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        animated = true
        // Orbs animate in via FloatingWrapper (0–1.0s). Lines draw after.
        const clearDash = () => {
          svg.querySelectorAll<SVGLineElement>('line').forEach(l => { l.style.strokeDasharray = ''; l.style.strokeDashoffset = '' })
          const r = svg.querySelector<SVGElement>('.dec-ring')
          if (r) { r.style.strokeDasharray = ''; r.style.strokeDashoffset = '' }
        }
        const tl = gsap.timeline({ delay: 1.2, onComplete: clearDash })

        // All element references scoped to this section's SVG
        const ll1 = svg.querySelector('.ll1')
        const ll2 = svg.querySelector('.ll2')
        const bl1 = svg.querySelector('.bl1')
        const bl2 = svg.querySelector('.bl2')
        const dl  = svg.querySelector('.dl')
        const db  = svg.querySelector('.db')
        const ring = svg.querySelector('.dec-ring')

        // Long segments from edges
        if (ll1) tl.to(ll1, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut' }, 0)
        if (bl1) tl.to(bl1, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut' }, 0.1)

        // Dots fade in at bend points
        if (dl) tl.to(dl, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.85)
        if (db) tl.to(db, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.95)

        // Short segments to orbs
        if (ll2) tl.to(ll2, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, 1.0)
        if (bl2) tl.to(bl2, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, 1.1)

        // Decorative ring draws on
        if (ring) tl.to(ring, { strokeDashoffset: 0, opacity: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
      },
    })

    return () => {
      st.kill()
      ro.disconnect()
      window.removeEventListener('resize', scheduleCalc)
      if (rafId != null) cancelAnimationFrame(rafId)
      recalcConnectorsRef.current = null
    }
  }, [])

  // When responsive sizeKey changes, defer a recalc so orbs have settled at their new size
  useEffect(() => {
    const recalc = recalcConnectorsRef.current
    if (recalc) {
      requestAnimationFrame(() => requestAnimationFrame(() => recalc()))
    }
  }, [sizeKey])

  if (projects.length === 0) return null

  const displayProjects = projects.slice(0, 3)

  return (
    <section
      ref={sectionRef}
      className="relative pt-0 pb-16 md:pb-24 -mb-8 md:mb-0 dot-matrix-bg"
    >
      {/* SVG: lines + decorative ring — positions calculated dynamically from orb refs */}
      <svg
        ref={svgRef}
        className="absolute pointer-events-none overflow-visible"
        style={{ top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
      >
        {/* Left connector */}
        <line className="ll1" stroke="#307fe2" strokeWidth={sizeKey.small === 'mobile' ? 2 : sizeKey.small === 'tablet' ? 3 : 4} x1="0" y1="0" x2="0" y2="0" />
        <line className="ll2" stroke="#307fe2" strokeWidth={sizeKey.small === 'mobile' ? 2 : sizeKey.small === 'tablet' ? 3 : 4} x1="0" y1="0" x2="0" y2="0" />
        <circle className="dl dot" r={sizeKey.small === 'mobile' ? 5 : sizeKey.small === 'tablet' ? 6 : 8} fill="#307fe2" cx="0" cy="0" />
        {/* Bottom connector */}
        <line className="bl1" stroke="#307fe2" strokeWidth={sizeKey.small === 'mobile' ? 2 : sizeKey.small === 'tablet' ? 3 : 4} x1="0" y1="0" x2="0" y2="0" />
        <line className="bl2" stroke="#307fe2" strokeWidth={sizeKey.small === 'mobile' ? 2 : sizeKey.small === 'tablet' ? 3 : 4} x1="0" y1="0" x2="0" y2="0" />
        <circle className="db dot" r={sizeKey.small === 'mobile' ? 5 : sizeKey.small === 'tablet' ? 6 : 8} fill="#307fe2" cx="0" cy="0" />
        {/* Decorative ring — anchored to left orb */}
        <circle className="dec-ring" fill="none" stroke="#307fe2" strokeWidth={sizeKey.small === 'mobile' ? 3 : sizeKey.small === 'tablet' ? 4 : 5} cx="0" cy="0" r="200" />
      </svg>

      {/* Responsive layout — same structure at all widths, sizes adapt */}
      {/* max-w-6xl (1152px) caps spread on wide screens; orbs at 8% pull them inward to tighten the gap */}
      <div>
        <div className="relative mx-auto w-full max-w-6xl -mb-16 md:-mb-32" style={{ minHeight: sizeKey.small === 'mobile' ? '225px' : sizeKey.small === 'tablet' ? '290px' : '405px' }}>
          <div ref={orb1Ref} className="absolute" style={{ top: '0%', left: '8%', zIndex: 2 }}>
            {displayProjects[1] && (
              <FloatingWrapper
                entranceDelay={0.1}
                floatAmount={sizeKey.small === 'mobile' ? 4 : sizeKey.small === 'tablet' ? 6 : 10}
                floatDuration={3.8}
                swayAmount={sizeKey.small === 'mobile' ? 2 : sizeKey.small === 'tablet' ? 3 : 5}
                rotateAmount={1.2}
                cursorFactor={0.04}
              >
                <ProjectCircle project={displayProjects[1]} size={sizeKey.small} />
              </FloatingWrapper>
            )}
          </div>

          <div ref={orb2Ref} className="absolute" style={{ top: '0%', right: '8%', zIndex: 2 }}>
            {displayProjects[2] && (
              <FloatingWrapper
                entranceDelay={0.2}
                floatAmount={sizeKey.small === 'mobile' ? 4 : sizeKey.small === 'tablet' ? 7 : 12}
                floatDuration={4.2}
                swayAmount={sizeKey.small === 'mobile' ? 2 : sizeKey.small === 'tablet' ? 4 : 6}
                rotateAmount={1.8}
                cursorFactor={0.03}
              >
                <ProjectCircle project={displayProjects[2]} size={sizeKey.small} />
              </FloatingWrapper>
            )}
          </div>
        </div>

        <div className="relative w-full flex justify-center" style={{ zIndex: 2 }}>
          <div ref={orb3Ref} className="inline-block">
            {displayProjects[0] && (
              <FloatingWrapper
                entranceDelay={0.3}
                floatAmount={sizeKey.small === 'mobile' ? 5 : sizeKey.small === 'tablet' ? 8 : 14}
                floatDuration={5}
                swayAmount={sizeKey.small === 'mobile' ? 2 : sizeKey.small === 'tablet' ? 3 : 4}
                rotateAmount={1}
                cursorFactor={0.02}
              >
                <ProjectCircle project={displayProjects[0]} size={sizeKey.large} />
              </FloatingWrapper>
            )}
          </div>
        </div>

        {showCtaButton && ctaButtonLink && (
          <div className="relative w-full flex justify-center mt-12 md:mt-16" style={{ zIndex: 2 }}>
            <a
              href={ctaButtonLink}
              className="inline-flex items-center gap-2 px-8 py-4 md:px-10 md:py-5 rounded-full bg-[#307fe2] text-white font-bold uppercase tracking-wider text-sm md:text-base hover:opacity-90 transition-opacity shadow-lg"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {ctaButtonLabel || 'More Case Studies'}
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 8h10m0 0L9 4m4 4l-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

type ProjectCircleProps = {
  project: Project
  size: keyof typeof circleSizes
}

const circleSizes = {
  mobile: { diameter: 180, image: 172, blue: 164 },
  mobileLarge: { diameter: 300, image: 290, blue: 278 },
  tablet: { diameter: 260, image: 250, blue: 238 },
  tabletLarge: { diameter: 420, image: 408, blue: 390 },
  medium: { diameter: 387, image: 375, blue: 353 },
  xlarge: { diameter: 594, image: 583, blue: 559 },
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
      onMouseEnter={size !== 'mobile' && size !== 'mobileLarge' ? handleMouseEnter : undefined}
      onMouseLeave={size !== 'mobile' && size !== 'mobileLarge' ? handleMouseLeave : undefined}
    >
      <div
        ref={blueCircleRef}
        className="absolute rounded-full overflow-hidden"
        style={{
          width: `${blueCircleSize}px`,
          height: `${blueCircleSize}px`,
          backgroundColor: '#307fe2',
          backgroundImage: `linear-gradient(rgba(48,127,226,0.35), rgba(48,127,226,0.35)), url(${blueNoiseBg.src})`,
          backgroundSize: 'auto, 200%',
          backgroundPosition: '0% 0%',
          animation: 'blueNoiseShift 2s steps(10) infinite',
          zIndex: 1,
        }}
      >
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
        className="absolute inset-0 flex flex-col items-start justify-center text-white font-bold"
        style={{
          fontSize: size === 'xlarge' ? '3rem' : size === 'mobile' ? '1.05rem' : size === 'mobileLarge' ? '1.4rem' : size === 'tablet' ? '1.25rem' : size === 'tabletLarge' ? '1.6rem' : '2.1rem',
          padding: size === 'mobile' ? '0 1.25rem' : size === 'mobileLarge' ? '0 1.75rem' : size === 'tablet' || size === 'tabletLarge' ? '0 2rem' : '0 3rem',
          fontFamily: 'var(--font-inter)',
          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          zIndex: 3,
        }}
      >
        <span>{project.title}</span>
        {/* Mobile/tablet: always-visible CTA so users know orb is tappable */}
        {(size === 'mobile' || size === 'mobileLarge' || size === 'tablet' || size === 'tabletLarge') && (
          <span
            className="mt-2 inline-flex items-center gap-1 text-white/90 font-semibold uppercase tracking-wider"
            style={{
              fontSize: size === 'mobile' ? '0.6rem' : size === 'tablet' ? '0.7rem' : '0.75rem',
              fontFamily: 'var(--font-inter)',
            }}
          >
            See Case Study
            <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h7m0 0L6 3m3 3L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
      
      {size !== 'mobile' && size !== 'mobileLarge' && size !== 'tablet' && size !== 'tabletLarge' && <div
        ref={hoverContentRef}
        className="absolute inset-0 flex flex-col items-start justify-center"
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
      </div>}
    </div>
  )

  if (size === 'mobile' || size === 'mobileLarge' || size === 'tablet' || size === 'tabletLarge') {
    return (
      <a href={`/work/${project.slug || ''}`} className="block rounded-full">
        {circleContent}
      </a>
    )
  }

  return circleContent
}
