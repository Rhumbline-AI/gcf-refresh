'use client'
import React, { useEffect, useRef } from 'react'
import { gsap, registerGSAP } from '@/utilities/gsapSetup'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import type { BlueStatementBlock as BlueStatementBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

registerGSAP()
gsap.registerPlugin(ScrollTrigger)

export const BlueStatementBlock: React.FC<BlueStatementBlockProps> = ({ content }) => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const paragraphs = sectionRef.current.querySelectorAll('p')
    if (paragraphs.length === 0) return

    gsap.set(paragraphs, { y: 30, opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
      },
    })

    tl.to(paragraphs, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
    })

    return () => { tl.kill() }
  }, [])

  if (!content) return null

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 px-6"
      style={{ backgroundColor: '#307fe2' }}
    >
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <RichText
            data={content}
            enableGutter={false}
            enableProse={false}
            className={[
              '[&_p]:text-white',
              '[&_p]:text-xl [&_p]:md:text-2xl [&_p]:lg:text-3xl',
              '[&_p]:leading-[1.5] [&_p]:tracking-tight',
              '[&_p]:font-light',
              '[&_p]:mb-0',
              '[&_p+p]:mt-1 [&_p+p]:md:mt-3',
              '[&_p]:md:whitespace-pre-line',
              '[&_strong]:font-bold',
              '[&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:opacity-80',
            ].join(' ')}
            style={{ fontFamily: 'var(--font-inter)' }}
          />
        </div>
      </div>
    </section>
  )
}
