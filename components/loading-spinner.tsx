'use client'

import { cn } from '@/lib/utils'
import { resolveLucideIcon } from '@/lib/utils/icons'
import { useGlobalContent } from '@/components/global-content-provider'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const { loadingUi } = useGlobalContent()

  if (!loadingUi) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Loading UI content is missing in CMS.')
    }
    return null
  }

  const LoadingIcon = resolveLucideIcon(loadingUi.icon)
  const label = text ?? loadingUi.text

  if (!LoadingIcon) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Loading UI icon is missing or invalid.')
    }
    return null
  }

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <LoadingIcon className={cn('animate-spin text-primary', sizeClasses[size])} />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size="lg" />
    </div>
  )
}
