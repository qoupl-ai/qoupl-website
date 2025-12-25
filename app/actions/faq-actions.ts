'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface FAQData {
  question: string
  answer: string
  category_id: string
  order_index: number
  is_published: boolean
}

export async function createFAQ(data: FAQData) {
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

  // Create FAQ
  const { error } = await supabase.from('faqs').insert({
    question: data.question,
    answer: data.answer,
    category_id: data.category_id,
    order_index: data.order_index,
    is_published: data.is_published,
  })

  if (error) {
    throw new Error(`Failed to create FAQ: ${error.message}`)
  }

  revalidatePath('/add-content/faqs')
}

export async function updateFAQ(id: string, data: FAQData) {
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

  // Update FAQ
  const { error } = await supabase
    .from('faqs')
    .update({
      question: data.question,
      answer: data.answer,
      category_id: data.category_id,
      order_index: data.order_index,
      is_published: data.is_published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to update FAQ: ${error.message}`)
  }

  revalidatePath('/add-content/faqs')
}

export async function deleteFAQ(id: string) {
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

  // Delete FAQ
  const { error } = await supabase.from('faqs').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete FAQ: ${error.message}`)
  }

  revalidatePath('/add-content/faqs')
}
