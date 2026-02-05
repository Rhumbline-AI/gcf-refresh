import React from 'react'
import type { Methodology as MethodologyProps } from '@/payload-types'

export const MethodologyBlock: React.FC<MethodologyProps> = ({ title, subtitle, items }) => {
  return (
    <div className="py-24 overflow-hidden relative">
      <div className="container relative z-10 flex flex-col items-center justify-center text-center">
        {/* The Blue Circle */}
        <div className="bg-blue-600 text-white rounded-full w-[800px] h-[800px] flex flex-col items-center justify-center p-20 shadow-2xl relative">
            {/* Texture overlay (optional) */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none rounded-full"></div>
            
            <h2 className="text-3xl md:text-5xl font-light mb-4">{title}</h2>
            <p className="text-xl md:text-2xl font-bold mb-12">{subtitle}</p>

            <div className="grid gap-8 w-full max-w-2xl text-left">
              {items?.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="bg-white text-blue-600 px-3 py-1 rounded-full font-bold text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                  <p className="text-lg leading-relaxed border-b border-blue-400 pb-4">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  )
}
