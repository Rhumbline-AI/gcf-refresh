'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'
import { gsap, registerGSAP } from '@/utilities/gsapSetup'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

registerGSAP()

const headlineLines = [
  ['Insight', 'Instinct'],
  ['Brains', 'Bravery'],
  ['Science', 'Story'],
]

export const AboutHero: React.FC<Page['hero']> = ({ richText }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const contentRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    setHeaderTheme('light')
  })

  useEffect(() => {
    if (!contentRef.current || !headlineRef.current) return

    const paragraphs = contentRef.current.querySelectorAll('p')
    const tl = gsap.timeline({ delay: 0.3 })

    gsap.set(headlineRef.current, { y: 40, opacity: 0 })
    tl.to(headlineRef.current, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })

    if (paragraphs.length > 0) {
      gsap.set(paragraphs, { y: 30, opacity: 0 })
      tl.to(paragraphs, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.4')
    }

    return () => { tl.kill() }
  }, [])

  return (
    <div
      className="-mt-[10.4rem] pt-56 pb-16 md:pt-64 md:pb-24"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="container relative">
        <div className="flex flex-col items-center text-center" style={{ fontFamily: 'var(--font-inter)' }}>
          {/* Each line center-aligns independently — ampersands fall naturally, no forced vertical column */}
          <h1
            ref={headlineRef}
            className="w-full max-w-4xl mx-auto font-light text-[#1a1a1a] uppercase leading-[1.05] tracking-[0.02em] text-[clamp(2.5rem,7.5vw,5.5rem)]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {headlineLines.map((line, i) => (
              <span key={i} className="block">
                {line[0]} <span aria-hidden>&amp;</span> {line[1]}
              </span>
            ))}
          </h1>

          {richText && (
            <div ref={contentRef}>
              <RichText
                className={[
                  'mb-0',
                  '[&_h1]:hidden [&_h2]:hidden [&_h3]:hidden',
                  '[&_p]:text-base [&_p]:sm:text-lg [&_p]:md:text-xl [&_p]:lg:text-2xl [&_p]:font-extralight [&_p]:uppercase [&_p]:leading-[1.7] [&_p]:tracking-[0.15em] [&_p]:max-w-xl md:[&_p]:max-w-2xl [&_p]:mx-auto [&_p]:text-[#555555] [&_p]:mt-12 [&_p]:text-left md:[&_p]:text-center [&_p]:[hyphens:none] [&_p]:[word-break:keep-all] [&_p]:[text-wrap:balance]',
                  '[&_strong]:font-extralight [&_strong]:text-[#307fe2] [&_strong]:no-underline',
                ].join(' ')}
                data={richText}
                enableGutter={false}
                enableProse={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
