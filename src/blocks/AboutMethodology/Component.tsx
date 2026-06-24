'use client'

import React, { useEffect, useRef } from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import circleBg from '@/images/blue-noise-background.jpg'
import { ScrollReveal } from '@/components/ScrollReveal'
import { gsap, ScrollTrigger, registerGSAP } from '@/utilities/gsapSetup'

registerGSAP()

type MethodologyItem = {
  label: string
  description: string
  image?: (number | null) | MediaType
}

type AboutMethodologyProps = {
  title?: string | null
  items?: MethodologyItem[] | null
  overlayImage?: (number | null) | MediaType
}

export const AboutMethodologyBlock: React.FC<AboutMethodologyProps> = ({ title, items }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const aspectRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const innerContentRef = useRef<HTMLDivElement>(null)
  const pinWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const aspect = aspectRef.current
    const circle = circleRef.current
    if (!section || !aspect || !circle) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const triggers: ScrollTrigger[] = []
    const SCRUB = 0.4

    const isMobile = !window.matchMedia('(min-width: 640px)').matches

    // Desktop/tablet: the circle stays static (no scroll drift) — the content
    // sits centered and 3-across and shouldn't move up or down on scroll.

    // Mobile: items stack vertically and the content column is taller than the
    // circle. We pin the circle while it's centered so the page scroll is
    // absorbed and ONLY the inner content scrubs up through the circle — the
    // title shows first, then each item, then the next section follows cleanly
    // (no gap) thanks to pin-spacing.
    //
    // The circle is given an EXPLICIT pixel size here (instead of its `vw` +
    // aspect-ratio CSS) so that the scrollbar appearing/disappearing during
    // pinning can't change its size mid-scroll.
    const wrap = pinWrapRef.current
    if (isMobile && innerContentRef.current && wrap) {
      const content = innerContentRef.current

      // Lock the circle to an explicit px size (1.6× viewport width — large
      // enough to bleed well off both edges).
      const vw = window.innerWidth
      const circlePx = Math.round(vw * 1.6)
      aspect.style.width = `${circlePx}px`
      aspect.style.height = `${circlePx}px`
      aspect.style.marginLeft = `${-Math.round((circlePx - vw) / 2)}px`

      const circleH = circlePx
      const contentH = content.offsetHeight

      // Inset from the circle's top/bottom edges (it's round, so leave room so
      // text isn't clipped by the narrow extremes).
      const inset = circleH * 0.12

      // Content is vertically centered in the circle via flexbox. Compute the
      // translate needed to bring the content's top to `inset` (start) and its
      // bottom to `circleH - inset` (end).
      const centeredTop = (circleH - contentH) / 2
      const yStart = inset - centeredTop
      const yEnd = circleH - inset - contentH - centeredTop
      const travel = Math.max(0, yStart - yEnd)

      const pinTl = gsap.timeline({
        scrollTrigger: {
          // Pin high (12% from top) so the circle's bottom stops sooner and
          // doesn't drop as far down the viewport.
          trigger: wrap,
          start: 'center 12%',
          end: `+=${Math.round(travel)}`,
          pin: true,
          pinSpacing: true,
          // Reparent to <body> so the section's `overflow-x-clip` can't
          // interfere with the fixed-position pin — guarantees the circle (and
          // page) truly lock at this frame instead of drifting.
          pinReparent: true,
          anticipatePin: 1,
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      })
      pinTl.fromTo(content, { y: yStart }, { y: yEnd, ease: 'none' })
      if (pinTl.scrollTrigger) triggers.push(pinTl.scrollTrigger)
    }

    // Recompute all trigger positions after the imperative circle sizing above
    // so the pin engages/locks at the correct scroll position.
    if (isMobile) {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    // Ring (desktop only — it's hidden < md). Glides L→R and disappears
    // behind the solid blue content circle (ring z-index < circle z-index).
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    if (ringRef.current && isDesktop) {
      const ringTween = gsap.to(ringRef.current, {
        xPercent: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'center top',
          scrub: SCRUB,
        },
      })
      if (ringTween.scrollTrigger) triggers.push(ringTween.scrollTrigger)
    }

    return () => {
      triggers.forEach((t) => t.kill())
      // Reset the explicit mobile circle sizing back to the CSS classes.
      aspect.style.width = ''
      aspect.style.height = ''
      aspect.style.marginLeft = ''
    }
  }, [])

  if (!items || items.length === 0) return null

  // Trimmed top + bottom padding (was py-16 md:py-24) so the methodology
  // circle sits closer to the body copy above and the rocket video below
  // peeks up into view instead of being pushed off the fold.
  //
  // overflow-x-clip (instead of overflow-hidden) lets the big blue circle
  // visually bleed up out of this section's bounds when the scroll-scrub
  // animation lifts it — without exposing horizontal scroll from the
  // off-screen-left decorative ring.
  return (
    <div
      ref={sectionRef}
      className="relative pt-4 pb-4 md:pt-6 md:pb-8 bg-white overflow-x-clip"
    >
      {/* Large decorative blue ring — Venn-overlaps the filled circle (desktop only). */}
      {/* Matches the inner filled circle's blue + noise treatment so the ring reads */}
      {/* as the same material; the radial mask defines the ring shape. */}
      <div
        ref={ringRef}
        className="absolute rounded-full pointer-events-none z-[5] hidden md:block"
        aria-hidden
        style={{
          width: 'clamp(380px, 55vw, 950px)',
          height: 'clamp(380px, 55vw, 950px)',
          top: 'clamp(-160px, -5vw, -60px)',
          left: 'clamp(-260px, -20vw, -120px)',
          backgroundColor: '#307fe2',
          backgroundImage: `linear-gradient(rgba(48,127,226,0.8), rgba(48,127,226,0.8)), url(${circleBg.src})`,
          backgroundSize: 'auto, 200%',
          backgroundPosition: '0% 0%',
          animation: 'blueNoiseShift 2s steps(10) infinite',
          WebkitMask: 'radial-gradient(circle, transparent 62%, black 62%, black 70%, transparent 70%)',
          mask: 'radial-gradient(circle, transparent 62%, black 62%, black 70%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      <div ref={pinWrapRef} className="relative z-10 flex flex-col items-center justify-center">
        <ScrollReveal animation="scaleIn" duration={1.1} className="w-full md:max-w-[1100px] md:mx-auto md:px-4">
          <div
            ref={aspectRef}
            className="relative w-[112vw] -ml-[6vw] md:w-full md:ml-0 aspect-square flex items-center justify-center"
          >
            {/* Scroll-scrub target. Lives one level inside ScrollReveal's
                animated wrapper so the entrance transform (on the parent)
                and the scrub transform (here) compose cleanly without
                fighting on the same element. */}
            <div
              ref={circleRef}
              className="absolute inset-0 md:inset-0 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                backgroundColor: '#307fe2',
                backgroundImage: `linear-gradient(rgba(48,127,226,0.8), rgba(48,127,226,0.8)), url(${circleBg.src})`,
                backgroundSize: 'auto, 200%',
                backgroundPosition: '0% 0%',
                animation: 'blueNoiseShift 2s steps(10) infinite',
                willChange: 'transform',
              }}
            >
              <div ref={innerContentRef} className="w-full px-10 sm:px-16 md:px-24 lg:px-32 xl:px-40">
                {title && (
                  <h2
                    className="text-white text-center font-extralight uppercase tracking-wide text-2xl sm:text-2xl md:text-3xl lg:text-[2.75rem] xl:text-5xl mb-6 sm:mb-8 md:mb-10 lg:mb-12 whitespace-pre-line"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {title}
                  </h2>
                )}
                <div className={`grid gap-x-2 gap-y-8 sm:gap-x-4 sm:gap-y-5 md:gap-x-10 md:gap-y-10 lg:gap-x-16 lg:gap-y-14 ${items.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'}`}>
                  {items.map((item, i) => (
                    <MethodologyCircle key={i} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

function MethodologyCircle({ item }: { item: MethodologyItem }) {
  const hasImage = item.image && typeof item.image === 'object'

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="relative w-32 h-32 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52 rounded-full overflow-hidden mb-2.5 sm:mb-2 md:mb-3 border-2 border-white"
        style={{ backgroundColor: '#1a2a4a' }}
      >
        {hasImage && (
          <Media resource={item.image as MediaType} fill imgClassName="object-cover" />
        )}
      </div>
      <h3
        className="text-base sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wider mb-1 sm:mb-1 text-white"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {item.label}
      </h3>
      <p
        className="text-sm sm:text-sm md:text-sm lg:text-base text-white/90 font-medium leading-snug sm:leading-snug max-w-[230px] sm:max-w-[190px] md:max-w-[180px] lg:max-w-[220px]"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {item.description}
      </p>
    </div>
  )
}
