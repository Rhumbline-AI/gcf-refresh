import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Media as MediaType } from '@/payload-types'
import blueNoiseBg from '@/images/blue-noise-background.jpg'
import hand2 from '@/images/hand2.gif'
import { ScrollReveal } from '@/components/ScrollReveal'

type WorkWithUsProps = {
  title?: string | null
  image?: number | MediaType | null
}

export const WorkWithUsBlock: React.FC<WorkWithUsProps> = ({ title, image }) => {
  const imageUrl = typeof image === 'object' && image !== null ? image.url : null
  const repeatingText = 'Work With Us'
  const repetitions = 30

  return (
    // Bottom padding is much larger on mobile so the circle clears the footer's
    // torn-paper graphic + white-bg overlap (~200px on small screens). On
    // desktop the original py-24 still works because the section itself is
    // taller (552px circle + padding).
    <div className="pt-16 md:pt-24 pb-48 md:pb-24 relative dot-matrix-bg" style={{ overflowX: 'clip', overflowY: 'visible' }}>
      {/*
        Rotating text ring — pinned to the right edge of the viewport (right: 0
        on this full-width section), with 35% of its width pushed off-screen
        via `transform: translate(35%, -50%)`. The section's `overflowX: clip`
        cleanly hides the off-screen portion. The translate lives on this
        wrapper so the spin animation on the inner SVG doesn't clobber the
        position. No z-index → footer naturally paints on top of any vertical
        bleed.

        On mobile the section is shorter so the desktop `top: calc(50% - 250px)`
        would push the ring above the section entirely. Use a milder offset on
        mobile and the original on md+ via the CSS variable below.
      */}
      <div
        className="absolute pointer-events-none work-with-us-ring"
        style={{
          // ~20% smaller than before (1000 → 800px max, 95 → 76vw cap) so the
          // ring's circumference drops by the same ratio.
          width: 'min(800px, 76vw)',
          aspectRatio: '1 / 1',
          right: 0,
          top: 'var(--ring-top, calc(50% - 250px))',
          transform: 'translate(35%, -50%)',
        }}
        aria-hidden
      >
        <svg
          className="w-full h-full overflow-visible animate-[spin_60s_linear_infinite]"
          viewBox="0 0 100 100"
        >
          <defs>
            <path
              id="workWithUsCirclePath"
              d="M 50, 50 m -48, 0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0"
            />
          </defs>
          <text className="text-[1.4px] fill-foreground tracking-wide font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
            <textPath href="#workWithUsCirclePath" startOffset="0%">
              {Array.from({ length: repetitions }).map((_, i) => (
                <tspan key={i}>{repeatingText}{'\u00A0\u00A0\u00A0\u00A0'}</tspan>
              ))}
            </textPath>
          </text>
        </svg>
      </div>

      {/* The rotating ring still needs a different vertical anchor on mobile
          (the section is too short for the desktop calc(50% - 250px)), but the
          hand uses the same proportions everywhere — values dialed in on
          mobile via DevTools, also work great on desktop. */}
      <style>{`
        .work-with-us-ring { --ring-top: 35%; }
        @media (min-width: 768px) {
          .work-with-us-ring { --ring-top: calc(50% - 250px); }
        }
      `}</style>

      <div className="container relative flex flex-col items-center justify-center">
        {/* Blue circle + hand. Mobile uses a smaller circle (300px) so the hand
            fits on screen alongside it; desktop keeps the 552px hero size. */}
        <ScrollReveal animation="scaleUp" duration={1} className="w-full max-w-[300px] md:max-w-[552px]">
          <div className="relative w-full aspect-square">

            {/* Link is the positioning context — hand sits inside at circle-relative percentages */}
            <Link
              href="/contact"
              aria-label={title || 'Work With Us'}
              className="absolute inset-[8%] block group cursor-pointer"
            >
              {/* Hand holding the circle from the left — same proportions
                  on every viewport. Tuned via DevTools on mobile; still reads
                  correctly on desktop because everything is %-based off the
                  link (which is itself a % of the circle). */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: '-39%',
                  top: '55%',
                  width: '47%',
                  zIndex: 20,
                }}
              >
                <Image src={hand2} alt="" className="w-full h-auto" unoptimized />
              </div>
              <div
                className="relative w-full h-full rounded-full flex flex-col items-center justify-center p-8 md:p-16 overflow-hidden transition-transform duration-300 ease-out group-hover:scale-105"
                style={{
                  backgroundColor: '#307fe2',
                  backgroundImage: `linear-gradient(rgba(48,127,226,0.8), rgba(48,127,226,0.8)), url(${blueNoiseBg.src})`,
                  backgroundSize: 'auto, 200%',
                  backgroundPosition: '0% 0%',
                  animation: 'blueNoiseShift 2s steps(10) infinite',
                }}
              >
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={title || 'Work With Us'}
                    className="w-full h-full object-contain"
                    style={{
                      maxWidth: '80%',
                      maxHeight: '80%',
                    }}
                  />
                )}
              </div>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
