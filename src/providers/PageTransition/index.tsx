'use client'

import React, { useEffect, useRef, useCallback, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const [, startTransition] = useTransition()

  // Fade the new route in on arrival.
  useEffect(() => {
    if (!contentRef.current) return

    gsap.fromTo(
      contentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: 'power2.out' },
    )
  }, [pathname])

  // Intercept internal link clicks so we can drive navigation through a React
  // transition. We intentionally DO NOT fade the page out to opacity 0 anymore —
  // that left the screen blank/white for the entire (sometimes multi-second)
  // server render. Instead the current page stays visible until the next route
  // is ready; slow renders surface the route-level loading.tsx boundary, and the
  // new content fades in via the effect above.
  const handleClick = useCallback(
    (e: MouseEvent) => {
      // Let the browser handle modifier/middle clicks (open in new tab, etc.).
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return
      }

      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (anchor.getAttribute('target') === '_blank') return
      if (href === pathname) return
      if (href.startsWith('#')) return
      if (href.startsWith('/admin')) return

      const [hrefPath] = href.split('#')
      const hasHash = href.includes('#')
      if (hasHash && (hrefPath === pathname || hrefPath === '')) return

      e.preventDefault()
      // Note: do NOT stopPropagation — React onClick handlers (e.g. close mobile menu)
      // need to still fire after we intercept the navigation.
      startTransition(() => {
        router.push(href)
      })
    },
    [pathname, router],
  )

  useEffect(() => {
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [handleClick])

  return (
    <div ref={contentRef} className="flex-1">
      {children}
    </div>
  )
}
