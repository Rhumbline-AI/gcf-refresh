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
      alt="Growth Fuel"
      width={80}
      height={80}
      loading={loading}
      priority={priorityValue}
      className={clsx('w-auto h-[50px] md:h-[80px]', className)}
    />
  )
}
