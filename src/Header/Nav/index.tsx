'use client'

import React, { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Menu, X } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navItems = data?.navItems || []

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
        className="md:hidden p-2 text-foreground"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="absolute top-full left-0 right-0 bg-background border-b border-border/30 md:hidden">
          <div className="container py-4 flex flex-col gap-4">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink 
                  key={i} 
                  {...link} 
                  appearance="link"
                  className="text-foreground font-medium text-lg tracking-wide hover:text-primary transition-colors"
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
