import React from 'react'
import type { Methodology as MethodologyProps } from '@/payload-types'
import dotMatrixBg from '@/images/dot-matrix-background.gif'
import circleBg from '@/images/how-we-do-it-bg.jpg'
import { ScrollReveal } from '@/components/ScrollReveal'

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
      className="py-16 md:py-24 overflow-hidden relative"
      style={{
        backgroundImage: `url(${dotMatrixBg.src})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px',
        backgroundPosition: '0 0',
      }}
    >
      <div className="container relative z-10 flex flex-col items-center justify-center">
        <ScrollReveal animation="scaleIn" duration={1.2} className="w-full max-w-[990px]">
          <div className="relative w-full aspect-square">
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
                    <tspan key={i}>{repeatingText}  </tspan>
                  ))}
                </textPath>
              </text>
            </svg>

            <div 
              className="absolute inset-[4%] rounded-full flex flex-col items-center justify-center p-8 md:p-16 text-white text-center overflow-hidden"
              style={{ 
                backgroundColor: '#307fe2',
                backgroundImage: `url(${circleBg.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-light mb-2 md:mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
                {title}
              </h2>
              <p className="text-lg md:text-2xl lg:text-3xl font-normal mb-6 md:mb-8" style={{ fontFamily: 'var(--font-inter)' }}>
                {subtitle}
              </p>

              {definition && (
                <p className="text-xs md:text-sm lg:text-base mb-6 md:mb-8 max-w-md opacity-90 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                  {definition}
                </p>
              )}

              <div className="flex gap-4 mb-8 md:mb-12">
                <button className="bg-white text-[#307fe2] px-6 py-2 rounded-full font-bold text-sm md:text-base uppercase tracking-wide hover:bg-opacity-90 transition-all" style={{ fontFamily: 'var(--font-inter)' }}>
                  We Identify
                </button>
                <button className="bg-white text-[#307fe2] px-6 py-2 rounded-full font-bold text-sm md:text-base uppercase tracking-wide hover:bg-opacity-90 transition-all" style={{ fontFamily: 'var(--font-inter)' }}>
                  Growth Fuel
                </button>
              </div>

              <div className="w-full max-w-lg space-y-6 md:space-y-8">
                {items?.map((item, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-2 md:gap-4 items-start text-left">
                    <div className="flex-1">
                      <h3 className="text-sm md:text-base lg:text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
                        {item.label}
                      </h3>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <svg className="hidden md:block w-8 h-4 flex-shrink-0" viewBox="0 0 32 16" fill="none">
                        <path d="M0 8H30M30 8L24 2M30 8L24 14" stroke="white" strokeWidth="2"/>
                      </svg>
                      <p className="text-xs md:text-sm lg:text-base opacity-90 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                        {item.description}
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
