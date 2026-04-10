'use client'

import React from 'react'
import dotMatrixBg from '@/images/dot-matrix-background-fix1.gif'

export const DotMatrixBackground: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${dotMatrixBg.src})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '700px',
        backgroundPosition: '0 0',
        backgroundColor: '#ffffff',
      }}
    >
      {children}
    </div>
  )
}
