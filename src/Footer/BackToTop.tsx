'use client'

import React from 'react'

export function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
      style={{ fontFamily: 'var(--font-inter)' }}
    >
      <span className="text-sm font-medium">Back to top</span>
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </div>
    </button>
  )
}
