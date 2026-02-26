import React from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

type MethodologyItem = {
  label: string
  description: string
  image?: (number | null) | MediaType
}

type AboutMethodologyProps = {
  items?: MethodologyItem[] | null
  overlayImage?: (number | null) | MediaType
}

export const AboutMethodologyBlock: React.FC<AboutMethodologyProps> = ({
  items,
  overlayImage,
}) => {
  if (!items || items.length === 0) return null

  const topRow = items.slice(0, 2)
  const bottomRow = items.slice(2, 4)

  return (
    <div className="relative py-16 md:py-24 overflow-hidden bg-background">
      {/* Large decorative grey partial circle */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[900px] md:h-[900px] lg:w-[1100px] lg:h-[1100px] rounded-full border-[40px] md:border-[60px] border-muted-foreground/10 pointer-events-none"
        aria-hidden
      />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
          {/* Methodology grid */}
          <div className="flex-1 w-full max-w-2xl">
            {/* Top row */}
            <div className="grid grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12">
              {topRow.map((item, i) => (
                <MethodologyCircle key={i} item={item} />
              ))}
            </div>
            {/* Bottom row */}
            <div className="grid grid-cols-2 gap-8 md:gap-12">
              {bottomRow.map((item, i) => (
                <MethodologyCircle key={i} item={item} />
              ))}
            </div>
          </div>

          {/* Overlay image */}
          {overlayImage && typeof overlayImage === 'object' && (
            <div className="relative w-full lg:w-[45%] lg:-ml-16 aspect-[4/5] rounded-tl-[50%] overflow-hidden">
              <Media resource={overlayImage} fill imgClassName="object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MethodologyCircle({ item }: { item: MethodologyItem }) {
  const hasImage = item.image && typeof item.image === 'object'

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="relative w-32 h-32 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full overflow-hidden mb-4"
        style={{ backgroundColor: '#307fe2' }}
      >
        {hasImage && (
          <Media resource={item.image as MediaType} fill imgClassName="object-cover" />
        )}
      </div>
      <h3
        className="text-sm md:text-base font-bold uppercase tracking-wider mb-2 text-[#307fe2]"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {item.label}
      </h3>
      <p
        className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-[200px]"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {item.description}
      </p>
    </div>
  )
}
