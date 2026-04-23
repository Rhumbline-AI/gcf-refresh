import React from 'react'
import type { Project, Media } from '@/payload-types'
import RichText from '@/components/RichText'
import Image from 'next/image'
import blueBg from '@/images/blue-case-study-bg.jpg'
import blueNoiseBg from '@/images/blue-noise-background.jpg'
import scribble1 from '@/images/scribble-case-study.png'
import scribble2 from '@/images/scribble-case-study2.png'
import shadow2 from '@/images/case-study-block2-shadow2.png'
import arrowLeft from '@/images/scribble-arrow-left.png'
import arrowRight from '@/images/scribble-arrow-right.png'
import hand2 from '@/images/hand2.gif'
import { ScrollReveal } from '@/components/ScrollReveal'

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

/** Constrain width for portrait/square ratios so they don't appear too wide. 16:9 slightly reduced. */
const getMediaWidthClass = (ratio: string) => {
  switch (ratio) {
    case '16:9':
      return 'max-w-[90%] md:max-w-[520px] mx-auto'
    case '9:16':
      return 'max-w-[300px] md:max-w-[360px] mx-auto'
    case '1:1':
      return 'max-w-[360px] md:max-w-[420px] mx-auto'
    default:
      return 'max-w-[90%] md:max-w-[520px] mx-auto'
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
            <ScrollReveal animation="fadeUp" duration={0.7} delay={0.1}>
              <div className="mb-8 inline-block">
                <p
                  className="text-xl md:text-2xl text-[#307fe2] font-medium pb-1"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {clientName}
                </p>
                <div className="w-full h-[2px] bg-[#307fe2]" />
              </div>
            </ScrollReveal>
          )}

          {/* Campaign title */}
          {campaignTitle && (
            <ScrollReveal animation="fadeUp" duration={1} delay={0.2}>
              <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight text-[#307fe2] leading-[1.05] mb-2"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {campaignTitle}
              </h1>
            </ScrollReveal>
          )}

          {/* Subtitle */}
          {subtitle && (
            <ScrollReveal animation="fadeUp" duration={0.8} delay={0.35}>
              <p
                className="text-sm md:text-base text-[#307fe2] font-light italic mb-12"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {subtitle}
              </p>
            </ScrollReveal>
          )}

          {/* Two column: sections + results circle */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-start md:items-center">
            {/* Left column - text sections */}
            <ScrollReveal animation="fadeUp" staggerChildren stagger={0.15} duration={0.8} className="flex-1 max-w-lg">
              <div>
                <Section heading="Problem" body={problem} />
                <Section heading="Spark" body={spark} />
                <Section heading="Growth Fuel" body={growthFuel} />
              </div>
            </ScrollReveal>

            {/* Right column - results circle */}
            {results && (
              <ScrollReveal animation="scaleIn" duration={1} delay={0.2}>
                <div className="flex-shrink-0 flex items-center justify-center relative">
                  {/* Hand holding the results circle from the left */}
                  <div
                    className="absolute hidden md:block"
                    style={{
                      left: '91%',
                      top: '58%',
                      width: '49%',
                      zIndex: 20,
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <Image src={hand2} alt="" className="w-full h-auto" unoptimized />
                  </div>
                  <div
                    className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full flex flex-col justify-center px-12 md:px-16 py-10 md:py-14 relative overflow-hidden"
                    style={{
                      backgroundColor: '#307fe2',
                      backgroundImage: `linear-gradient(rgba(48,127,226,0.35), rgba(48,127,226,0.35)), url(${blueNoiseBg.src})`,
                      backgroundSize: 'auto, 200%',
                      backgroundPosition: '0% 0%',
                      animation: 'blueNoiseShift 2s steps(10) infinite',
                    }}
                  >
                    <h3
                      className="text-xl md:text-2xl font-extrabold uppercase tracking-wider text-white mb-3 relative z-10"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      Results
                    </h3>
                    <p
                      className="text-sm md:text-base text-white font-medium leading-relaxed relative z-10"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {results}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
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
            backgroundRepeat: 'repeat',
            backgroundSize: '100% auto',
            backgroundPosition: 'center',
          }}
        >
          <div className="container">
            <div className="max-w-6xl mx-auto space-y-14 md:space-y-20">
              {contentBlocks.map((block, index) => {
                const isLeft = index % 2 === 0
                const media = block.media as Media
                const scribble = getScribbleForBlock(index)
                // Per design: image-left blocks → arrow top-right pointing at text; image-right blocks → arrow bottom-left pointing at text
                const arrowOnRight = isLeft
                const arrowDirection = arrowOnRight ? arrowLeft : arrowRight

                return (
                  <ScrollReveal
                    key={index}
                    animation="fadeUp"
                    duration={0.9}
                    delay={0.05}
                    className={`relative flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}
                  >
                    {/* Arrow positioned per design reference: top-right when text is right, bottom-left when text is left. Only on blocks 1 and 4. */}
                    {(block.caption || block.description) && (index === 0 || index === 3) && (
                      <Image
                        src={arrowDirection}
                        alt=""
                        className="absolute hidden md:block pointer-events-none z-20"
                        style={
                          arrowOnRight
                            ? { right: '2rem', top: '2rem', width: '80px', height: 'auto' }
                            : { left: '2rem', bottom: '2rem', width: '80px', height: 'auto' }
                        }
                      />
                    )}

                    {/* Media container with scribble background */}
                    <div className="relative flex-1">
                      {scribble && (
                        <Image
                          src={scribble}
                          alt=""
                          className="absolute pointer-events-none z-0"
                          style={
                            index === 0
                              ? {
                                  width: '170%',
                                  height: '170%',
                                  left: '55%',
                                  top: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  objectFit: 'contain',
                                }
                              : {
                                  width: '140%',
                                  height: '140%',
                                  left: '50%',
                                  top: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  objectFit: 'contain',
                                }
                          }
                        />
                      )}
                      <div className="relative z-10">
                        {media && typeof media !== 'number' && (
                          <div
                            className={`relative ${getAspectRatioClass(block.aspectRatio || '16:9')} w-full rounded-2xl md:rounded-3xl ${getMediaWidthClass(block.aspectRatio || '16:9')}`}
                            style={{
                              boxShadow: '0 44px 40px -64px rgba(0,0,0,0.1)',
                            }}
                          >
                            <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl">
                              <Image
                                src={media.url || ''}
                                alt={media.alt || ''}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Caption and description */}
                    {(block.caption || block.description) && (
                      <div className={`relative flex-1 flex flex-col ${!isLeft ? 'items-end text-right' : 'items-start text-left'}`}>
                        {block.caption && (
                          <p
                            className="text-lg md:text-2xl font-bold uppercase tracking-wide text-white leading-tight mb-4"
                            style={{ fontFamily: 'var(--font-inter)' }}
                          >
                            {block.caption}
                          </p>
                        )}
                        {block.description && (
                          <p
                            className="text-sm md:text-base text-white font-light leading-relaxed max-w-md"
                            style={{ fontFamily: 'var(--font-inter)' }}
                          >
                            {block.description}
                          </p>
                        )}
                      </div>
                    )}
                  </ScrollReveal>
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
