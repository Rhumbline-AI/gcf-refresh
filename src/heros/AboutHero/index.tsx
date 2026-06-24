'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'
import { gsap, registerGSAP } from '@/utilities/gsapSetup'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

registerGSAP()

// The About hero renders entirely from the CMS `richText` field:
//   • H1 elements → large uppercase headline with bold words in brand blue
//   • Paragraphs  → body copy (uppercase, lighter weight, justified)
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
            <div ref={wrapperRef}>
              <RichText
                className={[
                  'mb-0',
                  // Headings: large uppercase, extra-light weight, bold words turn blue
                  '[&_h1]:font-extralight [&_h1]:text-center [&_h1]:leading-[1.05] [&_h1]:tracking-tight [&_h1]:uppercase [&_h1]:text-[2.2rem] [&_h1]:sm:text-[3.5rem] [&_h1]:md:text-[4.5rem] [&_h1]:lg:text-[5.5rem] [&_h1]:text-[#1a1a1a] [&_h1]:mb-0',
                  '[&_h1_strong]:font-extralight [&_h1_strong]:text-[#307fe2]',
                  // Body copy: uppercase, lighter weight, justified
                  '[&_p]:text-[0.8rem] [&_p]:sm:text-xl [&_p]:md:text-2xl [&_p]:lg:text-3xl [&_p]:font-extralight [&_p]:uppercase [&_p]:leading-[1.6] [&_p]:tracking-[0.08em] [&_p]:max-w-2xl md:[&_p]:max-w-3xl [&_p]:mx-auto [&_p]:px-6 [&_p]:sm:px-0 [&_p]:text-[#555555] [&_p]:mt-5 [&_p]:sm:mt-12 [&_p]:text-justify [&_p]:[hyphens:none] [&_p]:sm:[hyphens:auto] [&_p]:[-webkit-hyphens:none] [&_p]:sm:[-webkit-hyphens:auto]',
                  '[&_p_strong]:font-extralight [&_p_strong]:text-[#307fe2] [&_p_strong]:no-underline',
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
