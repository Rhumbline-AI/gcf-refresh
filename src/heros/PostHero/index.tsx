import React from 'react'
import type { Post } from '@/payload-types'
import { formatAuthors } from '@/utilities/formatAuthors'
import adageLogo from '@/images/adage-logo.png'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { publicationLogo, populatedAuthors, title } = post

  const logoUrl =
    typeof publicationLogo === 'object' && publicationLogo !== null
      ? publicationLogo.url
      : null

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="pt-10 pb-6 md:pt-14 md:pb-8" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        <div className="max-w-2xl">
          <img
            src={logoUrl || adageLogo.src}
            alt=""
            className="h-12 md:h-14 w-auto object-contain object-left mb-6"
          />

          <h1
            className="text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.25] text-[#1a1a1a] mb-4"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {title}
          </h1>

          {hasAuthors && (
            <p
              className="text-sm md:text-base text-[#555] font-light"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {formatAuthors(populatedAuthors)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
