/**
 * Unified Section Actions
 * 
 * Generic CRUD operations for sections table.
 * Replaces blog-actions, faq-actions, feature-actions, pricing-actions.
 * 
 * All sections use the same table structure:
 * - id, page_id, type, order_index, data (JSONB), published
 */

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'
import { validateSectionData } from '@/lib/validation/section-schemas'

export interface SectionData {
  page_id: string
  type: string
  order_index: number
  data: Record<string, unknown>
  published: boolean
}

export interface CreateSectionInput extends SectionData {}

export interface UpdateSectionInput {
  id?: string
  type?: string
  order_index?: number
  content?: Record<string, unknown>
  published?: boolean
}

/**
 * Create a new section
 */
export async function createSection(input: CreateSectionInput) {
  // Assert admin access
  await assertAdmin()

  // Validate section data
  const validation = validateSectionData(input.type, input.data)
  if (!validation.success) {
    throw new Error(`Validation failed: ${validation.error}`)
  }

  const supabase = await createClient()

  const { error } = await supabase.from('sections').insert({
    page_id: input.page_id,
    section_type: input.type,
    order_index: input.order_index,
    content: input.data,
    published: input.published,
  })

  if (error) {
    throw new Error(`Failed to create section: ${error.message}`)
  }

  // Revalidate relevant paths
  revalidatePath('/add-content')
  revalidatePath(`/add-content/pages/${input.page_id}`)
  
  // Get page slug to revalidate frontend page
  const { data: page } = await supabase
    .from('pages')
    .select('slug')
    .eq('id', input.page_id)
    .single()
  
  if (page?.slug) {
    // Revalidate frontend page (homepage uses '/', others use '/slug')
    const frontendPath = page.slug === 'home' ? '/' : `/${page.slug}`
    revalidatePath(frontendPath)
  }
}

/**
 * Update an existing section
 */
export async function updateSection(input: UpdateSectionInput) {
  // Assert admin access
  await assertAdmin()

  if (!input.id) {
    throw new Error('Section ID is required for update')
  }

  // Validate section data if type or content is being updated
  if (input.type && input.content) {
    const validation = validateSectionData(input.type, input.content)
    if (!validation.success) {
      throw new Error(`Validation failed: ${validation.error}`)
    }
  }

  const supabase = await createClient()

  const updateData: {
    updated_at: string
    section_type?: string
    order_index?: number
    content?: Record<string, unknown>
    published?: boolean
  } = {
    updated_at: new Date().toISOString(),
  }

  if (input.type !== undefined) updateData.section_type = input.type
  if (input.order_index !== undefined) updateData.order_index = input.order_index
  if (input.content !== undefined) updateData.content = input.content
  if (input.published !== undefined) updateData.published = input.published

  const { error, data } = await supabase
    .from('sections')
    .update(updateData)
    .eq('id', input.id)
    .select('page_id')
    .single()

  if (error) {
    throw new Error(`Failed to update section: ${error.message}`)
  }

  // Revalidate relevant paths
  revalidatePath('/add-content')
  if (data?.page_id) {
    // Revalidate CMS page
    revalidatePath(`/add-content/pages/${data.page_id}`)
    
    // Get page slug to revalidate frontend page
    const { data: page } = await supabase
      .from('pages')
      .select('slug')
      .eq('id', data.page_id)
      .single()
    
    if (page?.slug) {
      // Revalidate frontend page (homepage uses '/', others use '/slug')
      const frontendPath = page.slug === 'home' ? '/' : `/${page.slug}`
      revalidatePath(frontendPath)
    }
  }
}

/**
 * Delete a section
 */
export async function deleteSection(id: string) {
  // Assert admin access
  await assertAdmin()

  const supabase = await createClient()

  // Get page_id before deletion for revalidation
  const { data: section } = await supabase
    .from('sections')
    .select('page_id')
    .eq('id', id)
    .single()

  const { error } = await supabase.from('sections').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete section: ${error.message}`)
  }

  // Revalidate relevant paths
  revalidatePath('/add-content')
  if (section?.page_id) {
    revalidatePath(`/add-content/pages/${section.page_id}`)
    
    // Get page slug to revalidate frontend page
    const { data: page } = await supabase
      .from('pages')
      .select('slug')
      .eq('id', section.page_id)
      .single()
    
    if (page?.slug) {
      // Revalidate frontend page (homepage uses '/', others use '/slug')
      const frontendPath = page.slug === 'home' ? '/' : `/${page.slug}`
      revalidatePath(frontendPath)
    }
  }
}

/**
 * Reorder sections for a page
 */
export async function reorderSections(pageId: string, sectionIds: string[]) {
  // Assert admin access
  await assertAdmin()

  const supabase = await createClient()

  // Update order_index for each section
  const updates = sectionIds.map((id, index) =>
    supabase
      .from('sections')
      .update({ order_index: index })
      .eq('id', id)
      .eq('page_id', pageId)
  )

  await Promise.all(updates)

  revalidatePath('/add-content')
  revalidatePath(`/add-content/pages/${pageId}`)
  
  // Get page slug to revalidate frontend page
  const { data: page } = await supabase
    .from('pages')
    .select('slug')
    .eq('id', pageId)
    .single()
  
  if (page?.slug) {
    // Revalidate frontend page (homepage uses '/', others use '/slug')
    const frontendPath = page.slug === 'home' ? '/' : `/${page.slug}`
    revalidatePath(frontendPath)
  }
}

/**
 * Get content history for a section (for rollback)
 */
export async function getSectionHistory(sectionId: string) {
  await assertAdmin()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('content_history')
    .select('*')
    .eq('entity_type', 'sections')
    .eq('entity_id', sectionId)
    .order('performed_at', { ascending: false })
    .limit(20)

  if (error) {
    throw new Error(`Failed to fetch history: ${error.message}`)
  }

  return data || []
}

/**
 * Rollback section to a previous version from history
 */
export async function rollbackSection(sectionId: string, historyId: string) {
  await assertAdmin()

  const supabase = await createClient()

  // Get the history snapshot
  const { data: history, error: historyError } = await supabase
    .from('content_history')
    .select('snapshot')
    .eq('id', historyId)
    .eq('entity_type', 'sections')
    .eq('entity_id', sectionId)
    .single()

  if (historyError || !history) {
    throw new Error('History record not found')
  }

  const snapshot = history.snapshot as any

  if (!snapshot || !snapshot.content) {
    throw new Error('Invalid snapshot data')
  }

  // Restore section from snapshot
  const { error: updateError } = await supabase
    .from('sections')
    .update({
      content: snapshot.content,
      section_type: snapshot.section_type,
      order_index: snapshot.order_index,
      published: snapshot.published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sectionId)

  if (updateError) {
    throw new Error(`Failed to rollback section: ${updateError.message}`)
  }

  // Get page_id for revalidation
  const { data: section } = await supabase
    .from('sections')
    .select('page_id')
    .eq('id', sectionId)
    .single()

  // Revalidate relevant paths
  revalidatePath('/add-content')
  if (section?.page_id) {
    revalidatePath(`/add-content/pages/${section.page_id}`)
    
    const { data: page } = await supabase
      .from('pages')
      .select('slug')
      .eq('id', section.page_id)
      .single()
    
    if (page?.slug) {
      const frontendPath = page.slug === 'home' ? '/' : `/${page.slug}`
      revalidatePath(frontendPath)
    }
  }
}
