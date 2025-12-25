'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface PricingPlanData {
  name: string
  price: number
  billing_period: string
  description: string
  features: string[]
  is_popular: boolean
  is_published: boolean
  order_index: number
}

export async function createPricingPlan(data: PricingPlanData) {
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

  // Create pricing plan
  const { error } = await supabase.from('pricing_plans').insert({
    name: data.name,
    price: data.price,
    billing_period: data.billing_period,
    description: data.description,
    features: data.features,
    is_popular: data.is_popular,
    is_published: data.is_published,
    order_index: data.order_index,
  })

  if (error) {
    throw new Error(`Failed to create pricing plan: ${error.message}`)
  }

  revalidatePath('/add-content/pricing')
}

export async function updatePricingPlan(id: string, data: PricingPlanData) {
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

  // Update pricing plan
  const { error } = await supabase
    .from('pricing_plans')
    .update({
      name: data.name,
      price: data.price,
      billing_period: data.billing_period,
      description: data.description,
      features: data.features,
      is_popular: data.is_popular,
      is_published: data.is_published,
      order_index: data.order_index,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to update pricing plan: ${error.message}`)
  }

  revalidatePath('/add-content/pricing')
}

export async function deletePricingPlan(id: string) {
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

  // Delete pricing plan
  const { error } = await supabase.from('pricing_plans').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete pricing plan: ${error.message}`)
  }

  revalidatePath('/add-content/pricing')
}
