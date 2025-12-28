import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, MessageSquare, Sparkles, DollarSign, Image as ImageIcon, Users, Home, Navigation, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
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

  // Get publishing status - count published vs draft sections
  const { data: allSections } = await supabase
    .from('sections')
    .select('published')
  
  const publishedSections = (allSections || []).filter(s => s.published === true).length
  const draftSections = (allSections || []).filter(s => s.published === false).length
  const totalSections = (allSections || []).length

  // Get published vs draft pages
  const { data: allPages } = await supabase
    .from('pages')
    .select('published')
  
  const publishedPages = (allPages || []).filter(p => p.published === true).length
  const draftPages = (allPages || []).filter(p => p.published === false).length
  const totalPages = (allPages || []).length

  // Get recent activity with entity details
  const { data: recentHistory } = await supabase
    .from('content_history')
    .select('*')
    .order('performed_at', { ascending: false })
    .limit(5)

  // Fetch entity details for each history entry
  const historyWithDetails = await Promise.all(
    (recentHistory || []).map(async (item) => {
      let entityDetails: Record<string, unknown> | null = null
      
      try {
        if (item.entity_type === 'sections') {
          const { data: section } = await supabase
            .from('sections')
            .select(`
              id,
              section_type,
              content,
              page_id,
              pages!inner(slug, title)
            `)
            .eq('id', item.entity_id)
            .single()
          
          if (section) {
            const pagesData = Array.isArray(section.pages) ? section.pages[0] : (section.pages as any)
            const pageTitle = pagesData?.title
            const pageSlug = pagesData?.slug
            const sectionTitle = section.content?.title || 
                                section.content?.name || 
                                section.content?.heading ||
                                section.section_type
            
            entityDetails = {
              type: 'section',
              title: sectionTitle,
              componentType: section.section_type,
              pageTitle: pageTitle,
              pageSlug: pageSlug,
              content: section.content,
            }
          }
        } else if (item.entity_type === 'pages') {
          const { data: page } = await supabase
            .from('pages')
            .select('id, slug, title')
            .eq('id', item.entity_id)
            .single()
          
          if (page) {
            entityDetails = {
              type: 'page',
              title: page.title,
              slug: page.slug,
            }
          }
        } else if (item.entity_type === 'blog_posts') {
          const { data: post } = await supabase
            .from('blog_posts')
            .select('id, title, slug')
            .eq('id', item.entity_id)
            .single()
          
          if (post) {
            entityDetails = {
              type: 'blog_post',
              title: post.title,
              slug: post.slug,
            }
          }
        } else if (item.entity_type === 'faqs') {
          const { data: faq } = await supabase
            .from('faqs')
            .select('id, question')
            .eq('id', item.entity_id)
            .single()
          
          if (faq) {
            entityDetails = {
              type: 'faq',
              title: faq.question,
            }
          }
        } else if (item.entity_type === 'features') {
          const { data: feature } = await supabase
            .from('features')
            .select('id, title')
            .eq('id', item.entity_id)
            .single()
          
          if (feature) {
            entityDetails = {
              type: 'feature',
              title: feature.title,
            }
          }
        } else if (item.entity_type === 'pricing_plans') {
          const { data: plan } = await supabase
            .from('pricing_plans')
            .select('id, name')
            .eq('id', item.entity_id)
            .single()
          
          if (plan) {
            entityDetails = {
              type: 'pricing_plan',
              title: plan.name,
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching details for ${item.entity_type}:`, error)
      }
      
      return {
        ...item,
        entityDetails,
      }
    })
  )

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
        <h1 className="text-3xl font-semibold mb-2 cms-text-primary">
          CMS Dashboard
        </h1>
        <p className="text-sm cms-text-secondary">
          Manage all your website content from one place
        </p>
      </div>

      {/* Quick Actions - Large Task-Oriented Buttons */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/add-content/pages/home">
          <Card className="transition-all cursor-pointer hover:opacity-80 cms-card cms-border border h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[140px]">
              <Home className="h-5 w-5 mb-4 cms-text-secondary" style={{ strokeWidth: 1.5 }} />
              <h3 className="font-semibold text-base mb-1 cms-text-primary">Edit Homepage</h3>
              <p className="text-xs cms-text-secondary">Manage homepage sections and content</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/add-content/global">
          <Card className="transition-all cursor-pointer hover:opacity-80 cms-card cms-border border h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[140px]">
              <Navigation className="h-5 w-5 mb-4 cms-text-secondary" style={{ strokeWidth: 1.5 }} />
              <h3 className="font-semibold text-base mb-1 cms-text-primary">Edit Navigation & Footer</h3>
              <p className="text-xs cms-text-secondary">Update site-wide navigation and footer</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/add-content/blog">
          <Card className="transition-all cursor-pointer hover:opacity-80 cms-card cms-border border h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[140px]">
              <FileText className="h-5 w-5 mb-4 cms-text-secondary" style={{ strokeWidth: 1.5 }} />
              <h3 className="font-semibold text-base mb-1 cms-text-primary">Manage Blogs</h3>
              <p className="text-xs cms-text-secondary">Create and edit blog posts</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/add-content/faqs">
          <Card className="transition-all cursor-pointer hover:opacity-80 cms-card cms-border border h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[140px]">
              <MessageSquare className="h-5 w-5 mb-4 cms-text-secondary" style={{ strokeWidth: 1.5 }} />
              <h3 className="font-semibold text-base mb-1 cms-text-primary">Manage FAQs</h3>
              <p className="text-xs cms-text-secondary">Add and organize frequently asked questions</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Publishing Status Indicator */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pages Status Card */}
        <Card className="cms-card cms-border border">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 cms-text-secondary" style={{ strokeWidth: 1.5 }} />
                <span className="text-sm font-semibold cms-text-primary">Pages</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold cms-text-primary">{totalPages}</div>
                <div className="text-xs cms-text-secondary">total</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#10b981' }} />
                <span className="text-xs cms-text-secondary">Published</span>
              </div>
              <span className="text-sm font-semibold cms-text-primary">{publishedPages}</span>
              {draftPages > 0 && (
                <>
                  <span className="text-xs cms-text-tertiary">•</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                    <span className="text-xs cms-text-secondary">Draft</span>
                  </div>
                  <span className="text-sm font-semibold cms-text-primary">{draftPages}</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sections Status Card */}
        <Card className="cms-card cms-border border">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 cms-text-secondary" style={{ strokeWidth: 1.5 }} />
                <span className="text-sm font-semibold cms-text-primary">Sections</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold cms-text-primary">{totalSections}</div>
                <div className="text-xs cms-text-secondary">total</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#10b981' }} />
                <span className="text-xs cms-text-secondary">Published</span>
              </div>
              <span className="text-sm font-semibold cms-text-primary">{publishedSections}</span>
              {draftSections > 0 && (
                <>
                  <span className="text-xs cms-text-tertiary">•</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                    <span className="text-xs cms-text-secondary">Draft</span>
                  </div>
                  <span className="text-sm font-semibold cms-text-primary">{draftSections}</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="transition-all cursor-pointer cms-card cms-border border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium cms-text-secondary">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 cms-text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold cms-text-primary">
                    {stat.count}
                  </div>
                  <p className="text-xs mt-1 cms-text-secondary">
                    Total items
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent Changes */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-semibold cms-text-primary mb-1">Recent Changes</h2>
          <p className="text-xs cms-text-secondary">Latest content updates and changes</p>
        </div>
        
        {historyWithDetails && historyWithDetails.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-px cms-border" />
            
            <div className="space-y-0">
              {historyWithDetails.map((item) => {
                const getActionIcon = (action: string) => {
                  switch (action) {
                    case 'created': return Plus
                    case 'updated': return Edit
                    case 'deleted': return Trash2
                    case 'published': return Eye
                    case 'unpublished': return EyeOff
                    default: return Edit
                  }
                }

                const getActionColor = (action: string) => {
                  switch (action) {
                    case 'created': return '#10b981'
                    case 'updated': return '#14b8a6'
                    case 'deleted': return '#ef4444'
                    case 'published': return '#10b981'
                    case 'unpublished': return '#f59e0b'
                    default: return '#898989'
                  }
                }

                const getEntityTypeLabel = (entityType: string) => {
                  const labels: Record<string, string> = {
                    'sections': 'Section',
                    'pages': 'Page',
                    'blog_posts': 'Blog',
                    'faqs': 'FAQ',
                    'features': 'Feature',
                    'pricing_plans': 'Pricing',
                  }
                  return labels[entityType] || entityType
                }

                const ActionIcon = getActionIcon(item.action)
                const actionColor = getActionColor(item.action)

                return (
                  <div key={item.id} className="relative flex gap-4 pb-5 last:pb-0">
                    {/* Timeline dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <ActionIcon 
                        className="h-4 w-4" 
                        style={{ color: actionColor }}
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex-1 min-w-0">
                          {item.entityDetails ? (
                            <>
                              {item.entityDetails.type === 'section' && (
                                <div>
                                  <p className="font-medium text-sm cms-text-primary truncate">
                                    {item.entityDetails.title || item.entityDetails.componentType}
                                  </p>
                                  <p className="text-xs cms-text-secondary mt-0.5">
                                    <span className="font-medium">{getEntityTypeLabel(item.entity_type)}</span>
                                    {' • '}
                                    <span>{item.entityDetails.pageTitle || item.entityDetails.pageSlug}</span>
                                  </p>
                                </div>
                              )}
                              {item.entityDetails.type === 'page' && (
                                <div>
                                  <p className="font-medium text-sm cms-text-primary truncate">
                                    {item.entityDetails.title}
                                  </p>
                                  <p className="text-xs cms-text-secondary mt-0.5">
                                    <span className="font-medium">{getEntityTypeLabel(item.entity_type)}</span>
                                    {' • '}
                                    <span>{item.entityDetails.slug}</span>
                                  </p>
                                </div>
                              )}
                              {(item.entityDetails.type === 'blog_post' || 
                                item.entityDetails.type === 'faq' || 
                                item.entityDetails.type === 'feature' || 
                                item.entityDetails.type === 'pricing_plan') && (
                                <div>
                                  <p className="font-medium text-sm cms-text-primary truncate">
                                    {item.entityDetails.title}
                                  </p>
                                  <p className="text-xs cms-text-secondary mt-0.5">
                                    <span className="font-medium">{getEntityTypeLabel(item.entity_type)}</span>
                                  </p>
                                </div>
                              )}
                            </>
                          ) : (
                            <div>
                              <p className="font-medium text-sm cms-text-primary truncate">
                                {getEntityTypeLabel(item.entity_type)}
                              </p>
                              <p className="text-xs cms-text-secondary mt-0.5">
                                ID: {item.entity_id.slice(0, 8)}...
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-shrink-0 text-right">
                          <span
                            className="inline-block text-xs font-medium px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: actionColor + '15',
                              color: actionColor,
                            }}
                          >
                            {item.action.charAt(0).toUpperCase() + item.action.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs cms-text-tertiary">
                        {new Date(item.performed_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <Link href="/add-content/history" className="mt-4 block">
              <Button 
                variant="outline" 
                className="w-full h-10 cms-card cms-border cms-text-secondary"
              >
                View All History
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-12 cms-card cms-border border rounded-lg">
            <p className="text-sm cms-text-secondary">No recent activity to display</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="cms-card cms-border border">
        <CardHeader>
          <CardTitle className="cms-text-primary">Quick Actions</CardTitle>
          <CardDescription className="cms-text-secondary">
            Common tasks and operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/add-content/blog">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10 cms-card cms-border cms-text-secondary"
              >
                <FileText className="mr-2 h-4 w-4" />
                Create Blog Post
              </Button>
            </Link>
            <Link href="/add-content/faqs">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10 cms-card cms-border cms-text-secondary"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </Link>
            <Link href="/add-content/features">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10 cms-card cms-border cms-text-secondary"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Add Feature
              </Button>
            </Link>
            <Link href="/add-content/media">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10 cms-card cms-border cms-text-secondary"
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
