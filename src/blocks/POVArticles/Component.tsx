import React from 'react'
import type { Media as MediaType } from '@/payload-types'
import adageLogo from '@/images/adage-logo.png'
import { ScrollReveal } from '@/components/ScrollReveal'

type Article = {
  logo?: (number | null) | MediaType
  title: string
  description?: string | null
  link?: string | null
}

type POVArticlesProps = {
  articles?: Article[] | null
}

export const POVArticlesBlock: React.FC<POVArticlesProps> = ({ articles }) => {
  if (!articles || articles.length === 0) return null

  return (
    <div className="pt-6 pb-24 md:pt-8 md:pb-32" style={{ backgroundColor: '#f7f2ee' }}>
      <div className="container">
        <div className="max-w-md">
          <ScrollReveal animation="fadeUp" staggerChildren stagger={0.2} duration={0.8}>
            <div className="flex flex-col gap-14 md:gap-20">
              {articles.map((article, index) => {
                const logoUrl =
                  typeof article.logo === 'object' && article.logo !== null
                    ? article.logo.url
                    : null

                return (
                  <div key={index} className="flex flex-col gap-1">
                    <img
                      src={logoUrl || adageLogo.src}
                      alt=""
                      className="h-12 md:h-14 w-auto object-contain object-left mb-2"
                    />
                    <h3
                      className="text-xl md:text-2xl font-extrabold uppercase tracking-wide text-[#307fe2]"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {article.title}
                    </h3>
                    {article.description && (
                      <p
                        className="text-base md:text-lg text-[#333] leading-relaxed font-light mt-1"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        {article.description}
                      </p>
                    )}
                    {article.link && (
                      // Explicit CTA below the copy — destination is the
                      // existing `link` field on the article, so editors set
                      // the URL once and it powers this link.
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 self-start text-base md:text-lg font-semibold text-[#307fe2] underline underline-offset-4 decoration-2 hover:opacity-80 transition-opacity"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        View Article
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M3 8h10m0 0L9 4m4 4l-4 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
