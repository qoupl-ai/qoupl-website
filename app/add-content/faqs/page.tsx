import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { FAQList } from '@/components/cms/faq-list'
import { FAQDialog } from '@/components/cms/faq-dialog'

export default async function FAQsPage() {
  const supabase = await createClient()

  // Fetch all FAQs with category information
  const { data: faqs } = await supabase
    .from('faqs')
    .select(`
      *,
      category:faq_categories(id, name, slug)
    `)
    .order('category_id', { ascending: true })
    .order('order_index', { ascending: true })

  // Fetch all categories for the dropdown
  const { data: categories } = await supabase
    .from('faq_categories')
    .select('*')
    .order('order_index', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">FAQs</h1>
          <p className="text-muted-foreground mt-2">
            Manage frequently asked questions across all categories
          </p>
        </div>
        <FAQDialog categories={categories || []} mode="create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
        </FAQDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All FAQs ({faqs?.length || 0})</CardTitle>
          <CardDescription>
            Edit, reorder, or delete existing FAQs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FAQList faqs={faqs || []} categories={categories || []} />
        </CardContent>
      </Card>
    </div>
  )
}
