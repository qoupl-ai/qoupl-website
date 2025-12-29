/**
 * Product Features Section Contract
 * 
 * Defines the schema, default data, and components for product-features sections.
 * Used on homepage to showcase key product features.
 */

import React from 'react'
import { z } from 'zod'
import dynamic from 'next/dynamic'
import type { SectionContract } from './types'

// Dynamic import for renderer (client component) with proper type wrapper
const ProductFeaturesComponent = dynamic(
  () => import('@/components/sections/product-features'),
  { ssr: true }
)

// Wrap the component to match the expected contract interface
const ProductFeaturesRenderer: React.ComponentType<{ 
  data: ProductFeaturesData 
}> = ({ data }) => {
  return <ProductFeaturesComponent data={data} />
}

// Placeholder editor component (will be replaced with full editor later)
const ProductFeaturesEditor: React.ComponentType<{
  value: ProductFeaturesData
  onChange: (data: ProductFeaturesData) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Product Features Editor (Placeholder)</p>
    </div>
  )
}

// Zod schema for product-features section content
export const productFeaturesSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  features: z.array(
    z.object({
      icon: z.string().optional(),
      title: z.string().min(1, 'Feature title is required'),
      description: z.string().min(1, 'Feature description is required'),
      highlights: z.array(z.string()).optional(),
      image: z.string().optional(),
      color: z.string().optional(),
    })
  ).min(1, 'At least one feature is required'),
})

export type ProductFeaturesData = z.infer<typeof productFeaturesSchema>

// Default data for new product-features sections
export const defaultProductFeaturesData: ProductFeaturesData = {
  title: 'Why Choose qoupl',
  subtitle: 'Advanced features designed to help you find meaningful connections',
  features: [
    {
      icon: 'Heart',
      title: 'Smart AI Matching',
      description: 'Our advanced AI algorithm analyzes compatibility factors including personality, interests, values, and lifestyle to suggest highly compatible matches tailored just for you.',
      highlights: [
        'Deep compatibility analysis',
        'Personalized suggestions',
        'Values-based matching',
        'Learning preferences',
      ],
      image: 'couple-photos/qoupl_couple_01.jpg',
      color: 'bg-[#662D91]',
    },
    {
      icon: 'Shield',
      title: 'Safe & Verified',
      description: 'Multi-layered verification system with mandatory college ID verification, 24/7 AI moderation, photo verification, and encrypted messaging to keep college students safe while finding love.',
      highlights: [
        'College ID verification',
        'Photo verification',
        '24/7 AI moderation',
        'Encrypted messaging',
      ],
      image: 'couple-photos/qoupl_couple_02.jpg',
      color: 'bg-[#662D91]',
    },
    {
      icon: 'Zap',
      title: 'Instant Connections',
      description: 'Connect with compatible matches instantly through our real-time matching system. Start meaningful conversations with smart conversation starters.',
      highlights: [
        'Real-time matching',
        'Smart conversation starters',
        'Meaningful connections',
        'Instant notifications',
      ],
      image: 'couple-photos/qoupl_couple_04.jpg',
      color: 'bg-[#662D91]',
    },
  ],
}

// Section contract
export const productFeaturesContract: SectionContract<ProductFeaturesData> = {
  type: 'product-features',
  schema: productFeaturesSchema,
  defaultData: defaultProductFeaturesData,
  renderer: ProductFeaturesRenderer,
  editor: ProductFeaturesEditor,
  metadata: {
    label: 'Product Features',
    description: 'Showcase key product features with icons, images, and highlights',
    category: 'content',
    icon: 'Zap',
  },
}

