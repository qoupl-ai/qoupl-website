/**
 * Message Bundles Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { messageBundlesSectionSchema } from '@/lib/validation/section-schemas'

// Placeholder renderer
const MessageBundlesRenderer: React.ComponentType<{ data: z.infer<typeof messageBundlesSectionSchema>['data'] }> = () => {
  return <div>Message Bundles Section (Renderer to be implemented)</div>
}

// Placeholder editor
const MessageBundlesEditor: React.ComponentType<{
  value: z.infer<typeof messageBundlesSectionSchema>['data']
  onChange: (data: z.infer<typeof messageBundlesSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Message Bundles Editor (Placeholder)</p>
    </div>
  )
}

const messageBundlesDataSchema = messageBundlesSectionSchema.shape.data

const defaultData: z.infer<typeof messageBundlesDataSchema> = {
  price_per_message: 10,
  gst_rate: 18,
  bundles: [],
  min_messages: 5,
  max_messages: 100,
  title: undefined,
  subtitle: undefined,
}

export const messageBundlesContract: SectionContract<z.infer<typeof messageBundlesDataSchema>> = {
  type: 'message-bundles',
  schema: messageBundlesDataSchema,
  defaultData,
  editor: MessageBundlesEditor,
  renderer: MessageBundlesRenderer,
  metadata: {
    label: 'Message Bundles',
    description: 'Section displaying message bundle pricing options',
    icon: 'package',
    category: 'commerce',
  },
}

