import React from 'react'

import type { BlueStatementBlock as BlueStatementBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

// Full-width solid-blue statement module. No noise texture — kept intentionally
// flat so the typography is the only focal point.
export const BlueStatementBlock: React.FC<BlueStatementBlockProps> = ({ content }) => {
  if (!content) return null

  return (
    <section
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
              '[&_p+p]:mt-2 [&_p+p]:md:mt-3',
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
