import React from 'react'
import Image from 'next/image'
import circleBg from '@/images/blue-noise-background.jpg'
import hand1 from '@/images/hand1.gif'
import { ScrollReveal } from '@/components/ScrollReveal'

type MethodologyProps = {
  title?: string | null
  subtitle?: string | null
  definition?: string | null
  items?: { label: string; description: string; id?: string | null }[] | null
}

export const MethodologyBlock: React.FC<MethodologyProps> = ({ title, subtitle, definition, items }) => {
  const capitalizeWords = (str: string) => {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
  }
  const repeatingText = capitalizeWords(title || 'How do we do it?')
  const repetitions = 40
  
  return (
    <div 
      className="py-16 md:py-24 overflow-hidden relative dot-matrix-bg"
    >
      <div className="relative z-10 flex flex-col items-center justify-center">
        <ScrollReveal animation="scaleIn" duration={1.2} className="w-full md:max-w-[990px] md:mx-auto md:px-4">
          {/* Circle bleeds off-screen on mobile; contained on desktop. */}
          {/* Explicit width:height pair (instead of aspect-square) avoids mobile Safari oval-rendering bug. */}
          <div
            className="relative w-[130vw] h-[130vw] -ml-[15vw] md:w-full md:h-auto md:ml-0 md:aspect-square flex items-center justify-center"
          >
            {/* Hand — mobile */}
            <div
              className="absolute md:hidden"
              style={{
                right: '0%',
                top: '78%',
                width: 'clamp(120px, 18vw, 260px)',
                zIndex: 20,
              }}
            >
              <Image src={hand1} alt="" className="w-full h-auto" unoptimized />
            </div>
            {/* Hand — desktop */}
            <div
              className="absolute hidden md:block"
              style={{
                right: '-5%',
                top: '77%',
                width: 'clamp(140px, 18vw, 260px)',
                zIndex: 20,
              }}
            >
              <Image src={hand1} alt="" className="w-full h-auto" unoptimized />
            </div>
            <svg 
              className="absolute inset-0 w-full h-full overflow-visible animate-[spin_60s_linear_infinite]" 
              viewBox="0 0 100 100"
            >
              <defs>
                <path
                  id="circlePath"
                  d="M 50, 50 m -48, 0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0"
                />
              </defs>
              <text className="text-[1.4px] fill-foreground tracking-wide font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                <textPath href="#circlePath" startOffset="0%">
                  {Array.from({ length: repetitions }).map((_, i) => (
                    <tspan key={i}>{repeatingText}{'\u00A0\u00A0\u00A0\u00A0'}</tspan>
                  ))}
                </textPath>
              </text>
            </svg>

            <div 
              className="absolute inset-[5%] md:inset-[4%] rounded-full flex flex-col items-center justify-center px-16 py-12 sm:px-18 sm:py-10 md:px-10 md:py-12 lg:px-14 lg:py-16 text-white text-center overflow-hidden"
              style={{ 
                backgroundColor: '#307fe2',
                backgroundImage: `linear-gradient(rgba(48,127,226,0.35), rgba(48,127,226,0.35)), url(${circleBg.src})`,
                backgroundSize: 'auto, 200%',
                backgroundPosition: '0% 0%',
                animation: 'blueNoiseShift 2s steps(10) infinite',
                aspectRatio: '1 / 1',
              }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light mb-2 sm:mb-3 md:mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
                {title?.replace(/\s+/g, ' ').trim()}
              </h2>
              <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-normal mb-4 sm:mb-6 md:mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
                {subtitle?.replace(/\s+/g, ' ').trim()}
              </p>

              {definition && (
                <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-6 max-w-lg opacity-90 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                  {definition.replace(/\s+/g, ' ').trim()}
                </p>
              )}

              <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-12">
                <button className="bg-white text-[#307fe2] px-4 sm:px-6 py-2 sm:py-2 rounded-full font-bold text-xs sm:text-sm md:text-base uppercase tracking-wide hover:bg-opacity-90 transition-all" style={{ fontFamily: 'var(--font-inter)' }}>
                  We Identify
                </button>
                <button className="bg-white text-[#307fe2] px-4 sm:px-6 py-2 sm:py-2 rounded-full font-bold text-xs sm:text-sm md:text-base uppercase tracking-wide hover:bg-opacity-90 transition-all" style={{ fontFamily: 'var(--font-inter)' }}>
                  Growth Fuel
                </button>
              </div>

              <div className="w-full max-w-md space-y-4 sm:space-y-6 md:space-y-8">
                {items?.map((item, i) => (
                  <div key={i} className="flex flex-row gap-2 sm:gap-3 md:gap-4 items-center text-left">
                    <div className="flex-1">
                      <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold sm:mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
                        {item.label?.replace(/\s+/g, ' ').trim()}
                      </h3>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <svg className="w-6 sm:w-8 h-4 flex-shrink-0" viewBox="0 0 32 16" fill="none">
                        <line x1="0" y1="8" x2="28" y2="8" stroke="white" strokeWidth="2"/>
                        <circle cx="29" cy="8" r="3" fill="white"/>
                      </svg>
                      <p className="text-[11px] sm:text-xs md:text-sm lg:text-base opacity-90 leading-snug sm:leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                        {item.description?.replace(/\s+/g, ' ').trim()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
