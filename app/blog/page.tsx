import { createClient } from '@/lib/supabase/server'
import BlogClient from './blog-client'
import { Suspense } from 'react'

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

function BlogLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-[#662D91]/5 dark:bg-[#662D91]/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default async function Blog() {
  const { posts, categories } = await getBlogData()

  return (
    <Suspense fallback={<BlogLoading />}>
      <BlogClient posts={posts as any} categories={categories} />
    </Suspense>
  )
}
