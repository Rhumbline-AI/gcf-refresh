'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'
import { gsap, registerGSAP } from '@/utilities/gsapSetup'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

registerGSAP()

// Headline is rendered as live text (reverted from an earlier PNG approach
// per updated direction). Brand blue on the noun pairs, dark ink on the
// ampersands. The CMS `aboutHeadlineImage` field is intentionally left in
// place but unused so editors don't lose any previously-uploaded asset; it
// can be removed in a follow-up if no longer wanted.
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
          <h1
            ref={headlineRef}
            className="font-extralight text-center leading-[1.05] tracking-tight uppercase text-[2.2rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem]"
          >
            <span className="block">
              <span className="text-[#307fe2]">Insight</span>{' '}
              <span className="text-[#1a1a1a]">&amp;</span>{' '}
              <span className="text-[#307fe2]">Instinct</span>
            </span>
            <span className="block">
              <span className="text-[#307fe2]">Brains</span>{' '}
              <span className="text-[#1a1a1a]">&amp;</span>{' '}
              <span className="text-[#307fe2]">Bravery</span>
            </span>
            <span className="block">
              <span className="text-[#307fe2]">Science</span>{' '}
              <span className="text-[#1a1a1a]">&amp;</span>{' '}
              <span className="text-[#307fe2]">Story</span>
            </span>
          </h1>

          {richText && (
            <div ref={contentRef}>
              <RichText
                className={[
                  'mb-0',
                  '[&_h1]:hidden [&_h2]:hidden [&_h3]:hidden',
                  // Larger fully-justified body copy. Hyphens enabled because justified
                  // text creates ugly "rivers" of whitespace without them — the comp
                  // shows hyphenated breaks (e.g. "STRATE-GIES") for this exact reason.
                  '[&_p]:text-[0.8rem] [&_p]:sm:text-xl [&_p]:md:text-2xl [&_p]:lg:text-3xl [&_p]:font-extralight [&_p]:uppercase [&_p]:leading-[1.6] [&_p]:tracking-[0.08em] [&_p]:max-w-2xl md:[&_p]:max-w-3xl [&_p]:mx-auto [&_p]:px-6 [&_p]:sm:px-0 [&_p]:text-[#555555] [&_p]:mt-12 [&_p]:text-justify [&_p]:[hyphens:none] [&_p]:sm:[hyphens:auto] [&_p]:[-webkit-hyphens:none] [&_p]:sm:[-webkit-hyphens:auto]',
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
