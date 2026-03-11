'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'
import { gsap, registerGSAP } from '@/utilities/gsapSetup'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

registerGSAP()

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeaderTheme('dark')
  })

  useEffect(() => {
    if (!contentRef.current) return

    const tl = gsap.timeline({ delay: 0.3 })
    const richTextEl = contentRef.current.querySelector('.rich-text-animate')
    const linkItems = contentRef.current.querySelectorAll('.link-animate')

    if (richTextEl) {
      tl.fromTo(richTextEl, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
    }

    if (linkItems.length > 0) {
      tl.fromTo(linkItems, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, '-=0.5')
    }

    return () => { tl.kill() }
  }, [])

  return (
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center text-white"
      data-theme="dark"
    >
      <div ref={contentRef} className="container z-10 relative flex items-center justify-center">
        <div className="max-w-full md:text-center whitespace-nowrap" style={{ fontFamily: 'var(--font-inter)' }}>
          {richText && <RichText className="rich-text-animate mb-6 [&_h1]:font-bold [&_h1]:whitespace-nowrap" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i} className="link-animate">
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
        )}
      </div>
    </div>
  )
}
