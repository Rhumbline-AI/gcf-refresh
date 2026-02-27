'use client'

import React from 'react'
import RichText from '@/components/RichText'
import type { Page } from '@/payload-types'
import dotMatrixBg from '@/images/dot-matrix-background.gif'

type WorkHeroProps = Page['hero']

export const WorkHero: React.FC<WorkHeroProps> = ({ richText }) => {
  return (
    <div
      className="relative pt-12 pb-8 md:pt-16 md:pb-12"
      style={{
        backgroundImage: `url(${dotMatrixBg.src})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px',
        backgroundPosition: '0 0',
        backgroundColor: '#ffffff',
      }}
    >
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          {richText && (
            <RichText
              className="[&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:lg:text-6xl [&_h1]:font-extralight [&_h1]:text-[#343434] [&_h1]:mb-4 [&_h1]:leading-tight [&_p]:text-base [&_p]:md:text-lg [&_p]:text-[#343434] [&_p]:font-light"
              data={richText}
              enableGutter={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}
