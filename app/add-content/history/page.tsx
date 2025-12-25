import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HistoryList } from '@/components/cms/history-list'

export default async function HistoryPage() {
  const supabase = await createClient()

  // Fetch content history
  const { data: history } = await supabase
    .from('content_history')
    .select(`
      *,
      admin:admin_users(name, email)
    `)
    .order('performed_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content History</h1>
        <p className="text-muted-foreground mt-2">
          View all content changes and updates ({history?.length || 0} entries)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Last 100 content modifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HistoryList history={history || []} />
        </CardContent>
      </Card>
    </div>
  )
}
