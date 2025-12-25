'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface BlogPostData {
  title: string
  slug: string
  excerpt: string
  content: string
  category_id: string
  publish_date: string
  read_time: number
  is_published: boolean
}

export async function createBlogPost(data: BlogPostData) {
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

  // Create blog post
  const { error } = await supabase.from('blog_posts').insert({
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    category_id: data.category_id,
    publish_date: data.publish_date,
    read_time: data.read_time,
    is_published: data.is_published,
  })

  if (error) {
    throw new Error(`Failed to create blog post: ${error.message}`)
  }

  revalidatePath('/add-content/blog')
  revalidatePath('/blog')
}

export async function updateBlogPost(id: string, data: BlogPostData) {
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

  // Update blog post
  const { error } = await supabase
    .from('blog_posts')
    .update({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      category_id: data.category_id,
      publish_date: data.publish_date,
      read_time: data.read_time,
      is_published: data.is_published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to update blog post: ${error.message}`)
  }

  revalidatePath('/add-content/blog')
  revalidatePath('/blog')
  revalidatePath(`/blog/${data.slug}`)
}

export async function deleteBlogPost(id: string) {
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

  // Delete blog post
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete blog post: ${error.message}`)
  }

  revalidatePath('/add-content/blog')
  revalidatePath('/blog')
}
