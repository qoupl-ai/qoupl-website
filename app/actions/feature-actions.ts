'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface FeatureData {
  title: string
  description: string
  icon: string
  category_id: string
  order_index: number
  is_published: boolean
}

export async function createFeature(data: FeatureData) {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify admin access
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!adminUser) {
    throw new Error('Unauthorized')
  }

  // Create feature
  const { error } = await supabase.from('features').insert({
    title: data.title,
    description: data.description,
    icon: data.icon,
    category_id: data.category_id,
    order_index: data.order_index,
    is_published: data.is_published,
  })

  if (error) {
    throw new Error(`Failed to create feature: ${error.message}`)
  }

  revalidatePath('/add-content/features')
}

export async function updateFeature(id: string, data: FeatureData) {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify admin access
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!adminUser) {
    throw new Error('Unauthorized')
  }

  // Update feature
  const { error } = await supabase
    .from('features')
    .update({
      title: data.title,
      description: data.description,
      icon: data.icon,
      category_id: data.category_id,
      order_index: data.order_index,
      is_published: data.is_published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to update feature: ${error.message}`)
  }

  revalidatePath('/add-content/features')
}

export async function deleteFeature(id: string) {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify admin access
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!adminUser) {
    throw new Error('Unauthorized')
  }

  // Delete feature
  const { error } = await supabase.from('features').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete feature: ${error.message}`)
  }

  revalidatePath('/add-content/features')
}
