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
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground mt-2">
            Manage blog content and articles
          </p>
        </div>
        <BlogDialog categories={categories || []} mode="create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </BlogDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts ({posts?.length || 0})</CardTitle>
          <CardDescription>
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
