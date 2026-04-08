'use client'

import React, { useState } from 'react'
import RichText from '@/components/RichText'
import type { FAQBlock as FAQBlockProps } from '@/payload-types'

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string
  answer: FAQBlockProps['items'][0]['answer']
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex items-center justify-between py-5 md:py-6 text-left cursor-pointer group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span
          className="text-lg md:text-xl font-medium text-[#343434] pr-8 group-hover:text-[#307fe2] transition-colors"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {question}
        </span>
        <span
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#307fe2] text-[#307fe2] transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="7" y1="1" x2="7" y2="13" />
            <line x1="1" y1="7" x2="13" y2="7" />
          </svg>
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? '1000px' : '0',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="pb-6 pr-12">
          <RichText
            data={answer}
            enableGutter={false}
            className="[&_p]:text-base [&_p]:md:text-lg [&_p]:text-[#666] [&_p]:font-light [&_p]:leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}

export const FAQBlock: React.FC<FAQBlockProps> = ({ heading, items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!items || items.length === 0) return null

  return (
    <div className="container py-16 md:py-24">
      {heading && (
        <h2
          className="text-3xl md:text-5xl font-light text-center text-[#343434] mb-12 md:mb-16"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {heading}
        </h2>
      )}
      <div className="max-w-3xl mx-auto">
        {items.map((item, index) => (
          <FAQItem
            key={index}
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
