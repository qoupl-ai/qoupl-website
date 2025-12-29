import { createClient } from '@/lib/supabase/server'
import { getGlobalContentTyped } from '@/lib/supabase/content'
import type { BlogUiContentData } from '@/lib/validation/global-content-schemas'
import BlogClient from './blog-client'
import { Suspense } from 'react'
import { PageLoading } from '@/components/loading-spinner'

async function getBlogData() {
  const supabase = await createClient()

  // Fetch published blog posts with category information
  const { data: posts, error: postsError } = await supabase
    .from('blog_posts')
    .select(`
      id,
      title,
      excerpt,
      slug,
      publish_date,
      read_time,
      featured_image,
      category:blog_categories(id, name, slug)
    `)
    .eq('published', true)
    .order('publish_date', { ascending: false })

  if (postsError) {
    console.error('Error fetching blog posts:', postsError)
    return { posts: [], categories: [] }
  }

  // Fetch all categories
  const { data: categories, error: categoriesError } = await supabase
    .from('blog_categories')
    .select('id, name, slug')
    .order('name', { ascending: true })

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError)
    return { posts: posts || [], categories: [] }
  }

  // Transform posts to handle category relationship
  const transformedPosts = (posts || []).map(post => ({
    ...post,
    category: Array.isArray(post.category) ? post.category[0] : post.category,
  }))

  return {
    posts: transformedPosts,
    categories: categories || [],
  }
}

export default async function Blog() {
  const { posts, categories } = await getBlogData()
  const blogUi = await getGlobalContentTyped<BlogUiContentData>('blog_ui')

  if (!blogUi && process.env.NODE_ENV !== 'production') {
    throw new Error('Blog UI content is missing in CMS.')
  }

  return (
    <Suspense fallback={<PageLoading />}>
      <BlogClient posts={posts as any} categories={categories} ui={blogUi || {}} />
    </Suspense>
  )
}
