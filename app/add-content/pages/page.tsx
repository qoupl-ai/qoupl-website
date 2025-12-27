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
import { FileText, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

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
          <h1 
            className="text-3xl font-semibold mb-2"
            style={{ color: '#ffffff' }}
          >
            Pages
          </h1>
          <p 
            className="text-sm"
            style={{ color: '#898989' }}
          >
            Manage all website pages and their sections
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pagesWithCounts.map((page) => (
            <Card 
              key={page.id} 
              className="transition-all"
              style={{ 
                backgroundColor: '#212121',
                borderColor: '#2a2a2a',
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle 
                      className="flex items-center gap-2 text-base"
                      style={{ color: '#ffffff' }}
                    >
                      {page.published ? (
                        <Eye className="h-4 w-4" style={{ color: '#898989' }} />
                      ) : (
                        <EyeOff className="h-4 w-4" style={{ color: '#898989' }} />
                      )}
                      {page.title}
                    </CardTitle>
                    <CardDescription 
                      className="mt-1 text-xs flex items-center gap-2"
                      style={{ color: '#898989' }}
                    >
                      <span>/{page.slug}</span>
                      <span>•</span>
                      <span>{page.sectionCount} {page.sectionCount === 1 ? 'section' : 'sections'}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {page.description && (
                  <p 
                    className="text-sm mb-4 line-clamp-2"
                    style={{ color: '#898989' }}
                  >
                    {page.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Link href={`/add-content/pages/${page.slug}`} className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full h-9" 
                      style={{ 
                        backgroundColor: '#212121',
                        borderColor: '#2a2a2a',
                        color: '#898989',
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
                      className="h-9 px-3"
                      style={{ 
                        color: '#898989',
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
