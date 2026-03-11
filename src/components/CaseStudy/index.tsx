import React from 'react'
import type { Project, Media } from '@/payload-types'
import RichText from '@/components/RichText'
import Image from 'next/image'
import blueBg from '@/images/blue-case-study-bg.jpg'
import scribble1 from '@/images/scribble-case-study.png'
import scribble2 from '@/images/scribble-case-study2.png'
import shadow2 from '@/images/case-study-block2-shadow2.png'
import arrowLeft from '@/images/scribble-arrow-left.png'
import arrowRight from '@/images/scribble-arrow-right.png'

type CaseStudyProps = {
  project: Project
}

function Section({ heading, body }: { heading: string; body?: string | null }) {
  if (!body) return null
  return (
    <div className="mb-10">
      <h3
        className="text-lg md:text-xl font-extrabold uppercase tracking-wider text-[#1a1a1a] mb-3"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {heading}
      </h3>
      <p
        className="text-sm md:text-[0.95rem] text-[#333] leading-[1.8] font-light"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {body}
      </p>
    </div>
  )
}

const getAspectRatioClass = (ratio: string) => {
  switch (ratio) {
    case '16:9':
      return 'aspect-[16/9]'
    case '9:16':
      return 'aspect-[9/16]'
    case '1:1':
      return 'aspect-square'
    default:
      return 'aspect-[16/9]'
  }
}

const getScribbleForBlock = (index: number) => {
  const blockNumber = (index % 4) + 1
  switch (blockNumber) {
    case 1:
      return scribble1
    case 2:
      return shadow2
    case 3:
      return shadow2
    case 4:
      return scribble2
    default:
      return null
  }
}

export const CaseStudy: React.FC<CaseStudyProps> = ({ project }) => {
  const {
    clientName,
    campaignTitle,
    subtitle,
    problem,
    spark,
    growthFuel,
    results,
    contentBlocks,
    caseStudyContent,
  } = project

  return (
    <div>
      <div className="pt-10 pb-8 md:pt-14 md:pb-10" style={{ backgroundColor: '#f5f0eb' }}>
        <div className="container">
          {/* Client name with underline extending beyond text */}
          {clientName && (
            <div className="mb-8 inline-block">
              <p
                className="text-xl md:text-2xl text-[#307fe2] font-medium pb-1"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {clientName}
              </p>
              <div className="w-full h-[2px] bg-[#307fe2]" />
            </div>
          )}

          {/* Campaign title */}
          {campaignTitle && (
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight text-[#307fe2] leading-[1.05] mb-2"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {campaignTitle}
            </h1>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p
              className="text-sm md:text-base text-[#307fe2] font-light italic mb-12"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {subtitle}
            </p>
          )}

          {/* Two column: sections + results circle */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-start md:items-center">
            {/* Left column - text sections */}
            <div className="flex-1 max-w-lg">
              <Section heading="Problem" body={problem} />
              <Section heading="Spark" body={spark} />
              <Section heading="Growth Fuel" body={growthFuel} />
            </div>

            {/* Right column - results circle */}
            {results && (
              <div className="flex-shrink-0 flex items-center justify-center">
                <div
                  className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full flex flex-col justify-center px-12 md:px-16 py-10 md:py-14"
                  style={{
                    backgroundColor: '#307fe2',
                  }}
                >
                  <h3
                    className="text-xl md:text-2xl font-extrabold uppercase tracking-wider text-white mb-3"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    Results
                  </h3>
                  <p
                    className="text-sm md:text-base text-white font-medium leading-relaxed"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {results}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alternating content blocks with blue background */}
      {contentBlocks && contentBlocks.length > 0 && (
        <div
          className="relative py-20 md:py-32"
          style={{
            backgroundImage: `url(${blueBg.src})`,
            backgroundRepeat: 'repeat-y',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="container">
            <div className="max-w-6xl mx-auto space-y-24 md:space-y-32">
              {contentBlocks.map((block, index) => {
                const isLeft = index % 2 === 0
                const media = block.media as Media
                const scribble = getScribbleForBlock(index)
                const showArrow = index % 2 === 0

                return (
                  <div
                    key={index}
                    className={`relative flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}
                  >
                    {/* Media container with scribble background */}
                    <div className="relative flex-1">
                      {scribble && (
                        <Image
                          src={scribble}
                          alt=""
                          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
                          style={{
                            transform: isLeft ? 'translate(-5%, -5%)' : 'translate(5%, -5%)',
                          }}
                        />
                      )}
                      <div className="relative z-10">
                        {media && typeof media !== 'number' && (
                          <div
                            className={`relative ${getAspectRatioClass(block.aspectRatio || '16:9')} w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl`}
                          >
                            <Image
                              src={media.url || ''}
                              alt={media.alt || ''}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Caption with arrow */}
                    {block.caption && (
                      <div className="relative flex-1 flex items-center">
                        {showArrow && (
                          <Image
                            src={isLeft ? arrowRight : arrowLeft}
                            alt=""
                            className="absolute hidden md:block pointer-events-none"
                            style={{
                              [isLeft ? 'left' : 'right']: '-10%',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '80px',
                              height: 'auto',
                            }}
                          />
                        )}
                        <p
                          className="text-lg md:text-2xl font-bold uppercase tracking-wide text-white leading-tight"
                          style={{ fontFamily: 'var(--font-inter)' }}
                        >
                          {block.caption}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Additional rich text content below the main case study */}
      {caseStudyContent && (
        <div className="py-16 md:py-20" style={{ backgroundColor: '#f5f0eb' }}>
          <div className="container max-w-4xl">
            <RichText
              data={caseStudyContent}
              enableGutter={false}
              className="prose prose-lg max-w-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}
