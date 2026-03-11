import React from 'react'
import Image from 'next/image'
import { CMSLink } from '@/components/Link'
import type { Page, Post } from '@/payload-types'
import buttonCircular from '@/images/button-background-circular.png'
import buttonRectangular from '@/images/button-background-rectangular.png'
import { ScrollReveal } from '@/components/ScrollReveal'

type CapabilityItem = {
  title: string
  description?: string | null
  enableLink?: boolean | null
  link?: {
    type?: ('reference' | 'custom') | null
    newTab?: boolean | null
    reference?:
      | ({ relationTo: 'pages'; value: number | Page } | null)
      | ({ relationTo: 'posts'; value: number | Post } | null)
    url?: string | null
    label: string
  }
}

type CapabilitiesBlockProps = {
  title?: string | null
  items?: CapabilityItem[] | null
}

export const CapabilitiesBlock: React.FC<CapabilitiesBlockProps> = ({ title, items }) => {
  if (!items || items.length === 0) return null

  return (
    <div className="relative py-16 md:py-24 overflow-hidden" style={{ backgroundColor: '#307fe2' }}>
      <div className="container relative z-10">
        {title && (
          <ScrollReveal animation="fadeUp" duration={1}>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl text-white text-center mb-12 md:mb-16 font-extralight"
              style={{ fontFamily: 'var(--font-inter)' }}
              dangerouslySetInnerHTML={{
                __html: title.replace(/Growth/g, 'Growth<br />'),
              }}
            />
          </ScrollReveal>
        )}

        <ScrollReveal animation="fadeUp" staggerChildren stagger={0.15} duration={0.8} start="top 90%">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 md:gap-y-16 max-w-3xl mx-auto">
            {items.map((item, i) => {
              const isLastOdd = items.length % 2 !== 0 && i === items.length - 1
              const buttonBg = i % 2 === 0 ? buttonRectangular : buttonCircular

              return (
                <div
                  key={i}
                  className={`text-center max-w-[240px] mx-auto ${isLastOdd ? 'md:col-span-2' : ''}`}
                >
                  <h3
                    className="text-xl md:text-2xl lg:text-[1.7rem] font-light text-white mb-3 leading-[1.2]"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      className="text-sm md:text-base text-white font-semibold mb-5 leading-snug"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {item.description}
                    </p>
                  )}
                  {item.enableLink && item.link && (
                    <div className="relative inline-block">
                      <Image
                        src={buttonBg}
                        alt=""
                        className="absolute top-1/2 left-1/2 -translate-x-[46%] -translate-y-1/2 scale-[1.3] pointer-events-none"
                        aria-hidden
                      />
                      <CMSLink
                        {...item.link}
                        label={undefined}
                        className="relative inline-flex items-center gap-2 text-sm md:text-base font-bold text-white uppercase tracking-wider px-6 py-3"
                      >
                        <span>{item.link.label}</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7-7 7"
                          />
                        </svg>
                      </CMSLink>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
