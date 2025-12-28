/**
 * Unified Pages Management
 * 
 * Generic page management interface.
 * Replaces page-specific CMS pages.
 */

import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Eye, EyeOff, Info } from 'lucide-react'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default async function PagesPage() {
  await assertAdmin()
  const supabase = await createClient()

  // Define logical page order (most important pages first)
  const pageOrder = [
    'home',
    'about',
    'features',
    'pricing',
    'faq',
    'blog',
    'careers',
    'contact',
    'safety',
    'privacy',
    'terms',
    'community-guidelines'
  ]

  const { data: pages, error } = await supabase
    .from('pages')
    .select('*')
  
  // Sort pages by predefined order, then alphabetically for any not in the list
  const sortedPages = (pages || []).sort((a, b) => {
    const aIndex = pageOrder.indexOf(a.slug)
    const bIndex = pageOrder.indexOf(b.slug)
    
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return a.slug.localeCompare(b.slug)
  })

  if (error) {
    throw new Error(`Failed to fetch pages: ${error.message}`)
  }

  // Fetch section counts for each page
  const pagesWithCounts = await Promise.all(
    sortedPages.map(async (page) => {
      const { count } = await supabase
        .from('sections')
        .select('*', { count: 'exact', head: true })
        .eq('page_id', page.id)
      
      return {
        ...page,
        sectionCount: count || 0
      }
    })
  )

  return (
    <div>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2 cms-text-primary">
            Pages
          </h1>
          <p className="text-sm cms-text-secondary mb-4">
            Manage predefined website pages and their sections.
          </p>
          <Alert className="cms-card cms-border border-blue-400/50 bg-blue-50/50 dark:bg-blue-950/20">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="cms-text-primary" style={{ fontSize: '14px', fontWeight: '600' }}>
              Predefined Pages
            </AlertTitle>
            <AlertDescription className="cms-text-secondary" style={{ fontSize: '13px' }}>
              All pages are predefined and cannot be created or deleted. You can edit page content, reorder sections, and manage publish status.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pagesWithCounts.map((page) => (
            <Card 
              key={page.id} 
              className="transition-all cms-card cms-border border"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-base cms-text-primary">
                      {page.published ? (
                        <Eye className="h-4 w-4 cms-text-secondary" />
                      ) : (
                        <EyeOff className="h-4 w-4 cms-text-secondary" />
                      )}
                      {page.title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs flex items-center gap-2 cms-text-secondary">
                      <span>/{page.slug}</span>
                      <span>•</span>
                      <span>{page.sectionCount} {page.sectionCount === 1 ? 'section' : 'sections'}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {page.description && (
                  <p className="text-sm mb-4 line-clamp-2 cms-text-secondary">
                    {page.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Link href={`/add-content/pages/${page.slug}`} className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full h-9 cms-card cms-border cms-text-secondary"
                      style={{ 
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      <FileText className="mr-2 h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={page.slug === 'home' ? '/' : `/${page.slug}`} target="_blank">
                    <Button 
                      variant="ghost" 
                      className="h-9 px-3 cms-text-secondary"
                      style={{ 
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
    </div>
  )
}
