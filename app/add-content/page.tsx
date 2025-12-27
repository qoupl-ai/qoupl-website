import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, MessageSquare, Sparkles, DollarSign, Image as ImageIcon, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function CMSDashboard() {
  const supabase = await createClient()

  // Get counts for all content types
  const [
    { count: blogCount },
    { count: faqCount },
    { count: featureCount },
    { count: pricingCount },
    { count: mediaCount },
    { count: waitlistCount },
  ] = await Promise.all([
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('faqs').select('*', { count: 'exact', head: true }),
    supabase.from('features').select('*', { count: 'exact', head: true }),
    supabase.from('pricing_plans').select('*', { count: 'exact', head: true }),
    supabase.from('media').select('*', { count: 'exact', head: true }),
    supabase.from('waitlist_signups').select('*', { count: 'exact', head: true }),
  ])

  // Get recent activity
  const { data: recentHistory } = await supabase
    .from('content_history')
    .select('*')
    .order('performed_at', { ascending: false })
    .limit(5)

  const stats = [
    {
      title: 'Blog Posts',
      count: blogCount || 0,
      icon: FileText,
      href: '/add-content/blog',
    },
    {
      title: 'FAQs',
      count: faqCount || 0,
      icon: MessageSquare,
      href: '/add-content/faqs',
    },
    {
      title: 'Features',
      count: featureCount || 0,
      icon: Sparkles,
      href: '/add-content/features',
    },
    {
      title: 'Pricing Plans',
      count: pricingCount || 0,
      icon: DollarSign,
      href: '/add-content/pricing',
    },
    {
      title: 'Media Files',
      count: mediaCount || 0,
      icon: ImageIcon,
      href: '/add-content/media',
    },
    {
      title: 'Waitlist Signups',
      count: waitlistCount || 0,
      icon: Users,
      href: '/add-content/waitlist',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 
          className="text-3xl font-semibold mb-2"
          style={{ color: '#ffffff' }}
        >
          CMS Dashboard
        </h1>
        <p 
          className="text-sm"
          style={{ color: '#898989' }}
        >
          Manage all your website content from one place
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card 
                className="transition-all cursor-pointer"
                style={{ 
                  backgroundColor: '#212121',
                  borderColor: '#2a2a2a',
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle 
                    className="text-sm font-medium"
                    style={{ color: '#898989' }}
                  >
                    {stat.title}
                  </CardTitle>
                  <Icon 
                    className="h-5 w-5" 
                    style={{ color: '#898989' }}
                  />
                </CardHeader>
                <CardContent>
                  <div 
                    className="text-2xl font-semibold"
                    style={{ color: '#ffffff' }}
                  >
                    {stat.count}
                  </div>
                  <p 
                    className="text-xs mt-1"
                    style={{ color: '#898989' }}
                  >
                    Total items
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card style={{ backgroundColor: '#212121', borderColor: '#2a2a2a' }}>
        <CardHeader>
          <CardTitle style={{ color: '#ffffff' }}>Recent Activity</CardTitle>
          <CardDescription style={{ color: '#898989' }}>
            Latest content updates and changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentHistory && recentHistory.length > 0 ? (
            <div className="space-y-4">
              {recentHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between pb-4 last:pb-0"
                  style={{ borderBottom: '1px solid #2a2a2a' }}
                >
                  <div>
                    <p 
                      className="font-medium text-sm"
                      style={{ color: '#ffffff' }}
                    >
                      {item.action.charAt(0).toUpperCase() + item.action.slice(1)}{' '}
                      <span style={{ color: '#898989' }}>
                        {item.entity_type}
                      </span>
                    </p>
                    <p 
                      className="text-xs mt-1"
                      style={{ color: '#898989' }}
                    >
                      {new Date(item.performed_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <Link href="/add-content/history">
                <Button 
                  variant="outline" 
                  className="w-full h-10"
                  style={{ 
                    backgroundColor: '#212121',
                    borderColor: '#2a2a2a',
                    color: '#898989',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  View All History
                </Button>
              </Link>
            </div>
          ) : (
            <p 
              className="text-sm"
              style={{ color: '#898989' }}
            >
              No recent activity to display
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card style={{ backgroundColor: '#212121', borderColor: '#2a2a2a' }}>
        <CardHeader>
          <CardTitle style={{ color: '#ffffff' }}>Quick Actions</CardTitle>
          <CardDescription style={{ color: '#898989' }}>
            Common tasks and operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/add-content/blog">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10"
                style={{ 
                  backgroundColor: '#212121',
                  borderColor: '#2a2a2a',
                  color: '#898989',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                Create Blog Post
              </Button>
            </Link>
            <Link href="/add-content/faqs">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10"
                style={{ 
                  backgroundColor: '#212121',
                  borderColor: '#2a2a2a',
                  color: '#898989',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </Link>
            <Link href="/add-content/features">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10"
                style={{ 
                  backgroundColor: '#212121',
                  borderColor: '#2a2a2a',
                  color: '#898989',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Add Feature
              </Button>
            </Link>
            <Link href="/add-content/media">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10"
                style={{ 
                  backgroundColor: '#212121',
                  borderColor: '#2a2a2a',
                  color: '#898989',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Media
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
