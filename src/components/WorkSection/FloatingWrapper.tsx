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
 *     field hold still. The push amount is small (~10:1 ratio at peak) and
 *     hard-capped so the layout never breaks.
 *
 * Idle drift is applied via GSAP-controlled `transform` (x/y/rotation).
 * Cursor offset is applied via the separate CSS `translate` property using
 * `--cx` / `--cy` custom properties, so the two layers compose without
 * stomping on each other's transform values.
 *
 * IMPORTANT: the cursor `mousemove` listener is attached IMMEDIATELY so that
 * React Strict Mode's double-invoke + cleanup can't accidentally orphan the
 * setup. We gate the *effect* (does the orb move?) on an `entranceDone` flag
 * that flips inside the entrance tween's onComplete. If the entrance tween is
 * killed (e.g. by strict-mode cleanup), the second mount sets it again — and
 * even if it never fires, we have a setTimeout fallback so cursor reactivity
 * always turns on within ~2s of mount.
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
  /** Influence radius as a multiplier of the orb's own diameter. */
  influenceRadius = 1.4,
  /** Push ratio at peak weight — `0.1` ≈ 100px cursor → ~10px orb. */
  pushFactor = 0.1,
  /** Hard cap on displacement (px) so the design can't be broken. */
  maxOffset = 30,
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
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const tweens: gsap.core.Tween[] = []
    let st: ScrollTrigger | null = null
    let entranceDone = false
    let entranceFallback: ReturnType<typeof setTimeout> | null = null
    const isTouch = window.matchMedia('(pointer: coarse)').matches

    gsap.set(el, { opacity: 0, scale: 0.6, y: 60 })

    // Polar-magnet reactivity. Listener is attached immediately so React
    // Strict Mode (which mounts → cleans up → mounts again in dev) cannot leave
    // us with no listener. The handler short-circuits until the orb's entrance
    // animation has finished, so it doesn't fight with the intro motion.
    const handleMouseMove = (e: MouseEvent) => {
      if (!entranceDone || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      // If the orb is unrendered (display:none, etc.) bail out cleanly.
      if (rect.width === 0 || rect.height === 0) return

      const orbCx = rect.left + rect.width / 2
      const orbCy = rect.top + rect.height / 2

      // Vector from orb center → cursor; we push the orb in the OPPOSITE
      // direction so it feels repelled by the pointer.
      const dx = e.clientX - orbCx
      const dy = e.clientY - orbCy
      const dist = Math.hypot(dx, dy)

      // Influence field scales with the orb's own size; bigger orbs feel the
      // cursor from further away. Floor keeps tiny orbs (mobile) reactive.
      const radius = Math.max(rect.width, 220) * influenceRadius

      let offX = 0
      let offY = 0
      if (dist < radius && dist > 0) {
        const weight = 1 - dist / radius
        offX = -dx * pushFactor * weight
        offY = -dy * pushFactor * weight

        // Clamp magnitude so the orb can never drift far enough to break the
        // layout, no matter how the math shakes out.
        const om = Math.hypot(offX, offY)
        if (om > maxOffset) {
          offX = (offX / om) * maxOffset
          offY = (offY / om) * maxOffset
        }
      }

      gsap.to(el, {
        '--cx': `${offX}px`,
        '--cy': `${offY}px`,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      } as gsap.TweenVars)
    }

    // When the pointer leaves the document entirely, relax the orb back to
    // rest. Listen on documentElement (an actual Element) for reliable
    // mouseleave semantics across browsers.
    const handleMouseLeave = () => {
      if (!ref.current) return
      gsap.to(el, {
        '--cx': '0px',
        '--cy': '0px',
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      } as gsap.TweenVars)
    }

    if (!isTouch) {
      window.addEventListener('mousemove', handleMouseMove)
      document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    }

    // Use bottom of viewport (top 100%) so orbs partially below the fold still
    // animate in promptly.
    st = ScrollTrigger.create({
      trigger: el,
      start: 'top 100%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          delay: entranceDelay,
          ease: 'power3.out',
          onComplete: () => {
            tweens.push(
              gsap.to(el, {
                y: floatAmount,
                duration: floatDuration,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
              }),
              gsap.to(el, {
                x: swayAmount,
                duration: floatDuration * 1.3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
              }),
              gsap.to(el, {
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

    // Belt-and-suspenders fallback: if the entrance tween somehow never fires
    // (strict-mode race, ScrollTrigger refresh edge case, etc.) we still flip
    // the gate on after a beat so cursor reactivity is never permanently off.
    entranceFallback = setTimeout(
      () => {
        entranceDone = true
      },
      Math.max(2000, (entranceDelay + 1.4) * 1000),
    )

    return () => {
      st?.kill()
      tweens.forEach((t) => t.kill())
      if (entranceFallback) clearTimeout(entranceFallback)
      // Don't kill all tweens on the element — that races with the second
      // strict-mode mount's entrance tween. The float/sway/rotate refs above
      // are killed individually; the entrance tween will be replaced by the
      // next mount's gsap.set + new entrance.
      if (!isTouch) {
        window.removeEventListener('mousemove', handleMouseMove)
        document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [entranceDelay, floatAmount, floatDuration, swayAmount, rotateAmount, influenceRadius, pushFactor, maxOffset])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        translate: 'var(--cx, 0px) var(--cy, 0px)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
