'use client'

import React, { useEffect, useRef } from 'react'
import { gsap, registerGSAP, ScrollTrigger } from '@/utilities/gsapSetup'

registerGSAP()

/**
 * Wraps a project orb with two layers of motion:
 *
 *  1. Idle drift — a continuous, very gentle sine float (y / x / rotation) so
 *     the orb feels alive even when the user isn't interacting.
 *
 *  2. Polar-magnet cursor reactivity — when the pointer enters a soft circular
 *     "field" around the orb, the orb is *pushed away* from the pointer along
 *     the same axis, like two magnets repelling each other. Each orb reacts
 *     independently based on its own distance to the cursor; orbs outside the
 *     field hold still.
 *
 * Implementation notes:
 *  - We use TWO nested divs so the two motion layers never share a transform
 *    stack. The outer div carries the cursor offset; the inner div carries
 *    the entrance animation and the idle float. This is far more reliable
 *    than trying to compose them on a single element via `transform` +
 *    `translate` + CSS custom properties (which we tried and which silently
 *    failed in some browser/GSAP combinations).
 *  - Cursor offset uses `gsap.quickTo` — GSAP's purpose-built high-frequency
 *    setter, ideal for cursor-driven animation.
 *  - Entrance is gated by an `entranceDone` flag so the cursor reactivity
 *    can't fight the intro animation. A setTimeout fallback flips the flag
 *    even if the entrance tween somehow never fires (Strict Mode / refresh
 *    edge cases).
 */
export function FloatingWrapper({
  children,
  className,
  style,
  entranceDelay = 0,
  floatAmount = 8,
  floatDuration = 4,
  swayAmount = 4,
  rotateAmount = 1.5,
  /** How far around the orb the cursor field reaches, as a multiple of the orb's own diameter. */
  influenceRadius = 1.8,
  /** Push ratio: 1px of cursor proximity → ~pushFactor px of orb shift at peak weight. */
  pushFactor = 0.35,
  /** Hard cap on displacement (px) so the layout can't break, no matter how the math shakes out. */
  maxOffset = 140,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  entranceDelay?: number
  floatAmount?: number
  floatDuration?: number
  swayAmount?: number
  rotateAmount?: number
  influenceRadius?: number
  pushFactor?: number
  maxOffset?: number
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const tweens: gsap.core.Tween[] = []
    let st: ScrollTrigger | null = null
    let entranceDone = false

    // Make sure no straggler tweens from a previous (Strict-Mode) mount linger.
    gsap.killTweensOf(inner)
    gsap.killTweensOf(outer)

    // Inner: entrance + idle drift
    gsap.set(inner, { opacity: 0, scale: 0.6, y: 60, x: 0, rotation: 0 })
    // Outer: cursor offset starts at 0
    gsap.set(outer, { x: 0, y: 0 })

    // gsap.quickTo is a tuned single-property setter — perfect for mouse-driven
    // animation. Each call queues an interpolation toward the new target;
    // subsequent calls smoothly redirect mid-flight.
    const xTo = gsap.quickTo(outer, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(outer, 'y', { duration: 0.6, ease: 'power3.out' })

    const onMouseMove = (e: MouseEvent) => {
      if (!entranceDone) return
      const rect = outer.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const orbCx = rect.left + rect.width / 2
      const orbCy = rect.top + rect.height / 2

      // Vector from orb center → cursor; we push the orb in the OPPOSITE
      // direction (negate) so it feels repelled by the pointer.
      const dx = e.clientX - orbCx
      const dy = e.clientY - orbCy
      const dist = Math.hypot(dx, dy)

      // Influence field scales with the orb's own size; bigger orbs feel the
      // cursor from further away. Floor keeps tiny mobile orbs reactive too.
      const radius = Math.max(rect.width, 240) * influenceRadius

      let offX = 0
      let offY = 0
      if (dist < radius && dist > 0) {
        // Weight is 1 at the orb's center, falling linearly to 0 at the
        // edge of the influence field. Squaring it would bias the effect
        // toward close-proximity reaction — keep it linear so the field
        // feels even.
        const weight = 1 - dist / radius
        offX = -dx * pushFactor * weight
        offY = -dy * pushFactor * weight

        const om = Math.hypot(offX, offY)
        if (om > maxOffset) {
          offX = (offX / om) * maxOffset
          offY = (offY / om) * maxOffset
        }
      }

      xTo(offX)
      yTo(offY)
    }

    // When the pointer leaves the document entirely, relax the orb back home.
    const onMouseLeave = () => {
      xTo(0)
      yTo(0)
    }

    if (!isTouch) {
      window.addEventListener('mousemove', onMouseMove, { passive: true })
      document.documentElement.addEventListener('mouseleave', onMouseLeave)
    }

    // Entrance + idle float on the inner div. ScrollTrigger fires `onEnter`
    // immediately for elements already in the viewport at trigger creation.
    st = ScrollTrigger.create({
      trigger: outer,
      start: 'top 100%',
      once: true,
      onEnter: () => {
        gsap.to(inner, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          delay: entranceDelay,
          ease: 'power3.out',
          onComplete: () => {
            // Idle drift — gentle sine waves on independent timing so the
            // orbs don't visually sync up.
            tweens.push(
              gsap.to(inner, {
                y: floatAmount,
                duration: floatDuration,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
              }),
              gsap.to(inner, {
                x: swayAmount,
                duration: floatDuration * 1.3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
              }),
              gsap.to(inner, {
                rotation: rotateAmount,
                duration: floatDuration * 1.6,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
              }),
            )
            entranceDone = true
          },
        })
      },
    })

    // Belt-and-suspenders: if the entrance tween somehow never completes
    // (Strict-Mode re-mount, ScrollTrigger refresh edge case, etc.) we still
    // flip the gate so cursor reactivity is never permanently off.
    const fallback = setTimeout(
      () => {
        entranceDone = true
      },
      Math.max(2200, (entranceDelay + 1.5) * 1000),
    )

    return () => {
      st?.kill()
      tweens.forEach((t) => t.kill())
      clearTimeout(fallback)
      if (!isTouch) {
        window.removeEventListener('mousemove', onMouseMove)
        document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      }
    }
  }, [entranceDelay, floatAmount, floatDuration, swayAmount, rotateAmount, influenceRadius, pushFactor, maxOffset])

  return (
    <div ref={outerRef} className={className} style={style}>
      <div ref={innerRef} style={{ opacity: 0, willChange: 'transform' }}>
        {children}
      </div>
    </div>
  )
}
