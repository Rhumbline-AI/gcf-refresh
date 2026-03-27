'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import type { Page } from '@/payload-types'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { Media as MediaType } from '@/payload-types'
import { getClientSideURL } from '@/utilities/getURL'
import contactButtonBg from '@/images/contact-button-bg.png'

type ContactHeroProps = Page['hero']

export const ContactHero: React.FC<ContactHeroProps> = ({ richText, media, form: formRelation }) => {
  const router = useRouter()
  const form = formRelation as FormType | undefined
  const mediaData = media as MediaType | undefined

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // iOS Safari zooms in on input focus and doesn't zoom back out on keyboard dismiss.
  // Reset the viewport scale on every input blur to undo the iOS zoom.
  useEffect(() => {
    const resetZoom = () => {
      const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]')
      if (!viewport) return
      // Briefly set maximum-scale=1 to snap back, then restore normal
      viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1'
      setTimeout(() => {
        viewport.content = 'width=device-width, initial-scale=1'
      }, 100)
    }
    const fields = document.querySelectorAll<HTMLElement>('input, textarea, select')
    fields.forEach(f => f.addEventListener('blur', resetZoom))
    return () => fields.forEach(f => f.removeEventListener('blur', resetZoom))
  }, [])

  const onSubmit = useCallback(
    (data: Record<string, unknown>) => {
      if (!form) return

      const submitForm = async () => {
        setError(null)
        setIsLoading(true)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: form.id,
              submissionData: dataToSend,
            }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })

          const res = await req.json()

          if (req.status >= 400) {
            setError(res.errors?.[0]?.message || 'Something went wrong.')
            setIsLoading(false)
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (form.confirmationType === 'redirect' && form.redirect?.url) {
            router.push(form.redirect.url)
          }
        } catch {
          setIsLoading(false)
          setError('Something went wrong.')
        }
      }

      void submitForm()
    },
    [form, router],
  )

  return (
    <div className="relative w-full flex items-start overflow-hidden" style={{ minHeight: 'calc(72vh + 6rem)', marginBottom: '-6rem' }}>
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <source src="/videos/rocket-control-web.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50" style={{ zIndex: 1 }} />

      {/* Fallback background image (behind video) */}
      {mediaData && (
        <div className="absolute inset-0" style={{ zIndex: -1 }}>
          <Media
            resource={mediaData}
            fill
            imgClassName="object-cover grayscale"
          />
        </div>
      )}

      {/* Content */}
      <div className="container relative z-10 pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="max-w-xl">
          {/* Title & subtitle */}
          {richText && (
            <RichText
              className="mb-8 md:mb-10 [&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:lg:text-6xl [&_h1]:font-extralight [&_h1]:text-white [&_h1]:mb-4 [&_h1]:leading-tight [&_p]:text-base [&_p]:md:text-lg [&_p]:text-white/90 [&_p]:font-light [&_p]:leading-relaxed"
              data={richText}
              enableGutter={false}
            />
          )}

          {/* Form */}
          {form && !hasSubmitted && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
              {form.fields?.map((field, index) => {
                if (field.blockType === 'text' || field.blockType === 'email') {
                  return (
                    <input
                      key={index}
                      type={field.blockType === 'email' ? 'email' : 'text'}
                      placeholder={field.label || ''}
                      className="w-full rounded-full px-6 py-3 md:py-4 font-medium outline-none border-none transition-colors duration-200 bg-[#307fe2] text-white placeholder:text-white focus:bg-white focus:text-[#307fe2] focus:placeholder:text-[#307fe2]/50"
                      style={{ fontFamily: 'var(--font-inter)', fontSize: '16px' }}
                      {...register(field.name, { required: field.required })}
                    />
                  )
                }

                if (field.blockType === 'textarea') {
                  return (
                    <textarea
                      key={index}
                      placeholder={field.label || ''}
                      rows={4}
                      className="w-full rounded-2xl px-6 py-3 md:py-4 font-medium outline-none border-none resize-none transition-colors duration-200 bg-[#307fe2] text-white placeholder:text-white focus:bg-white focus:text-[#307fe2] focus:placeholder:text-[#307fe2]/50"
                      style={{ fontFamily: 'var(--font-inter)', fontSize: '16px' }}
                      {...register(field.name, { required: field.required })}
                    />
                  )
                }

                if ((field.blockType as string) === 'number') {
                  const f = field as unknown as { label?: string; name: string; required?: boolean }
                  return (
                    <input
                      key={index}
                      type="tel"
                      placeholder={f.label || ''}
                      className="w-full rounded-full px-6 py-3 md:py-4 font-medium outline-none border-none transition-colors duration-200 bg-[#307fe2] text-white placeholder:text-white focus:bg-white focus:text-[#307fe2] focus:placeholder:text-[#307fe2]/50"
                      style={{ fontFamily: 'var(--font-inter)', fontSize: '16px' }}
                      {...register(f.name, { required: f.required })}
                    />
                  )
                }

                return null
              })}

              {error && (
                <p className="text-red-300 text-sm">{error}</p>
              )}

              <div className="relative inline-block pt-2 ml-4">
                <Image
                  src={contactButtonBg}
                  alt=""
                  className="absolute top-1/2 left-1/2 -translate-x-[46%] -translate-y-[40%] scale-[1.3] pointer-events-none"
                  aria-hidden
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative inline-flex items-center gap-2 text-sm md:text-base font-bold text-white uppercase tracking-wider px-6 py-3"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  <span>{isLoading ? 'Sending...' : (form.submitButtonLabel || 'Submit')}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* Success message */}
          {hasSubmitted && form?.confirmationType === 'message' && form.confirmationMessage && (
            <RichText
              className="[&_p]:text-white [&_p]:text-lg"
              data={form.confirmationMessage}
            />
          )}
          {hasSubmitted && !form?.confirmationMessage && (
            <p className="text-white text-lg font-light">Thank you! We&apos;ll be in touch.</p>
          )}
        </div>
      </div>
    </div>
  )
}
