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
    <div className="py-16 md:py-24 relative dot-matrix-bg" style={{ overflowX: 'clip', overflowY: 'visible' }}>
      <div className="container relative z-10 flex flex-col items-center justify-center">
        <ScrollReveal animation="scaleUp" duration={1} className="w-full max-w-[480px]">
          {/* Outer frame holds the rotating-text ring; the link/circle sits inset inside */}
          <div className="relative w-full aspect-square">
            {/* Rotating text ring around the outside */}
            <svg
              className="absolute inset-0 w-full h-full overflow-visible animate-[spin_60s_linear_infinite] pointer-events-none"
              viewBox="0 0 100 100"
              aria-hidden
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

            {/* Link is the positioning context — hand sits inside at circle-relative percentages */}
            <Link
              href="/contact"
              aria-label={title || 'Work With Us'}
              className="absolute inset-[8%] block group cursor-pointer"
            >
              {/* Hand holding the circle from the left — percentage-based so it scales with circle */}
              <div
                className="absolute hidden md:block pointer-events-none"
                style={{
                  left: '-40%',
                  top: '53%',
                  width: '48%',
                  zIndex: 20,
                }}
              >
                <Image src={hand2} alt="" className="w-full h-auto" unoptimized />
              </div>
              <div
                className="relative w-full h-full rounded-full flex flex-col items-center justify-center p-8 md:p-16 overflow-hidden transition-transform duration-300 ease-out group-hover:scale-105"
                style={{
                  backgroundColor: '#307fe2',
                  backgroundImage: `linear-gradient(rgba(48,127,226,0.35), rgba(48,127,226,0.35)), url(${blueNoiseBg.src})`,
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
