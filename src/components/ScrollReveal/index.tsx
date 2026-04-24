'use client'

import React, { useEffect, useRef } from 'react'
import { gsap, registerGSAP, ScrollTrigger } from '@/utilities/gsapSetup'

registerGSAP()

type Animation = 'fadeUp' | 'fadeIn' | 'fadeLeft' | 'fadeRight' | 'scaleUp' | 'scaleIn'

const presets: Record<Animation, gsap.TweenVars> = {
  fadeUp: { y: 70, opacity: 0 },
  fadeIn: { opacity: 0 },
  fadeLeft: { x: -60, opacity: 0 },
  fadeRight: { x: 60, opacity: 0 },
  scaleUp: { y: 40, scale: 0.9, opacity: 0 },
  scaleIn: { scale: 0.82, opacity: 0 },
}

type Props = {
  children: React.ReactNode
  animation?: Animation
  duration?: number
  delay?: number
  stagger?: number
  staggerChildren?: boolean
  start?: string
  className?: string
  style?: React.CSSProperties
}

export const ScrollReveal: React.FC<Props> = ({
  children,
  animation = 'fadeUp',
  duration = 1.2,
  delay = 0,
  stagger = 0.12,
  staggerChildren = false,
  start = 'top 68%',
  className,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const from = presets[animation]

    // Defensive multi-trigger pattern. We use ScrollTrigger as the primary
    // reveal mechanism, but we've seen sporadic failures (most reproducible on
    // mobile + React Strict Mode) where the trigger is created but never fires
    // — leaving content stuck at opacity 0. To make sure nothing is ever
    // permanently invisible, we layer two backups:
    //   1. an IntersectionObserver (independent of GSAP / ScrollTrigger)
    //   2. a final setTimeout safety net
    // Whichever fires first wins; the rest become no-ops via `revealed`.
    let revealed = false

    if (staggerChildren) {
      const kids = Array.from(el.children)
      if (kids.length === 0) return
      gsap.set(kids, from)

      const reveal = () => {
        if (revealed) return
        revealed = true
        gsap.to(kids, {
          y: 0, x: 0, scale: 1, opacity: 1,
          duration,
          delay,
          stagger,
          ease: 'power3.out',
          clearProps: 'transform',
        })
      }

      const st = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: reveal,
      })

      const io =
        typeof IntersectionObserver !== 'undefined'
          ? new IntersectionObserver(
              (entries) => {
                if (entries.some((e) => e.isIntersecting)) reveal()
              },
              { rootMargin: '0px 0px -10% 0px' },
            )
          : null
      io?.observe(el)

      const safety = setTimeout(reveal, 4000)

      return () => {
        st.kill()
        io?.disconnect()
        clearTimeout(safety)
      }
    }

    gsap.set(el, from)

    const reveal = () => {
      if (revealed) return
      revealed = true
      gsap.to(el, {
        y: 0, x: 0, scale: 1, opacity: 1,
        duration,
        delay,
        ease: 'power3.out',
        clearProps: 'transform',
      })
    }

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: reveal,
    })

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((e) => e.isIntersecting)) reveal()
            },
            { rootMargin: '0px 0px -10% 0px' },
          )
        : null
    io?.observe(el)

    const safety = setTimeout(reveal, 4000)

    return () => {
      st.kill()
      io?.disconnect()
      clearTimeout(safety)
    }
  }, [animation, duration, delay, stagger, staggerChildren, start])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
