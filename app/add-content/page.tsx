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
      color: 'text-blue-600',
    },
    {
      title: 'FAQs',
      count: faqCount || 0,
      icon: MessageSquare,
      href: '/add-content/faqs',
      color: 'text-green-600',
    },
    {
      title: 'Features',
      count: featureCount || 0,
      icon: Sparkles,
      href: '/add-content/features',
      color: 'text-purple-600',
    },
    {
      title: 'Pricing Plans',
      count: pricingCount || 0,
      icon: DollarSign,
      href: '/add-content/pricing',
      color: 'text-yellow-600',
    },
    {
      title: 'Media Files',
      count: mediaCount || 0,
      icon: ImageIcon,
      href: '/add-content/media',
      color: 'text-pink-600',
    },
    {
      title: 'Waitlist Signups',
      count: waitlistCount || 0,
      icon: Users,
      href: '/add-content',
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">CMS Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage all your website content from one place
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.count}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total items
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest content updates and changes</CardDescription>
        </CardHeader>
        <CardContent>
          {recentHistory && recentHistory.length > 0 ? (
            <div className="space-y-4">
              {recentHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">
                      {item.action.charAt(0).toUpperCase() + item.action.slice(1)}{' '}
                      <span className="text-muted-foreground">
                        {item.entity_type}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.performed_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <Link href="/add-content/history">
                <Button variant="outline" className="w-full">
                  View All History
                </Button>
              </Link>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No recent activity to display
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/add-content/blog">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Create Blog Post
              </Button>
            </Link>
            <Link href="/add-content/faqs">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </Link>
            <Link href="/add-content/features">
              <Button variant="outline" className="w-full justify-start">
                <Sparkles className="mr-2 h-4 w-4" />
                Add Feature
              </Button>
            </Link>
            <Link href="/add-content/media">
              <Button variant="outline" className="w-full justify-start">
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
