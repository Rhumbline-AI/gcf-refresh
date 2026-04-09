'use client'

import React, { useEffect, useRef } from 'react'
import RichText from '@/components/RichText'
import type { Page } from '@/payload-types'
import dotMatrixBg from '@/images/dot-matrix-background2.gif'
import { gsap, registerGSAP } from '@/utilities/gsapSetup'

registerGSAP()

type WorkHeroProps = Page['hero']

export const WorkHero: React.FC<WorkHeroProps> = ({ richText }) => {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    const h1 = contentRef.current.querySelector('h1')
    const paragraphs = contentRef.current.querySelectorAll('p')
    const tl = gsap.timeline({ delay: 0.2 })

    if (h1) {
      gsap.set(h1, { y: 30, opacity: 0 })
      tl.to(h1, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' })
    }

    if (paragraphs.length > 0) {
      gsap.set(paragraphs, { y: 20, opacity: 0 })
      tl.to(paragraphs, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, '-=0.4')
    }

    return () => { tl.kill() }
  }, [])

  return (
    <div
      className="relative pt-8 pb-4 md:pt-10 md:pb-6"
      style={{
        backgroundImage: `url(${dotMatrixBg.src})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px',
        backgroundPosition: '0 0',
        backgroundColor: '#ffffff',
      }}
    >
      <div className="container">
        <div ref={contentRef} className="max-w-3xl mx-auto text-center">
          {richText && (
            <RichText
              className="[&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:lg:text-6xl [&_h1]:font-extralight [&_h1]:text-[#343434] [&_h1]:mb-0 [&_h1]:leading-tight [&_p]:text-base [&_p]:md:text-lg [&_p]:text-[#343434] [&_p]:font-light [&_p]:mt-0 [&_p]:md:mt-1"
              data={richText}
              enableGutter={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}
