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

const heightClasses = {
  small: 'h-[200px] md:h-[300px]',
  medium: 'h-[300px] md:h-[450px]',
  large: 'h-[400px] md:h-[600px]',
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
        />
      </Parallax>
    </div>
  )
}
