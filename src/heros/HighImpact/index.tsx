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
      className="relative w-full overflow-hidden flex items-center justify-center text-white select-none aspect-[4/5] md:aspect-[16/9]"
      data-theme="dark"
    >
      {media && typeof media === 'object' && (
        <Media
          fill
          priority
          resource={media}
          imgClassName="object-cover"
          videoClassName="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div ref={contentRef} className="container z-10 relative flex items-center justify-center">
        <div className="max-w-full md:text-center md:whitespace-nowrap" style={{ fontFamily: 'var(--font-inter)' }}>
          {richText && <RichText className="rich-text-animate mb-6 [&_h1]:font-bold md:[&_h1]:whitespace-nowrap [&_h1]:text-3xl md:[&_h1]:text-5xl lg:[&_h1]:text-6xl" data={richText} enableGutter={false} />}
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
    </div>
  )
}
