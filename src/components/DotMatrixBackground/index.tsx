'use client'

import React from 'react'

export const DotMatrixBackground: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`dot-matrix-bg ${className}`}>
      {children}
    </div>
  )
}
