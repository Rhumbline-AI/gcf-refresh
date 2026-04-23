import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import LogoImage from '@/images/GCF-logo.png'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priorityValue = priorityFromProps === 'high'

  return (
    <Image
      src={LogoImage}
      alt="GCF"
      loading={loading}
      priority={priorityValue}
      sizes="(max-width: 768px) 100px, 200px"
      className={clsx('w-auto h-auto', className)}
      style={{ height: 'clamp(40px, 6vw, 80px)', width: 'auto' }}
    />
  )
}
