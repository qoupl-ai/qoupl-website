'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { resolveLucideIcon } from '@/lib/utils/icons'
import { useGlobalContent } from '@/components/global-content-provider'
import type { ErrorUiContentData } from '@/lib/validation/global-content-schemas'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>
}

interface ErrorBoundaryInnerProps extends ErrorBoundaryProps {
  errorUi: ErrorUiContentData
}

class ErrorBoundaryInner extends React.Component<ErrorBoundaryInnerProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  override render() {
    if (this.state.hasError) {
      const { errorUi } = this.props
      const MainIcon = resolveLucideIcon(errorUi.icon)
      const RetryIcon = resolveLucideIcon(errorUi.retry_icon)
      const HomeIcon = resolveLucideIcon(errorUi.home_icon)

      if (this.props.fallback) {
        const Fallback = this.props.fallback
        return <Fallback error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              {MainIcon && <MainIcon className="h-8 w-8 text-destructive" />}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">{errorUi.title}</h2>
              <p className="text-muted-foreground mb-4">
                {process.env.NODE_ENV === 'production'
                  ? errorUi.description
                  : this.state.error?.message || errorUi.description}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={this.resetError} variant="default">
                {RetryIcon && <RetryIcon className="mr-2 h-4 w-4" />}
                {errorUi.retry_label}
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="outline">
                {HomeIcon && <HomeIcon className="mr-2 h-4 w-4" />}
                {errorUi.home_label}
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  {errorUi.details_label}
                </summary>
                <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  const { errorUi } = useGlobalContent()

  if (!errorUi) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Error UI content is missing in CMS.')
    }
    return null
  }

  return <ErrorBoundaryInner {...props} errorUi={errorUi} />
}
