'use client'

import React, { useState } from 'react'
import type { Page } from '@/payload-types'

type POVHeroProps = Page['hero']

export const POVHero: React.FC<POVHeroProps> = ({ richText, quotes }) => {
  const [currentQuote, setCurrentQuote] = useState(0)
  const quoteList = quotes ?? []

  const goNext = () => {
    setCurrentQuote((prev) => (prev + 1) % quoteList.length)
  }

  const goPrev = () => {
    setCurrentQuote((prev) => (prev - 1 + quoteList.length) % quoteList.length)
  }

  const quote = quoteList[currentQuote]

  return (
    <div className="relative pt-8 pb-6 md:pt-10 md:pb-8" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-16">
          {/* Left side - Title */}
          <div className="flex-1">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-[#1a1a1a] leading-[1.2] font-light"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Our Point of View
            </h1>
          </div>

          {/* Right side - Quote circle with carousel */}
          {quoteList.length > 0 && quote && (
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-[240px] h-[240px] md:w-[280px] md:h-[280px] rounded-full flex flex-col items-center justify-center p-10 md:p-12 text-center"
                style={{
                  backgroundColor: '#307fe2',
                }}
              >
                <p
                  className="text-white text-lg md:text-xl italic leading-snug mb-3 font-extralight"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  &ldquo;{quote.text}&rdquo;
                </p>
                <p className="text-white/80 text-xs md:text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                  ~ {quote.attribution}
                  {quote.role && (
                    <>
                      <br />
                      {quote.role}
                    </>
                  )}
                </p>
              </div>

              {/* Navigation arrows */}
              {quoteList.length > 1 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={goPrev}
                    className="w-8 h-8 rounded-full border-2 border-[#307fe2] text-[#307fe2] flex items-center justify-center hover:bg-[#307fe2] hover:text-white transition-colors"
                    aria-label="Previous quote"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    onClick={goNext}
                    className="w-8 h-8 rounded-full border-2 border-[#307fe2] text-[#307fe2] flex items-center justify-center hover:bg-[#307fe2] hover:text-white transition-colors"
                    aria-label="Next quote"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
