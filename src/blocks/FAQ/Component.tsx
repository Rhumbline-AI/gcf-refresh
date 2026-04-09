'use client'

import React, { useState } from 'react'
import RichText from '@/components/RichText'
import type { FAQBlock as FAQBlockProps } from '@/payload-types'

function FAQItem({ question, answer, isOpen, onToggle, index }: {
  question: string
  answer: FAQBlockProps['items'][0]['answer']
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <div className="border-t border-white/20">
      <div className="container">
        <button
          className="w-full flex items-center py-8 md:py-10 text-left cursor-pointer group gap-8 md:gap-14"
          onClick={onToggle}
          aria-expanded={isOpen}
        >
          <span
            className="text-2xl md:text-4xl font-extralight text-white/60 flex-shrink-0"
            style={{ fontFamily: 'var(--font-inter)', minWidth: '3.5rem' }}
          >
            {num}
          </span>
          <span
            className="text-2xl md:text-4xl font-extralight text-white flex-1 pr-4 group-hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {question}
          </span>
          <span
            className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full border border-white/40 text-white transition-transform duration-300"
            style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="9" y1="1" x2="9" y2="17" />
              <line x1="1" y1="9" x2="17" y2="9" />
            </svg>
          </span>
        </button>
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isOpen ? '2000px' : '0',
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div className="pb-10 pl-[calc(3.5rem+2rem)] md:pl-[calc(3.5rem+3.5rem)] pr-20">
            <RichText
              data={answer}
              enableGutter={false}
              className="[&_p]:text-base [&_p]:md:text-lg [&_p]:text-white/80 [&_p]:font-light [&_p]:leading-relaxed [&_p]:mb-4"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const FAQBlock: React.FC<FAQBlockProps> = ({ heading, items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!items || items.length === 0) return null

  return (
    <div
      className="w-full py-10 md:py-16"
      style={{ backgroundColor: '#307fe2' }}
    >
      {heading && (
        <div className="container">
          <h2
            className="text-3xl md:text-5xl font-extralight text-[#343434] uppercase tracking-tight mb-6 md:mb-10"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {heading}
          </h2>
        </div>
      )}
      <div>
        {items.map((item, index) => (
          <FAQItem
            key={index}
            index={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  )
}
