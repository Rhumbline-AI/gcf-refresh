'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'
import { gsap, registerGSAP } from '@/utilities/gsapSetup'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

registerGSAP()

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText, overlayLogo }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeaderTheme('dark')
  })

  useEffect(() => {
    if (!contentRef.current) return

    const tl = gsap.timeline({ delay: 0.3 })
    const logoEl = contentRef.current.parentElement?.querySelector('.logo-animate')
    const richTextEl = contentRef.current.querySelector('.rich-text-animate')
    const linkItems = contentRef.current.querySelectorAll('.link-animate')

    if (logoEl) {
      tl.fromTo(logoEl, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
    }

    if (richTextEl) {
      tl.fromTo(richTextEl, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, logoEl ? '-=0.4' : 0)
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
      {overlayLogo && typeof overlayLogo === 'object' && (
        <div className="logo-animate absolute top-16 md:top-24 left-0 right-0 z-20 flex justify-center">
          <Media
            resource={overlayLogo}
            imgClassName="h-auto w-[180px] md:w-[155px]"
          />
        </div>
      )}

      <div ref={contentRef} className="container z-10 relative flex items-center justify-center">
        <div className="max-w-full flex flex-col items-center text-center md:whitespace-nowrap" style={{ fontFamily: 'var(--font-inter)' }}>
          {richText && <RichText className="rich-text-animate [&_h1]:font-bold md:[&_h1]:whitespace-nowrap [&_h1]:text-3xl md:[&_h1]:text-5xl lg:[&_h1]:text-6xl [&_p]:mt-10 md:[&_p]:mt-16" data={richText} enableGutter={false} />}
        </div>
      </div>

      {Array.isArray(links) && links.length > 0 && (
        <ul className="absolute bottom-[4%] left-0 right-0 flex justify-center gap-4 z-10">
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
  )
}
