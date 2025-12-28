/**
 * Media Types
 * 
 * Type definitions for media library entities.
 * Mirrors the database schema exactly.
 */

import { z } from 'zod'

// ISO 8601 datetime regex pattern (matches: YYYY-MM-DDTHH:mm:ss.sssZ or variations)
const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/

// UUID v4 regex pattern (matches: 8-4-4-4-12 hexadecimal characters)
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Helper for datetime string validation (replaces deprecated .datetime())
const datetimeString = () => z.string().regex(isoDateTimeRegex, 'Invalid ISO 8601 datetime format')

// Helper for UUID string validation (replaces deprecated .uuid())
const uuidString = () => z.string().regex(uuidRegex, 'Invalid UUID format')
import type { Media as DatabaseMedia } from '@/lib/supabase/database.types'

// ============================================================================
// Database Types (re-exported for convenience)
// ============================================================================

export type Media = DatabaseMedia

// ============================================================================
// Zod Schemas (mirroring DB exactly)
// ============================================================================

export const mediaSchema = z.object({
  id: uuidString(),
  filename: z.string().min(1),
  storage_path: z.string().min(1),
  bucket_name: z.string().min(1),
  file_type: z.string().nullable(),
  file_size: z.number().int().positive().nullable(),
  alt_text: z.string().nullable(),
  category: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  uploaded_at: datetimeString(),
  uploaded_by: uuidString().nullable(),
})

export const mediaInsertSchema = mediaSchema.omit({
  id: true,
  uploaded_at: true,
}).extend({
  id: uuidString().optional(),
  uploaded_at: datetimeString().optional(),
})

export const mediaUpdateSchema = mediaSchema.partial().extend({
  id: uuidString(),
})

// ============================================================================
// Type Inference from Schemas
// ============================================================================

export type MediaInput = z.infer<typeof mediaInsertSchema>
export type MediaUpdate = z.infer<typeof mediaUpdateSchema>

// ============================================================================
// Helper Types
// ============================================================================

export type MediaCategory = 
  | 'hero'
  | 'blog'
  | 'gallery'
  | 'screenshot'
  | 'testimonial'
  | 'feature'
  | 'icon'
  | 'logo'
  | null

export interface MediaMetadata {
  width?: number
  height?: number
  format?: string
  [key: string]: unknown
}

