'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'
import { gsap, registerGSAP } from '@/utilities/gsapSetup'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

registerGSAP()

export const AboutHero: React.FC<Page['hero']> = ({ richText }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeaderTheme('light')
  })

  useEffect(() => {
    if (!contentRef.current) return

    const headings = contentRef.current.querySelectorAll('h1, h2, h3')
    headings.forEach((heading) => {
      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT)
      const textNodes: Text[] = []
      let node: Text | null
      while ((node = walker.nextNode() as Text | null)) {
        if (node.textContent?.includes('&')) textNodes.push(node)
      }

      textNodes.forEach((textNode) => {
        const parts = textNode.textContent!.split('&')
        const fragment = document.createDocumentFragment()
        parts.forEach((part, i) => {
          if (i > 0) {
            const ampSpan = document.createElement('span')
            ampSpan.textContent = '&'
            ampSpan.style.color = '#1a1a1a'
            fragment.appendChild(ampSpan)
          }
          if (part) fragment.appendChild(document.createTextNode(part))
        })
        textNode.parentNode?.replaceChild(fragment, textNode)
      })
    })
  }, [richText])

  useEffect(() => {
    if (!contentRef.current) return

    const h1 = contentRef.current.querySelector('h1')
    const paragraphs = contentRef.current.querySelectorAll('p')

    const tl = gsap.timeline({ delay: 0.3 })

    if (h1) {
      gsap.set(h1, { y: 40, opacity: 0 })
      tl.to(h1, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
    }

    if (paragraphs.length > 0) {
      gsap.set(paragraphs, { y: 30, opacity: 0 })
      tl.to(paragraphs, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.4')
    }

    return () => { tl.kill() }
  }, [])

  return (
    <div
      className="relative -mt-[10.4rem] pt-56 pb-16 md:pt-64 md:pb-24"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="container">
        <div
          ref={contentRef}
          className="flex flex-col items-center text-center"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {richText && (
            <RichText
              className={[
                'mb-0',
                '[&_h1]:text-4xl [&_h1]:sm:text-5xl [&_h1]:md:text-7xl [&_h1]:lg:text-8xl [&_h1]:font-extralight [&_h1]:uppercase [&_h1]:leading-[1.1] [&_h1]:tracking-tight [&_h1]:text-[#307fe2] [&_h1]:whitespace-nowrap',
                '[&_p]:text-base [&_p]:sm:text-lg [&_p]:md:text-xl [&_p]:lg:text-2xl [&_p]:font-extralight [&_p]:uppercase [&_p]:leading-[1.7] [&_p]:tracking-[0.15em] [&_p]:max-w-2xl [&_p]:mx-auto [&_p]:text-[#555555] [&_p]:mt-12 [&_p]:text-justify [&_p]:[hyphens:none] [&_p]:[word-break:keep-all]',
                '[&_strong]:font-extralight [&_strong]:text-[#307fe2] [&_strong]:no-underline',
              ].join(' ')}
              data={richText}
              enableGutter={false}
              enableProse={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}
