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
  items?: MethodologyItem[] | null
  overlayImage?: (number | null) | MediaType
}

export const AboutMethodologyBlock: React.FC<AboutMethodologyProps> = ({ items }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const aspectRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const aspect = aspectRef.current
    const circle = circleRef.current
    if (!section || !aspect || !circle) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const triggers: ScrollTrigger[] = []
    const SCRUB = 0.4

    // Big blue circle — "hold then accelerate up".
    //
    // Trigger window is anchored to the circle's own bounding box (via the
    // un-transformed aspect-square wrapper) so the timing is correct on every
    // breakpoint, regardless of how tall the surrounding section ends up.
    //
    //   start: 'center 70%'      → kicks in slightly earlier than the
    //                              fully-centered moment — when the circle's
    //                              center is about 70% from the top of the
    //                              viewport (i.e. it's already presenting
    //                              itself but hasn't fully arrived yet).
    //   end:   'top top'          → completes when the circle's top edge has
    //                              naturally scrolled to the viewport top.
    //
    // While the timeline runs we add yPercent: -92 on top of the natural
    // scroll, so by the time scroll reaches 'top top' the circle has been
    // pushed almost an entire extra height upward — leaving only a thin
    // sliver visible at the top edge by the time the user has fully scrolled
    // through the section.
    //
    // ease: 'power2.in' delivers the requested acceleration without feeling
    // floaty.
    const circleTl = gsap.timeline({
      scrollTrigger: {
        trigger: aspect,
        start: 'center 70%',
        end: 'top top',
        scrub: SCRUB,
      },
    })
    circleTl.to(circle, { yPercent: -92, ease: 'power2.in', duration: 1 })
    if (circleTl.scrollTrigger) triggers.push(circleTl.scrollTrigger)

    // Ring (desktop only — it's hidden < md). Continuous L→R glide across
    // the full section scroll window — independent of the circle timing.
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    if (ringRef.current && isDesktop) {
      const ringTween = gsap.to(ringRef.current, {
        xPercent: 140,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: SCRUB,
        },
      })
      if (ringTween.scrollTrigger) triggers.push(ringTween.scrollTrigger)
    }

    return () => {
      triggers.forEach((t) => t.kill())
      circleTl.kill()
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
          top: 'clamp(-60px, 2vw, 40px)',
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

      <div className="relative z-10 flex flex-col items-center justify-center">
        <ScrollReveal animation="scaleIn" duration={1.1} className="w-full md:max-w-[1100px] md:mx-auto md:px-4">
          <div
            ref={aspectRef}
            className="relative w-[130vw] -ml-[15vw] md:w-full md:ml-0 aspect-square flex items-center justify-center"
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
              {/* Mobile: pull the 2x2 cluster inward (px-14) and tighten the
                  gap so the four sub-circles sit closer to the center of the
                  big blue circle. Desktop spacing is unchanged. */}
              <div className="w-full px-14 sm:px-20 md:px-32 lg:px-40 xl:px-48">
                <div className="grid grid-cols-2 gap-x-2 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:gap-x-10 md:gap-y-10 lg:gap-x-16 lg:gap-y-14">
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
        className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52 rounded-full overflow-hidden mb-2 sm:mb-2 md:mb-3 border-2 border-white/20"
        style={{ backgroundColor: '#1a2a4a' }}
      >
        {hasImage && (
          <Media resource={item.image as MediaType} fill imgClassName="object-cover" />
        )}
      </div>
      <h3
        className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wider mb-1 sm:mb-1 text-white"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {item.label}
      </h3>
      <p
        className="text-[11px] sm:text-sm md:text-sm lg:text-base text-white/90 font-medium leading-snug sm:leading-snug max-w-[140px] sm:max-w-[190px] md:max-w-[180px] lg:max-w-[220px]"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {item.description}
      </p>
    </div>
  )
}
