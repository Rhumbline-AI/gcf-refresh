import React from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { Parallax } from '@/components/Parallax'

type FullWidthBackgroundProps = {
  backgroundImage?: (number | null) | MediaType
  height?: 'small' | 'medium' | 'large' | null
  grayscale?: boolean | null
  overlapPrevious?: boolean | null
}

// Heights now track a 16:9-ish ratio of the viewport width instead of being
// flat pixel values. Previously a "large" full-width banner on a 1440px
// desktop rendered ~2.4:1 (very letterbox-wide); switching to 56.25vw means
// it sits much closer to a true 16:9 frame while still capping out on
// ultra-wide displays so the video can never balloon past a sensible max.
//
//   small  ≈ 21:9 (cinematic banner)
//   medium ≈ 16:9
//   large  ≈ 16:9 (with a taller cap for hero use)
const heightClasses = {
  small: 'h-[clamp(200px,42vw,520px)]',
  medium: 'h-[clamp(300px,56.25vw,820px)]',
  large: 'h-[clamp(400px,56.25vw,1000px)]',
}

export const FullWidthBackgroundBlock: React.FC<FullWidthBackgroundProps> = ({
  backgroundImage,
  height = 'medium',
  grayscale = true,
  overlapPrevious = true,
}) => {
  if (!backgroundImage || typeof backgroundImage !== 'object') return null

  const heightClass = heightClasses[height || 'medium']

  return (
    <div
      className={`relative w-full ${heightClass} ${overlapPrevious ? '-mt-64 md:-mt-80' : ''} overflow-hidden`}
    >
      <Parallax speed={-0.15} className="absolute inset-0" style={{ top: '-15%', bottom: '-15%' }}>
        <Media
          resource={backgroundImage}
          fill
          imgClassName={`object-cover scale-150 ${grayscale ? 'grayscale' : ''}`}
          videoClassName={`absolute inset-0 w-full h-full object-cover ${grayscale ? 'grayscale' : ''}`}
        />
      </Parallax>
    </div>
  )
}
