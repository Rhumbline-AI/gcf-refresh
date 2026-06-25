'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap, registerGSAP, ScrollTrigger } from '@/utilities/gsapSetup'
import blueNoiseBg from '@/images/blue-noise-background.jpg'
import type { Project } from '@/payload-types'
import { FloatingWrapper } from './FloatingWrapper'

registerGSAP()

export function WorkSection({ projects, title }: { projects: Project[]; title?: string | null }) {
  const sectionRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)
  const recalcConnectorsRef = useRef<(() => void) | null>(null)

  // Responsive sizing: defaults to desktop, switches after hydration
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

    // Get an orb's STATIC center (no FloatingWrapper transforms). Used to compute
    // the bend (elbow) position, which stays fixed in space.
    const getStaticOrb = (ref: React.RefObject<HTMLDivElement | null>, sRect: DOMRect) => {
      if (!ref.current) return null
      const r = ref.current.getBoundingClientRect()
      return {
        cx: r.left - sRect.left + r.width / 2,
        cy: r.top - sRect.top + r.height / 2,
        r: r.width / 2,
      }
    }

    // Get an orb's CURRENT VISUAL center (with FloatingWrapper transforms applied).
    // FloatingWrapper applies transforms to two nested inner divs, so we read the
    // bounding rect of the deeper one to capture the live float/cursor offset.
    const getVisualOrbCenter = (ref: React.RefObject<HTMLDivElement | null>, sRect: DOMRect) => {
      if (!ref.current) return null
      const inner = ref.current.querySelector(':scope > div > div') as HTMLElement | null
      const target = inner || ref.current
      const r = target.getBoundingClientRect()
      return {
        cx: r.left - sRect.left + r.width / 2,
        cy: r.top - sRect.top + r.height / 2,
      }
    }

    // Recalculate all SVG positions based on actual orb DOM positions
    const calcConnectors = () => {
      const sRect = section.getBoundingClientRect()
      const W = sRect.width
      const H = sRect.height

      const o1 = getStaticOrb(orb1Ref, sRect)
      const o2 = getStaticOrb(orb2Ref, sRect)
      if (!o1 || !o2) return

      // Mobile-aware bend offset: on small screens, orbs are tiny so r*1.40 can push the bend
      // dot off-screen. Clamp the X bend to keep dots safely inside the viewport.
      const isMobile = W < 768
      const minEdgeGap = isMobile ? 24 : 12

      // LEFT connector: edge → bend (elbow) → orb CENTER. Tip is continuously
      // re-anchored to the orb's live visual center via gsap.ticker so the line
      // visually pivots at the bend as the orb floats / drifts.
      const lBendX = Math.max(minEdgeGap, o1.cx - o1.r * (isMobile ? 1.05 : 1.40))
      const lBendY = o1.cy - o1.r * 0.30
      const v1 = getVisualOrbCenter(orb1Ref, sRect) || { cx: o1.cx, cy: o1.cy }
      sa(svg.querySelector('.ll1'), { x1: -80, y1: H * 0.18, x2: lBendX, y2: lBendY })
      sa(svg.querySelector('.ll2'), { x1: lBendX, y1: lBendY, x2: v1.cx, y2: v1.cy })
      sa(svg.querySelector('.dl'),  { cx: lBendX, cy: lBendY })
      sa(svg.querySelector('.dl_end'), { cx: v1.cx, cy: v1.cy })

      // RIGHT connector: edge → bend (elbow) → orb CENTER. Tip follows orb live.
      const rBendX = Math.min(W - minEdgeGap, o2.cx + o2.r * (isMobile ? 1.05 : 1.30))
      const rBendY = o2.cy + o2.r * 1.00
      const v2 = getVisualOrbCenter(orb2Ref, sRect) || { cx: o2.cx, cy: o2.cy }
      sa(svg.querySelector('.rl1'), { x1: W + 80, y1: H * 0.78, x2: rBendX, y2: rBendY })
      sa(svg.querySelector('.rl2'), { x1: rBendX, y1: rBendY, x2: v2.cx, y2: v2.cy })
      sa(svg.querySelector('.dr'),  { cx: rBendX, cy: rBendY })
      sa(svg.querySelector('.dr_end'), { cx: v2.cx, cy: v2.cy })

      // Decorative ring: anchored to RIGHT orb (USAA) — Venn-overlap upper area, away from lines
      // On mobile the title above the orbs is much closer, so push the ring
      // lower and further right so it doesn't intrude into the "The work" type.
      // Desktop tuning preserved (cx +0.10, cy -0.85 of orb radius).
      const dcR = o2.r * 0.85
      const ringCxOffset = isMobile ? o2.r * 0.45 : o2.r * 0.10
      const ringCyOffset = isMobile ? -o2.r * 0.55 : -o2.r * 0.85
      sa(svg.querySelector('.dec-ring'), { cx: o2.cx + ringCxOffset, cy: o2.cy + ringCyOffset, r: dcR })

      if (!animated) {
        // Set initial hidden state AFTER coordinates are correct
        svg.querySelectorAll<SVGLineElement>('line').forEach(line => {
          const len = lineLen(line)
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
        })
        svg.querySelectorAll('.dot').forEach(d => gsap.set(d, { opacity: 0 }))
        const ring = svg.querySelector('.dec-ring')
        if (ring) {
          const len = 2 * Math.PI * (o2.r * 0.85)
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

    // Defer to next frame so DOM has settled after orb resize
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
    if (orb2Ref.current) ro.observe(orb2Ref.current)
    window.addEventListener('resize', scheduleCalc)

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        animated = true
        // Orbs animate in via FloatingWrapper (0–1.0s). Lines draw after.
        // onComplete: clear GSAP CSS styles so lines stay fully drawn at any width
        const clearDash = () => {
          svg.querySelectorAll<SVGLineElement>('line').forEach(l => { l.style.strokeDasharray = ''; l.style.strokeDashoffset = '' })
          const r = svg.querySelector<SVGElement>('.dec-ring')
          if (r) { r.style.strokeDasharray = ''; r.style.strokeDashoffset = '' }
        }
        const tl = gsap.timeline({ delay: 1.2, onComplete: clearDash })

        // Long segments first (from screen edges toward bend dots)
        const ll1 = svg.querySelector('.ll1')
        const rl1 = svg.querySelector('.rl1')
        const ll2 = svg.querySelector('.ll2')
        const rl2 = svg.querySelector('.rl2')
        const dl  = svg.querySelector('.dl')
        const dr  = svg.querySelector('.dr')
        const dlEnd = svg.querySelector('.dl_end')
        const drEnd = svg.querySelector('.dr_end')
        const ring = svg.querySelector('.dec-ring')

        if (ll1) tl.to(ll1, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut' }, 0)
        if (rl1) tl.to(rl1, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut' }, 0.1)

        // Bend dots fade in when long segments reach them
        if (dl) tl.to(dl, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.85)
        if (dr) tl.to(dr, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.95)

        // Short segments (bend → orb) draw after dots appear
        if (ll2) tl.to(ll2, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, 1.0)
        if (rl2) tl.to(rl2, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, 1.1)

        // Terminus dots fade in alongside the line tips arriving at the orbs
        if (dlEnd) tl.to(dlEnd, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 1.4)
        if (drEnd) tl.to(drEnd, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 1.5)

        // Decorative ring draws on in parallel with lines
        if (ring) tl.to(ring, { strokeDashoffset: 0, opacity: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
      },
    })

    // Live-anchor the line tips + terminus dots to each orb's current visual
    // center so the line "pivots" at the fixed bend as the orbs float / drift.
    const ll2El = svg.querySelector('.ll2')
    const rl2El = svg.querySelector('.rl2')
    const dlEndEl = svg.querySelector('.dl_end')
    const drEndEl = svg.querySelector('.dr_end')
    const liveAnchor = () => {
      if (!animated) return
      const sr = section.getBoundingClientRect()
      const v1 = getVisualOrbCenter(orb1Ref, sr)
      if (v1 && ll2El) {
        ll2El.setAttribute('x2', String(v1.cx))
        ll2El.setAttribute('y2', String(v1.cy))
      }
      if (v1 && dlEndEl) {
        dlEndEl.setAttribute('cx', String(v1.cx))
        dlEndEl.setAttribute('cy', String(v1.cy))
      }
      const v2 = getVisualOrbCenter(orb2Ref, sr)
      if (v2 && rl2El) {
        rl2El.setAttribute('x2', String(v2.cx))
        rl2El.setAttribute('y2', String(v2.cy))
      }
      if (v2 && drEndEl) {
        drEndEl.setAttribute('cx', String(v2.cx))
        drEndEl.setAttribute('cy', String(v2.cy))
      }
    }
    gsap.ticker.add(liveAnchor)

    // Expose recalc for the sizeKey effect below
    recalcConnectorsRef.current = scheduleCalc

    return () => {
      st.kill()
      ro.disconnect()
      window.removeEventListener('resize', scheduleCalc)
      if (rafId != null) cancelAnimationFrame(rafId)
      gsap.ticker.remove(liveAnchor)
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
      className="relative pt-0 pb-0 -mt-8 md:-mt-16 -mb-8 md:mb-0 dot-matrix-bg"
    >
      {/* SVG: lines + decorative ring — positions calculated dynamically from orb refs */}
      <svg
        ref={svgRef}
        className="absolute pointer-events-none overflow-visible"
        style={{ top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
      >
        {/* Left connector: long (edge→bend) + short (bend→orb) */}
        <line className="ll1" stroke="#307fe2" strokeWidth={sizeKey.small === 'mobile' ? 2 : sizeKey.small === 'tablet' ? 3 : 4} x1="0" y1="0" x2="0" y2="0" />
        <line className="ll2" stroke="#307fe2" strokeWidth={sizeKey.small === 'mobile' ? 2 : sizeKey.small === 'tablet' ? 3 : 4} x1="0" y1="0" x2="0" y2="0" />
        <circle className="dl dot" r={sizeKey.small === 'mobile' ? 5 : sizeKey.small === 'tablet' ? 6 : 8} fill="#307fe2" cx="0" cy="0" />
        {/* Left line terminus dot — sits at the orb's center, follows it live (mostly hidden behind the orb) */}
        <circle className="dl_end dot" r={sizeKey.small === 'mobile' ? 5 : sizeKey.small === 'tablet' ? 6 : 8} fill="#307fe2" cx="0" cy="0" />
        {/* Right connector */}
        <line className="rl1" stroke="#307fe2" strokeWidth={sizeKey.small === 'mobile' ? 2 : sizeKey.small === 'tablet' ? 3 : 4} x1="0" y1="0" x2="0" y2="0" />
        <line className="rl2" stroke="#307fe2" strokeWidth={sizeKey.small === 'mobile' ? 2 : sizeKey.small === 'tablet' ? 3 : 4} x1="0" y1="0" x2="0" y2="0" />
        <circle className="dr dot" r={sizeKey.small === 'mobile' ? 5 : sizeKey.small === 'tablet' ? 6 : 8} fill="#307fe2" cx="0" cy="0" />
        {/* Right line terminus dot — sits at the orb's center, follows it live (mostly hidden behind the orb) */}
        <circle className="dr_end dot" r={sizeKey.small === 'mobile' ? 5 : sizeKey.small === 'tablet' ? 6 : 8} fill="#307fe2" cx="0" cy="0" />
        {/* Decorative ring — anchored to RIGHT orb */}
        <circle className="dec-ring" fill="none" stroke="#307fe2" strokeWidth={sizeKey.small === 'mobile' ? 3 : sizeKey.small === 'tablet' ? 4 : 5} cx="0" cy="0" r="200" />
      </svg>

      {title && (
        <div className="container">
          <h2
            className="mb-12 md:mb-16 font-light text-center tracking-tight"
            style={{ fontFamily: 'var(--font-inter)', fontSize: '3em', paddingTop: '25px' }}
          >
            {title}
          </h2>
        </div>
      )}

      {/* Responsive layout — same structure at all widths, sizes adapt */}
      {/* max-w-6xl (1152px) caps spread on wide screens; orbs at 6% pull them slightly inward */}
      {/* min-height + reduced negative mb give the orbs more breathing room (less crowded) */}
      {/* Mobile/tablet minHeight + negative margin tuned for ~20px of breathing
          room between the upper pair of orbs and the big bottom one. Desktop
          (-mb-20, minHeight 460px) is intentionally untouched. */}
      <div>
        <div className="relative mx-auto w-full max-w-6xl -mb-10 md:-mb-20" style={{ minHeight: sizeKey.small === 'mobile' ? '230px' : sizeKey.small === 'tablet' ? '310px' : '460px' }}>
          <div ref={orb1Ref} className="absolute" style={{ top: '0%', left: '6%', zIndex: 2 }}>
            {displayProjects[0] && (
              <FloatingWrapper
                entranceDelay={0.1}
                floatAmount={sizeKey.small === 'mobile' ? 4 : sizeKey.small === 'tablet' ? 6 : 10}
                floatDuration={3.8}
                swayAmount={sizeKey.small === 'mobile' ? 2 : sizeKey.small === 'tablet' ? 3 : 5}
                rotateAmount={1.2}
              >
                <ProjectCircle project={displayProjects[0]} size={sizeKey.small} />
              </FloatingWrapper>
            )}
          </div>

          <div ref={orb2Ref} className="absolute" style={{ top: '0%', right: '6%', zIndex: 2 }}>
            {displayProjects[1] && (
              <FloatingWrapper
                entranceDelay={0.2}
                floatAmount={sizeKey.small === 'mobile' ? 4 : sizeKey.small === 'tablet' ? 7 : 12}
                floatDuration={4.2}
                swayAmount={sizeKey.small === 'mobile' ? 2 : sizeKey.small === 'tablet' ? 4 : 6}
                rotateAmount={1.8}
              >
                <ProjectCircle project={displayProjects[1]} size={sizeKey.small} />
              </FloatingWrapper>
            )}
          </div>
        </div>

        <div className="relative w-full flex justify-center" style={{ zIndex: 2 }}>
          {displayProjects[2] && (
            <FloatingWrapper
              entranceDelay={0.3}
              floatAmount={sizeKey.small === 'mobile' ? 5 : sizeKey.small === 'tablet' ? 8 : 14}
              floatDuration={5}
              swayAmount={sizeKey.small === 'mobile' ? 2 : sizeKey.small === 'tablet' ? 3 : 4}
              rotateAmount={1}
            >
              <ProjectCircle project={displayProjects[2]} size={sizeKey.large} />
            </FloatingWrapper>
          )}
        </div>
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
      className="relative flex items-center justify-center rounded-full"
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
        filter: `drop-shadow(0 12px 28px rgba(0,0,0,0.12)) drop-shadow(0 4px 10px rgba(0,0,0,0.06))`,
      }}
    >
      {/* Solid blue circle with noise texture */}
      <div
        ref={blueCircleRef}
        className="absolute rounded-full overflow-hidden"
        style={{
          width: `${blueCircleSize}px`,
          height: `${blueCircleSize}px`,
          backgroundColor: '#307fe2',
          backgroundImage: `linear-gradient(rgba(48,127,226,0.8), rgba(48,127,226,0.8)), url(${blueNoiseBg.src})`,
          backgroundSize: 'auto, 200%',
          backgroundPosition: '0% 0%',
          animation: 'blueNoiseShift 2s steps(10) infinite',
          zIndex: 1,
        }}
      >
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
        className="absolute inset-0 flex flex-col items-start justify-center text-white font-bold"
        style={{
          fontSize: size === 'xlarge' ? '3rem' : size === 'mobile' ? '1.05rem' : size === 'mobileLarge' ? '1.4rem' : size === 'tablet' ? '1.25rem' : size === 'tabletLarge' ? '1.6rem' : '2.1rem',
          padding: size === 'mobile' ? '0 1.25rem' : size === 'mobileLarge' ? '0 1.75rem' : size === 'tablet' || size === 'tabletLarge' ? '0 2rem' : '0 3rem',
          fontFamily: 'var(--font-inter)',
          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          lineHeight: 1.05,
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
      
      {/* Hover content - hidden by default (skip on mobile) */}
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
          {project.workBubbleHoverText?.trim() || 'Discover the story behind this project.'}
        </p>
        <span
          className="text-white font-bold uppercase tracking-wider"
          style={{
            fontSize: size === 'xlarge' ? '1rem' : '0.875rem',
            fontFamily: 'var(--font-inter)',
          }}
        >
          See Case Study &gt;
        </span>
      </div>}
    </div>
  )

  // The `<a>` overlay extends ~40px beyond the orb's bounding box so the
  // visible "fuzzy halo" (created by GSAP's blur(30px) hover filter) is
  // also clickable. Hover handlers live on the overlay so the blur effect
  // also kicks in throughout the same area.
  return (
    <div className="relative" style={{ width: `${diameter}px`, height: `${diameter}px` }}>
      {circleContent}
      <a
        href={`/work/${project.slug || ''}`}
        aria-label={`${project.title} case study`}
        className="absolute rounded-full block cursor-pointer"
        style={{ inset: '-40px', zIndex: 10 }}
        onMouseEnter={size !== 'mobile' && size !== 'mobileLarge' ? handleMouseEnter : undefined}
        onMouseLeave={size !== 'mobile' && size !== 'mobileLarge' ? handleMouseLeave : undefined}
      />
    </div>
  )
}
