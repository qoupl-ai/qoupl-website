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
        <h1 
          className="text-2xl font-semibold mb-1.5"
          style={{ color: '#ffffff', fontWeight: '600', fontSize: '20px', lineHeight: '1.3' }}
        >
          Content History
        </h1>
        <p 
          className="text-sm"
          style={{ color: '#898989', fontSize: '13px', lineHeight: '1.5' }}
        >
          View all content changes and updates ({history?.length || 0} entries)
        </p>
      </div>

      <Card style={{ backgroundColor: '#212121', borderColor: '#2a2a2a' }}>
        <CardHeader>
          <CardTitle style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px', lineHeight: '1.4' }}>
            Recent Activity
          </CardTitle>
          <CardDescription style={{ color: '#898989', fontSize: '13px', lineHeight: '1.5' }}>
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
