import React from 'react'
import { CMSLink } from '@/components/Link'
import type { Page, Post } from '@/payload-types'

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
      {/* Decorative partial circle at top */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-[300px] md:-top-[400px] w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full border-[30px] md:border-[50px] border-white/10 pointer-events-none"
        aria-hidden
      />

      <div className="container relative z-10">
        {title && (
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-white text-center mb-12 md:mb-16 font-light italic"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {items.map((item, i) => {
            const isLastOdd = items.length % 2 !== 0 && i === items.length - 1

            return (
              <div
                key={i}
                className={`border border-white/30 rounded-lg p-6 md:p-8 text-center ${
                  isLastOdd ? 'md:col-span-2 md:max-w-md md:mx-auto' : ''
                }`}
              >
                <h3
                  className="text-lg md:text-xl font-semibold text-white mb-3"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {item.title}
                </h3>
                {item.description && (
                  <p
                    className="text-sm text-white/70 mb-4 leading-relaxed"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {item.description}
                  </p>
                )}
                {item.enableLink && item.link && (
                  <CMSLink
                    {...item.link}
                    className="inline-flex items-center gap-1 text-sm font-bold text-white uppercase tracking-wider border border-white px-4 py-2 rounded hover:bg-white hover:text-[#307fe2] transition-colors"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
