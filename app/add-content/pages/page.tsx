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
import { Plus, FileText, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import PageEditorButton from './page-editor-button'

export default async function PagesPage() {
  await assertAdmin()
  const supabase = await createClient()

  const { data: pages, error } = await supabase
    .from('pages')
    .select('*')
    .order('slug', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch pages: ${error.message}`)
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
          <div>
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
              Manage all website pages
            </p>
          </div>
          <PageEditorButton />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages?.map((page) => (
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
                      className="mt-1 text-xs"
                      style={{ color: '#898989' }}
                    >
                      /{page.slug}
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
                  <Link href={`/${page.slug}`} target="_blank">
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
