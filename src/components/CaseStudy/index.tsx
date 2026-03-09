import React from 'react'
import type { Project } from '@/payload-types'

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

export const CaseStudy: React.FC<CaseStudyProps> = ({ project }) => {
  const { clientName, campaignTitle, subtitle, problem, spark, growthFuel, results } = project

  return (
    <div>
      <div className="pt-10 pb-8 md:pt-14 md:pb-10" style={{ backgroundColor: '#f5f0eb' }}>
        <div className="container">
          {/* Client name with underline extending beyond text */}
          {clientName && (
            <div className="mb-8">
              <p
                className="text-sm md:text-base text-[#307fe2] font-medium pb-2"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {clientName}
              </p>
              <div className="w-64 h-[1px] bg-[#307fe2]" />
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
    </div>
  )
}
