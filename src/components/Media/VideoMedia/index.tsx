'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    // Use resource.url directly (matches ImageMedia). When the Vercel Blob
    // adapter is active, `url` is the canonical https://*.public.blob.vercel-
    // storage.com/<filename> path. The previous `/media/${filename}` construction
    // was a holdover from the disk-storage era and produced 404s in production
    // because the file no longer lives under the site origin.
    const { url, filename, updatedAt } = resource
    const src = getMediaUrl(url || (filename ? `/media/${filename}` : null), updatedAt)
    if (!src) return null

    return (
      <video
        autoPlay
        className={cn(videoClassName)}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={src} />
      </video>
    )
  }

  return null
}
