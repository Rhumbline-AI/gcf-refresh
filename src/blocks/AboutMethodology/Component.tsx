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
      {/* Large decorative blue circle outline — Venn-overlaps the filled circle */}
      <div
        className="absolute rounded-full pointer-events-none z-[5]"
        aria-hidden
        style={{
          width: 'clamp(280px, 55vw, 950px)',
          height: 'clamp(280px, 55vw, 950px)',
          top: 'clamp(-50px, 2vw, 40px)',
          left: 'clamp(-200px, -20vw, -120px)',
          backgroundImage: `linear-gradient(rgba(48,127,226,0.5), rgba(48,127,226,0.5)), url(${circleBg.src})`,
          backgroundSize: 'auto, 200%',
          backgroundPosition: '0% 0%',
          animation: 'blueNoiseShift 2s steps(10) infinite',
          WebkitMask: 'radial-gradient(circle, transparent 65%, black 65%)',
          mask: 'radial-gradient(circle, transparent 65%, black 65%)',
        }}
      />

      <div className="container relative z-10">
        <div className="flex flex-col items-center">
          <ScrollReveal animation="scaleIn" duration={1.1}>
            <div className="relative">
              <div
                className="relative w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[750px] md:h-[750px] lg:w-[950px] lg:h-[950px] xl:w-[1100px] xl:h-[1100px] rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: '#307fe2',
                  backgroundImage: `linear-gradient(rgba(48,127,226,0.5), rgba(48,127,226,0.5)), url(${circleBg.src})`,
                  backgroundSize: 'auto, 200%',
                  backgroundPosition: '0% 0%',
                  animation: 'blueNoiseShift 2s steps(10) infinite',
                }}
              >
                <div className="w-full px-8 sm:px-16 md:px-32 lg:px-40 xl:px-48">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:gap-x-6 sm:gap-y-6 md:gap-x-14 md:gap-y-12 lg:gap-x-16 lg:gap-y-14">
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
    </div>
  )
}

function MethodologyCircle({ item }: { item: MethodologyItem }) {
  const hasImage = item.image && typeof item.image === 'object'

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52 rounded-full overflow-hidden mb-1 sm:mb-2 md:mb-3 border-2 border-white/20"
        style={{ backgroundColor: '#1a2a4a' }}
      >
        {hasImage && (
          <Media resource={item.image as MediaType} fill imgClassName="object-cover" />
        )}
      </div>
      <h3
        className="text-[9px] sm:text-xs md:text-base lg:text-lg font-bold uppercase tracking-wider mb-0.5 sm:mb-1 text-white"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {item.label}
      </h3>
      <p
        className="text-[8px] sm:text-[10px] md:text-sm lg:text-base text-white/90 font-medium leading-snug max-w-[120px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[220px]"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {item.description}
      </p>
    </div>
  )
}
