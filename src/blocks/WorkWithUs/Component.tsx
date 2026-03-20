import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Media as MediaType } from '@/payload-types'
import dotMatrixBg from '@/images/dot-matrix-background2.gif'
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
    <div
      className="py-16 md:py-24 relative"
      style={{
        backgroundImage: `url(${dotMatrixBg.src})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px',
        backgroundPosition: '0 0',
        backgroundColor: '#ffffff',
      }}
    >
      <div className="container relative z-10 flex flex-col items-center justify-center">
        <ScrollReveal animation="scaleUp" duration={1} className="w-full max-w-[396px]">
          <div className="relative">
            {/* Hand holding the circle from the left */}
            <div
              className="absolute hidden md:block"
              style={{
                left: '-18%',
                top: '15%',
                width: 'clamp(100px, 14vw, 180px)',
                zIndex: 20,
              }}
            >
              <Image src={hand2} alt="" className="w-full h-auto" unoptimized />
            </div>
          <Link href="/contact" className="block relative w-full aspect-square group">
            <div 
              className="w-full h-full rounded-full flex flex-col items-center justify-center p-8 md:p-16 overflow-hidden transition-transform duration-300 ease-out group-hover:scale-105"
              style={{ 
                backgroundColor: '#307fe2',
                backgroundImage: `url(${blueNoiseBg.src})`,
                backgroundSize: '200%',
                backgroundPosition: '0% 0%',
                animation: 'blueNoiseShift 25s ease-in-out infinite',
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
