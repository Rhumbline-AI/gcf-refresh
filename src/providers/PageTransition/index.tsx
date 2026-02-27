'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const prevPathname = useRef(pathname)

  // Fade in when pathname changes
  useEffect(() => {
    if (!contentRef.current) return

    gsap.set(contentRef.current, { opacity: 0 })
    gsap.to(contentRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
      delay: 0.05,
    })

    prevPathname.current = pathname
  }, [pathname])

  // Intercept internal link clicks for fade-out before navigation
  const handleClick = useCallback(
    (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (anchor.getAttribute('target') === '_blank') return
      if (href === pathname) return
      if (href.startsWith('#')) return
      if (href.startsWith('/admin')) return

      e.preventDefault()
      e.stopPropagation()

      if (!contentRef.current) {
        router.push(href)
        return
      }

      gsap.to(contentRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          router.push(href)
        },
      })
    },
    [pathname, router],
  )

  useEffect(() => {
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [handleClick])

  return (
    <div ref={contentRef}>
      {children}
    </div>
  )
}
