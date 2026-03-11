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
    <div className="relative py-16 md:py-24 bg-white">
      {/* Large decorative blue circle outline */}
      <div
        className="absolute -left-[220px] md:-left-[180px] lg:-left-[140px] -top-[180px] md:-top-[160px] w-[500px] h-[500px] md:w-[650px] md:h-[650px] lg:w-[750px] lg:h-[750px] rounded-full pointer-events-none z-0"
        aria-hidden
        style={{
          background: `url(${circleBg.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          WebkitMask: 'radial-gradient(circle, transparent 65%, black 65%)',
          mask: 'radial-gradient(circle, transparent 65%, black 65%)',
        }}
      />

      <div className="container relative z-10">
        <div className="flex flex-col items-center">
          <ScrollReveal animation="scaleIn" duration={1.1}>
            <div className="relative">
              <div
                className="relative w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] md:w-[650px] md:h-[650px] lg:w-[780px] lg:h-[780px] rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: '#307fe2',
                  backgroundImage: `url(${circleBg.src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="w-full px-14 sm:px-20 md:px-28 lg:px-36">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:gap-x-8 sm:gap-y-8 md:gap-x-12 md:gap-y-10">
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
        className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden mb-2 md:mb-3 border-2 border-white/20"
        style={{ backgroundColor: '#1a2a4a' }}
      >
        {hasImage && (
          <Media resource={item.image as MediaType} fill imgClassName="object-cover" />
        )}
      </div>
      <h3
        className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider mb-1 text-white"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {item.label}
      </h3>
      <p
        className="text-[10px] sm:text-xs md:text-sm text-white/90 font-medium leading-snug max-w-[180px]"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {item.description}
      </p>
    </div>
  )
}
