/**
 * App Download Section Contract
 */

import React from 'react'
import { z } from 'zod'
import dynamic from 'next/dynamic'
import type { SectionContract } from './types'
import { appDownloadSectionSchema } from '@/lib/validation/section-schemas'

// Lazy-load renderer component with proper type wrapper
const AppDownloadComponent = dynamic(() => import('@/components/sections/app-download'), {
  ssr: true,
})

// Wrap the component to match the expected contract interface
const AppDownloadRenderer: React.ComponentType<{ 
  data: z.infer<typeof appDownloadSectionSchema>['data'] 
}> = ({ data }) => {
  return <AppDownloadComponent data={data} />
}

// Placeholder editor
const AppDownloadEditor: React.ComponentType<{
  value: z.infer<typeof appDownloadSectionSchema>['data']
  onChange: (data: z.infer<typeof appDownloadSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">App Download Editor (Placeholder)</p>
    </div>
  )
}

const appDownloadDataSchema = appDownloadSectionSchema.shape.data

const defaultData: z.infer<typeof appDownloadDataSchema> = {
  title: undefined,
  subtitle: undefined,
  badge: undefined,
  benefits: undefined,
  cta: undefined,
  platforms: undefined,
  stats: undefined,
  images: undefined,
}

export const appDownloadContract: SectionContract<z.infer<typeof appDownloadDataSchema>> = {
  type: 'app-download',
  schema: appDownloadDataSchema,
  defaultData,
  editor: AppDownloadEditor,
  renderer: AppDownloadRenderer,
  metadata: {
    label: 'App Download',
    description: 'App download section with platform links',
    icon: 'download',
    category: 'cta',
  },
}

