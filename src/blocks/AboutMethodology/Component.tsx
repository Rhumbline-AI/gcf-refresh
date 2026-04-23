import React from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import circleBg from '@/images/blue-noise-background.jpg'
import { ScrollReveal } from '@/components/ScrollReveal'

type MethodologyItem = {
  label: string
  description: string
  image?: (number | null) | MediaType
}

type AboutMethodologyProps = {
  items?: MethodologyItem[] | null
  overlayImage?: (number | null) | MediaType
}

export const AboutMethodologyBlock: React.FC<AboutMethodologyProps> = ({
  items,
  overlayImage,
}) => {
  if (!items || items.length === 0) return null

  return (
    <div className="relative py-16 md:py-24 bg-white overflow-hidden">
      {/* Large decorative blue ring — Venn-overlaps the filled circle (desktop only). */}
      {/* Darker blue + more opaque overlay = visible intersection band where ring crosses filled circle. */}
      <div
        className="absolute rounded-full pointer-events-none z-[5] hidden md:block"
        aria-hidden
        style={{
          width: 'clamp(380px, 55vw, 950px)',
          height: 'clamp(380px, 55vw, 950px)',
          top: 'clamp(-60px, 2vw, 40px)',
          left: 'clamp(-260px, -20vw, -120px)',
          backgroundColor: '#1f5dba',
          backgroundImage: `linear-gradient(rgba(31,93,186,0.55), rgba(31,93,186,0.55)), url(${circleBg.src})`,
          backgroundSize: 'auto, 200%',
          backgroundPosition: '0% 0%',
          animation: 'blueNoiseShift 2s steps(10) infinite',
          WebkitMask: 'radial-gradient(circle, transparent 62%, black 62%, black 70%, transparent 70%)',
          mask: 'radial-gradient(circle, transparent 62%, black 62%, black 70%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center">
        <ScrollReveal animation="scaleIn" duration={1.1} className="w-full md:max-w-[1100px] md:mx-auto md:px-4">
          <div className="relative w-[130vw] -ml-[15vw] md:w-full md:ml-0 aspect-square flex items-center justify-center">
            <div
              className="absolute inset-0 md:inset-0 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                backgroundColor: '#307fe2',
                backgroundImage: `linear-gradient(rgba(48,127,226,0.35), rgba(48,127,226,0.35)), url(${circleBg.src})`,
                backgroundSize: 'auto, 200%',
                backgroundPosition: '0% 0%',
                animation: 'blueNoiseShift 2s steps(10) infinite',
              }}
            >
              <div className="w-full px-10 sm:px-14 md:px-32 lg:px-40 xl:px-48">
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8 md:gap-x-14 md:gap-y-12 lg:gap-x-16 lg:gap-y-14">
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
        className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52 rounded-full overflow-hidden mb-1.5 sm:mb-2 md:mb-3 border-2 border-white/20"
        style={{ backgroundColor: '#1a2a4a' }}
      >
        {hasImage && (
          <Media resource={item.image as MediaType} fill imgClassName="object-cover" />
        )}
      </div>
      <h3
        className="text-[10px] sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wider mb-0.5 sm:mb-1 text-white"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {item.label}
      </h3>
      <p
        className="text-[9px] sm:text-xs md:text-sm lg:text-base text-white/90 font-medium leading-tight sm:leading-snug max-w-[130px] sm:max-w-[170px] md:max-w-[180px] lg:max-w-[220px]"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {item.description}
      </p>
    </div>
  )
}
