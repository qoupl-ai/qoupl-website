import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { BlogList } from '@/components/cms/blog-list'
import { BlogDialog } from '@/components/cms/blog-dialog'

export default async function BlogPage() {
  const supabase = await createClient()

  // Fetch all blog posts with category information
  const { data: posts } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(id, name, slug)
    `)
    .order('publish_date', { ascending: false })

  // Fetch all categories for the dropdown
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-2xl font-semibold mb-1.5"
            style={{ color: '#ffffff', fontWeight: '600', fontSize: '20px', lineHeight: '1.3' }}
          >
            Blog Posts
          </h1>
          <p 
            className="text-sm"
            style={{ color: '#898989', fontSize: '13px', lineHeight: '1.5' }}
          >
            Manage blog content and articles
          </p>
        </div>
        <BlogDialog categories={categories || []} mode="create">
          <Button
            className="h-10 px-5"
            style={{ 
              backgroundColor: '#212121',
              borderColor: '#2a2a2a',
              color: '#898989',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </BlogDialog>
      </div>

      <Card style={{ backgroundColor: '#212121', borderColor: '#2a2a2a' }}>
        <CardHeader>
          <CardTitle style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px', lineHeight: '1.4' }}>
            All Posts ({posts?.length || 0})
          </CardTitle>
          <CardDescription style={{ color: '#898989', fontSize: '13px', lineHeight: '1.5' }}>
            Edit, publish, or delete blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlogList posts={posts || []} categories={categories || []} />
        </CardContent>
      </Card>
    </div>
  )
}
