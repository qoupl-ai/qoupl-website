/**
 * Gallery Section Contract
 */

import React from 'react'
import { z } from 'zod'
import dynamic from 'next/dynamic'
import type { SectionContract } from './types'
import { gallerySectionSchema } from '@/lib/validation/section-schemas'

// Lazy-load renderer component with proper type wrapper
const GalleryComponent = dynamic(() => import('@/components/sections/gallery'), {
  ssr: true,
})

// Wrap the component to match the expected contract interface
const GalleryRenderer: React.ComponentType<{ 
  data: z.infer<typeof gallerySectionSchema>['data'] 
}> = ({ data }) => {
  return <GalleryComponent data={data} />
}

// Placeholder editor
const GalleryEditor: React.ComponentType<{
  value: z.infer<typeof gallerySectionSchema>['data']
  onChange: (data: z.infer<typeof gallerySectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Gallery Editor (Placeholder)</p>
    </div>
  )
}

const galleryDataSchema = gallerySectionSchema.shape.data

const defaultData: z.infer<typeof galleryDataSchema> = {
  title: undefined,
  subtitle: undefined,
  badge: undefined,
  images: [],
  cta: undefined,
}

export const galleryContract: SectionContract<z.infer<typeof galleryDataSchema>> = {
  type: 'gallery',
  schema: galleryDataSchema,
  defaultData,
  editor: GalleryEditor,
  renderer: GalleryRenderer,
  metadata: {
    label: 'Gallery',
    description: 'Image gallery section with carousel',
    icon: 'image',
    category: 'media',
  },
}

