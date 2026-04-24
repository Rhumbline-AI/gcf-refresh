'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, registerGSAP } from '@/utilities/gsapSetup'

import type { Page, Media as MediaType } from '@/payload-types'

import RichText from '@/components/RichText'
import aboutTextHeaderFallback from '@/images/about-text-header.png'

registerGSAP()

// Visible heading is rendered as an image (client requires pixel-perfect
// ampersand alignment that web type can't guarantee). The text below is kept
// inside an sr-only <h1> so the page still has a proper semantic heading for
// SEO + a11y. The image source is editable in the CMS via the hero's
// `aboutHeadlineImage` field; the bundled PNG is used as a fallback.
const HEADLINE_TEXT = 'Insight & Instinct. Brains & Bravery. Science & Story.'

export const AboutHero: React.FC<Page['hero']> = ({ richText, aboutHeadlineImage }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const contentRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)

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
          {/* SR-only semantic heading — the visual heading below is a PNG */}
          <h1 className="sr-only">{HEADLINE_TEXT}</h1>

          {/* PNG headline (precise ampersand alignment per client request) — CMS-editable, bundled PNG as fallback */}
          <div
            ref={headlineRef}
            className="w-full max-w-4xl mx-auto"
            aria-hidden
          >
            {(() => {
              const cmsImage =
                aboutHeadlineImage && typeof aboutHeadlineImage === 'object'
                  ? (aboutHeadlineImage as MediaType)
                  : null

              if (cmsImage?.url) {
                const w = typeof cmsImage.width === 'number' ? cmsImage.width : 1024
                const h = typeof cmsImage.height === 'number' ? cmsImage.height : 256
                return (
                  <Image
                    src={cmsImage.url}
                    alt={cmsImage.alt || ''}
                    width={w}
                    height={h}
                    priority
                    sizes="(min-width: 1024px) 56rem, 92vw"
                    className="w-full h-auto"
                  />
                )
              }

              return (
                <Image
                  src={aboutTextHeaderFallback}
                  alt=""
                  priority
                  sizes="(min-width: 1024px) 56rem, 92vw"
                  className="w-full h-auto"
                />
              )
            })()}
          </div>

          {richText && (
            <div ref={contentRef}>
              <RichText
                className={[
                  'mb-0',
                  '[&_h1]:hidden [&_h2]:hidden [&_h3]:hidden',
                  // Larger fully-justified body copy. Hyphens enabled because justified
                  // text creates ugly "rivers" of whitespace without them — the comp
                  // shows hyphenated breaks (e.g. "STRATE-GIES") for this exact reason.
                  '[&_p]:text-lg [&_p]:sm:text-xl [&_p]:md:text-2xl [&_p]:lg:text-3xl [&_p]:font-extralight [&_p]:uppercase [&_p]:leading-[1.6] [&_p]:tracking-[0.08em] [&_p]:max-w-2xl md:[&_p]:max-w-3xl [&_p]:mx-auto [&_p]:text-[#555555] [&_p]:mt-12 [&_p]:text-justify [&_p]:[hyphens:auto] [&_p]:[-webkit-hyphens:auto]',
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
