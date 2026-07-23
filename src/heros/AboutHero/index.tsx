'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'
import { gsap, registerGSAP } from '@/utilities/gsapSetup'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

registerGSAP()

// The About hero renders entirely from the CMS `richText` field:
//   • H1 elements → large uppercase headline with bold words in brand blue
//   • Paragraphs  → body copy (sentence case, light weight, justified)
// This lets the client rework the headline anytime without a code deploy.
export const AboutHero: React.FC<Page['hero']> = ({ richText }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeaderTheme('light')
  })

  useEffect(() => {
    if (!wrapperRef.current) return

    const headings = wrapperRef.current.querySelectorAll('h1, h2, h3')
    const paragraphs = wrapperRef.current.querySelectorAll('p')
    const tl = gsap.timeline({ delay: 0.3 })

    if (headings.length > 0) {
      gsap.set(headings, { y: 40, opacity: 0 })
      tl.to(headings, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
    }

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
          {richText && (
            <div ref={wrapperRef} className="about-hero-headline">
              <style>{`
                .about-hero-headline h1,
                .about-hero-headline h2,
                .about-hero-headline h3 {
                  margin: 0;
                  line-height: 1.1;
                }
              `}</style>
              <RichText
                className={[
                  'mb-0',
                  // Headings: large uppercase, extra-light weight, bold words turn blue
                  '[&_h1]:font-extralight [&_h1]:text-center [&_h1]:tracking-tight [&_h1]:uppercase [&_h1]:text-[2.2rem] [&_h1]:sm:text-[3.5rem] [&_h1]:md:text-[4.5rem] [&_h1]:lg:text-[5.5rem] [&_h1]:text-[#1a1a1a]',
                  '[&_h2]:font-extralight [&_h2]:text-center [&_h2]:tracking-tight [&_h2]:uppercase [&_h2]:text-[2.2rem] [&_h2]:sm:text-[3.5rem] [&_h2]:md:text-[4.5rem] [&_h2]:lg:text-[5.5rem] [&_h2]:text-[#1a1a1a]',
                  '[&_h3]:font-extralight [&_h3]:text-center [&_h3]:tracking-tight [&_h3]:uppercase [&_h3]:text-[2.2rem] [&_h3]:sm:text-[3.5rem] [&_h3]:md:text-[4.5rem] [&_h3]:lg:text-[5.5rem] [&_h3]:text-[#1a1a1a]',
                  '[&_h1_strong]:font-extralight [&_h1_strong]:text-[#307fe2]',
                  '[&_h2_strong]:font-extralight [&_h2_strong]:text-[#307fe2]',
                  '[&_h3_strong]:font-extralight [&_h3_strong]:text-[#307fe2]',
                  // Body copy: sentence case, light weight (+1 from extralight), +1pt size, centered
                  '[&_p]:text-[calc(0.8rem+1pt)] [&_p]:sm:text-[calc(1.25rem+1pt)] [&_p]:md:text-[calc(1.5rem+1pt)] [&_p]:lg:text-[calc(1.875rem+1pt)] [&_p]:font-light [&_p]:normal-case [&_p]:leading-[1.45] [&_p]:tracking-normal [&_p]:max-w-2xl md:[&_p]:max-w-3xl [&_p]:mx-auto [&_p]:px-6 [&_p]:sm:px-0 [&_p]:text-[#555555] [&_p]:mt-5 [&_p]:sm:mt-12 [&_p]:text-center [&_p]:[hyphens:none] [&_p]:sm:[hyphens:auto] [&_p]:[-webkit-hyphens:none] [&_p]:sm:[-webkit-hyphens:auto]',
                  '[&_p_strong]:font-light [&_p_strong]:text-[#307fe2] [&_p_strong]:no-underline',
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
