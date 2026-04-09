import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

import type { Footer } from '@/payload-types'

import bbbLockup from '@/images/bbb-rating-lockup.png'
import footerWhite from '@/images/footer-white.png'
import { BackToTop } from './BackToTop'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer 
      className="relative pt-8 md:pt-16 pb-12 -mt-16 md:-mt-24 overflow-visible bg-white"
    >
      {/* Rip image: fixed-height + object-fit for consistent sizing; object-position keeps torn edge visible */}
      <div
        className="absolute left-0 w-full pointer-events-none select-none z-20"
        style={{
          top: '-18%',
          height: 'clamp(56px, 9vw, 88px)',
        }}
        aria-hidden
      >
        <img
          src={footerWhite.src}
          alt=""
          className="w-full h-full object-cover object-[center_bottom]"
          style={{ display: 'block' }}
        />
      </div>
      {/* Content: negative margin pulls up into rip overlap zone; padding-top keeps actual content clear */}
      <div
        className="container relative z-10 pt-8 md:pt-10"
        style={{ marginTop: '-clamp(20px, 4vw, 36px)' }}
      >
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="flex gap-4">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </Link>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Image
                src={bbbLockup}
                alt="BBB Accredited Business - Rating A+"
                width={200}
                height={60}
                className="h-auto"
              />
              <div className="text-sm text-foreground/60" style={{ fontFamily: 'var(--font-inter)' }}>
                ©2026 MAKE THINGS BETTER, LLC.
              </div>
            </div>
            <BackToTop />
          </div>
      </div>
    </footer>
  )
}
