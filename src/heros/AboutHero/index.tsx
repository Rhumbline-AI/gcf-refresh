'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

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

  return (
    <div
      className="relative pt-32 pb-16 md:pt-40 md:pb-24"
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
