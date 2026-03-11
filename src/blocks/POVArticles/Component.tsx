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
    <div className="pt-8 pb-16 md:pt-10 md:pb-24" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        <div className="max-w-md">
          <ScrollReveal animation="fadeUp" staggerChildren stagger={0.2} duration={0.8}>
            <div className="flex flex-col gap-14 md:gap-20">
              {articles.map((article, index) => {
                const logoUrl =
                  typeof article.logo === 'object' && article.logo !== null
                    ? article.logo.url
                    : null

                const content = (
                  <div className="flex flex-col gap-1">
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
                  </div>
                )

                if (article.link) {
                  return (
                    <a
                      key={index}
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:opacity-80 transition-opacity"
                    >
                      {content}
                    </a>
                  )
                }

                return <div key={index}>{content}</div>
              })}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
