'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className="relative z-50 border-b border-border/30" style={{ backgroundColor: '#f7f2ee' }} {...(theme ? { 'data-theme': theme } : {})}>
      <div className="container relative z-20">
        <div className="py-6 flex justify-between items-center gap-8">
          {/*
            shrink-0 is critical here. The header is a flex row whose only two
            children are this Link and HeaderNav. Flex defaults to shrink: 1,
            so on viewports where the nav text wants more horizontal space than
            is available, the path of least resistance is to squeeze THIS link
            down — visually compressing the GCF circle into an ellipse. Pinning
            shrink to 0 keeps the logo at its natural width and lets the nav
            row reflow / wrap instead.
          */}
          <Link href="/" className="flex items-center shrink-0">
            <Logo loading="eager" priority="high" />
          </Link>
          <HeaderNav data={data} />
        </div>
      </div>
    </header>
  )
}
