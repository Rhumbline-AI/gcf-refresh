import React from 'react'
import type { LogoGrid as LogoGridProps } from '@/payload-types'
import { Media } from '@/components/Media'
import { ScrollReveal } from '@/components/ScrollReveal'

export const LogoGridBlock: React.FC<LogoGridProps> = ({ logos }) => {
  return (
    <div className="py-12 md:py-16 bg-background">
      <div className="container">
        <ScrollReveal animation="fadeUp" staggerChildren stagger={0.06} duration={0.6}>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-4 md:gap-y-10 items-center justify-items-center">
            {logos?.map((item, i) => {
              if (typeof item.logo === 'object') {
                return (
                  <div key={i} className="relative w-full h-20 md:h-28 opacity-80 hover:opacity-100 transition-opacity duration-300">
                    <Media resource={item.logo} fill imgClassName="object-contain" />
                  </div>
                )
              }
              return null
            })}
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
