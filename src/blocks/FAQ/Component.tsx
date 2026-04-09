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
    <div className="border-t border-white/30">
      <button
        className="w-full flex items-center py-6 md:py-8 text-left cursor-pointer group gap-6 md:gap-10"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span
          className="text-xl md:text-2xl font-extralight text-white/70 flex-shrink-0"
          style={{ fontFamily: 'var(--font-inter)', minWidth: '2.5rem' }}
        >
          {num}
        </span>
        <span
          className="text-xl md:text-3xl font-extralight text-white flex-1 pr-4 group-hover:opacity-80 transition-opacity"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {question}
        </span>
        <span
          className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/50 text-white transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="8" y1="1" x2="8" y2="15" />
            <line x1="1" y1="8" x2="15" y2="8" />
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
        <div className="pb-8 pl-[calc(2.5rem+1.5rem)] md:pl-[calc(2.5rem+2.5rem)] pr-16">
          <RichText
            data={answer}
            enableGutter={false}
            className="[&_p]:text-base [&_p]:md:text-lg [&_p]:text-white/80 [&_p]:font-light [&_p]:leading-relaxed [&_p]:mb-4"
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
    <div
      className="w-full py-16 md:py-24"
      style={{ backgroundColor: '#307fe2' }}
    >
      <div className="container">
        {heading && (
          <h2
            className="text-2xl md:text-4xl font-extralight text-white uppercase tracking-wider mb-8 md:mb-12"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {heading}
          </h2>
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
    </div>
  )
}
