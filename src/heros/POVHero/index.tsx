'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import type { Page } from '@/payload-types'

type POVHeroProps = Page['hero']

export const POVHero: React.FC<POVHeroProps> = ({ richText, quotes }) => {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const quoteList = quotes ?? []
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentRef = useRef(currentQuote)
  currentRef.current = currentQuote

  const cycleTo = useCallback((next: number) => {
    setIsFading(true)
    setTimeout(() => {
      setCurrentQuote(next)
      setIsFading(false)
    }, 400)
  }, [])

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (quoteList.length <= 1) return
    timerRef.current = setInterval(() => {
      const next = (currentRef.current + 1) % quoteList.length
      setIsFading(true)
      setTimeout(() => {
        setCurrentQuote(next)
        currentRef.current = next
        setIsFading(false)
      }, 400)
    }, 5500)
  }, [quoteList.length])

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTimer])

  const handlePrev = () => {
    cycleTo((currentQuote - 1 + quoteList.length) % quoteList.length)
    startTimer()
  }

  const handleNext = () => {
    cycleTo((currentQuote + 1) % quoteList.length)
    startTimer()
  }

  const quote = quoteList[currentQuote]

  return (
    <div className="relative pt-10 pb-8 md:pt-14 md:pb-2" style={{ backgroundColor: '#f7f2ee' }}>
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-[#1a1a1a] leading-[1.2] font-light"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Our Point of View
            </h1>
          </div>

          {quoteList.length > 0 && quote && (
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-[240px] h-[240px] md:w-[280px] md:h-[280px] rounded-full flex flex-col items-center justify-center p-10 md:p-12 text-center relative overflow-hidden"
                style={{ backgroundColor: '#307fe2' }}
              >
                <div
                  className="flex flex-col items-center justify-center transition-all duration-400"
                  style={{
                    opacity: isFading ? 0 : 1,
                    transform: isFading ? 'translateY(12px)' : 'translateY(0)',
                    transition: 'opacity 0.4s ease, transform 0.4s ease',
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
              </div>

              {quoteList.length > 1 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="w-8 h-8 rounded-full border-2 border-[#307fe2] text-[#307fe2] flex items-center justify-center hover:bg-[#307fe2] hover:text-white transition-colors"
                    aria-label="Previous quote"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
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
