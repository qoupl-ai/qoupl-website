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
import { productFeaturesSectionSchema } from '@/lib/validation/section-schemas'

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

const productFeaturesDataSchema = productFeaturesSectionSchema.shape.data

export type ProductFeaturesData = z.infer<typeof productFeaturesDataSchema>

// Default data for new product-features sections
export const defaultProductFeaturesData: ProductFeaturesData = productFeaturesDataSchema.parse({})

// Section contract
export const productFeaturesContract: SectionContract<ProductFeaturesData> = {
  type: 'product-features',
  schema: productFeaturesDataSchema,
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
