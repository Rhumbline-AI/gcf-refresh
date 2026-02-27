import React from 'react'
import type { WorkWithUs as WorkWithUsProps } from '@/payload-types'
import dotMatrixBg from '@/images/dot-matrix-background.gif'
import blueNoiseBg from '@/images/blue-noise-background.jpg'

export const WorkWithUsBlock: React.FC<WorkWithUsProps> = ({ title, image }) => {
  const imageUrl = typeof image === 'object' && image !== null ? image.url : null
  
  return (
    <div
      className="py-16 md:py-24 relative"
      style={{
        backgroundImage: `url(${dotMatrixBg.src})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px',
        backgroundPosition: '0 0',
        backgroundColor: '#ffffff',
      }}
    >
      <div className="container relative z-10 flex flex-col items-center justify-center">
        {/* The Blue Circle */}
        <div className="relative w-full max-w-[396px] aspect-square">
          {/* Main circle content */}
          <div 
            className="w-full h-full rounded-full flex flex-col items-center justify-center p-8 md:p-16 overflow-hidden"
            style={{ 
              backgroundColor: '#307fe2',
              backgroundImage: `url(${blueNoiseBg.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Image content */}
            {imageUrl && (
              <img
                src={imageUrl}
                alt={title || 'Work With Us'}
                className="w-full h-full object-contain"
                style={{
                  maxWidth: '80%',
                  maxHeight: '80%',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
