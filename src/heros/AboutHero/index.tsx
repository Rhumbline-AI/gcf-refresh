'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, registerGSAP } from '@/utilities/gsapSetup'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import aboutTextHeader from '@/images/about-text-header.png'

registerGSAP()

export const AboutHero: React.FC<Page['hero']> = ({ richText }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const contentRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeaderTheme('light')
  })

  useEffect(() => {
    if (!contentRef.current || !imgRef.current) return

    const paragraphs = contentRef.current.querySelectorAll('p')
    const tl = gsap.timeline({ delay: 0.3 })

    gsap.set(imgRef.current, { y: 40, opacity: 0 })
    tl.to(imgRef.current, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })

    if (paragraphs.length > 0) {
      gsap.set(paragraphs, { y: 30, opacity: 0 })
      tl.to(paragraphs, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.4')
    }

    return () => { tl.kill() }
  }, [])

  return (
    <div
      className="relative -mt-[10.4rem] pt-56 pb-16 md:pt-64 md:pb-24 overflow-hidden"
      style={{ backgroundColor: '#ffffff' }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0, opacity: 0.08 }}
      >
        <source src="/videos/rocket-launch-web.mp4" type="video/mp4" />
      </video>

      <div className="container relative" style={{ zIndex: 1 }}>
        <div className="flex flex-col items-center text-center" style={{ fontFamily: 'var(--font-inter)' }}>
          <div ref={imgRef} className="w-full max-w-4xl mx-auto">
            <Image
              src={aboutTextHeader}
              alt="Insight & Instinct, Brains & Bravery, Science & Story"
              className="w-full h-auto"
              priority
            />
          </div>

          {richText && (
            <div ref={contentRef}>
              <RichText
                className={[
                  'mb-0',
                  '[&_h1]:hidden [&_h2]:hidden [&_h3]:hidden',
                  '[&_p]:text-base [&_p]:sm:text-lg [&_p]:md:text-xl [&_p]:lg:text-2xl [&_p]:font-extralight [&_p]:uppercase [&_p]:leading-[1.7] [&_p]:tracking-[0.15em] [&_p]:max-w-2xl [&_p]:mx-auto [&_p]:text-[#555555] [&_p]:mt-12 [&_p]:text-justify [&_p]:[hyphens:none] [&_p]:[word-break:keep-all]',
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
