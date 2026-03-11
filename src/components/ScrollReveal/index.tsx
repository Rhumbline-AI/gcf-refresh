'use client'

import React, { useEffect, useRef } from 'react'
import { gsap, registerGSAP, ScrollTrigger } from '@/utilities/gsapSetup'

registerGSAP()

type Animation = 'fadeUp' | 'fadeIn' | 'fadeLeft' | 'fadeRight' | 'scaleUp' | 'scaleIn'

const presets: Record<Animation, gsap.TweenVars> = {
  fadeUp: { y: 50, opacity: 0 },
  fadeIn: { opacity: 0 },
  fadeLeft: { x: -50, opacity: 0 },
  fadeRight: { x: 50, opacity: 0 },
  scaleUp: { y: 30, scale: 0.92, opacity: 0 },
  scaleIn: { scale: 0.85, opacity: 0 },
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
  duration = 0.9,
  delay = 0,
  stagger = 0.1,
  staggerChildren = false,
  start = 'top 85%',
  className,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const from = presets[animation]

    if (staggerChildren) {
      const kids = Array.from(el.children)
      if (kids.length === 0) return
      gsap.set(kids, from)
      const st = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          gsap.to(kids, {
            y: 0, x: 0, scale: 1, opacity: 1,
            duration,
            delay,
            stagger,
            ease: 'power3.out',
            clearProps: 'transform',
          })
        },
      })
      return () => st.kill()
    }

    gsap.set(el, from)
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        gsap.to(el, {
          y: 0, x: 0, scale: 1, opacity: 1,
          duration,
          delay,
          ease: 'power3.out',
          clearProps: 'transform',
        })
      },
    })
    return () => st.kill()
  }, [animation, duration, delay, stagger, staggerChildren, start])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
