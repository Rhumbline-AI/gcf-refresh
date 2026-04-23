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
  
  return (
    <div className="py-16 md:py-24 relative dot-matrix-bg">
      <div className="container relative z-10 flex flex-col items-center justify-center">
        <ScrollReveal animation="scaleUp" duration={1} className="w-full max-w-[396px]">
          {/* Link is the positioning context — hand sits inside at circle-relative percentages */}
          <Link href="/contact" className="block relative w-full aspect-square group">
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
              className="w-full h-full rounded-full flex flex-col items-center justify-center p-8 md:p-16 overflow-hidden transition-transform duration-300 ease-out group-hover:scale-105"
              style={{ 
                backgroundColor: '#307fe2',
                backgroundImage: `linear-gradient(rgba(48,127,226,0.5), rgba(48,127,226,0.5)), url(${blueNoiseBg.src})`,
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
        </ScrollReveal>
      </div>
    </div>
  )
}
