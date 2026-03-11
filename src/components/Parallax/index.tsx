'use client'

import React, { useEffect, useRef } from 'react'
import { gsap, registerGSAP, ScrollTrigger } from '@/utilities/gsapSetup'

registerGSAP()

type Props = {
  children: React.ReactNode
  speed?: number
  className?: string
  style?: React.CSSProperties
}

export const Parallax: React.FC<Props> = ({
  children,
  speed = 0.3,
  className,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    const st = gsap.to(el, {
      y: () => speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      if (st.scrollTrigger) st.scrollTrigger.kill()
      st.kill()
    }
  }, [speed])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
