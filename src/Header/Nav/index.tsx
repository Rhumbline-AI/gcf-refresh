'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Menu, X } from 'lucide-react'
import blueNoiseBg from '@/images/blue-noise-background.jpg'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const navItems = data?.navItems || []

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-8 items-center">
        {navItems.map(({ link }, i) => {
          return (
            <CMSLink 
              key={i} 
              {...link} 
              appearance="link"
              className="text-foreground font-medium text-lg tracking-wide hover:text-primary transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            />
          )
        })}
      </nav>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[#343434] text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Navigation - Full Screen Overlay */}
      {mobileMenuOpen && (
        <nav
          className="fixed inset-0 z-50 flex flex-col items-center justify-center md:hidden"
          style={{
            backgroundImage: `url(${blueNoiseBg.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#307fe2',
          }}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-[#343434] text-white"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Nav Links */}
          <div className="flex flex-col items-center gap-10">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink 
                  key={i} 
                  {...link} 
                  appearance="link"
                  className="text-[#343434] font-bold text-4xl uppercase tracking-wider hover:text-white transition-colors"
                  style={{ fontFamily: 'var(--font-inter)' }}
                  onClick={() => setMobileMenuOpen(false)}
                />
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}
