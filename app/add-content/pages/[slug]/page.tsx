/**
 * Page Editor - Sections Management
 * 
 * Edit a specific page and its sections.
 */

import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft, GripVertical } from 'lucide-react'
import Link from 'next/link'
import SectionEditor from '@/components/cms/section-editor'
import SectionEditorButton from './section-editor-button'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PageEditorPage({ params }: PageProps) {
  await assertAdmin()
  const supabase = await createClient()
  const { slug } = await params

  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (pageError || !page) {
    notFound()
  }

  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('*')
    .eq('page_id', page.id)
    .order('order_index', { ascending: true })

  if (sectionsError) {
    throw new Error(`Failed to fetch sections: ${sectionsError.message}`)
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/add-content/pages">
              <Button 
                variant="ghost" 
                size="sm"
                style={{ color: '#898989' }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 
                className="text-3xl font-semibold mb-2"
                style={{ color: '#ffffff' }}
              >
                {page.title}
              </h1>
              <p 
                className="text-sm"
                style={{ color: '#898989' }}
              >
                /{page.slug}
              </p>
            </div>
          </div>
          <SectionEditorButton pageId={page.id} />
        </div>

        <div className="space-y-4">
          {sections?.map((section) => (
            <Card 
              key={section.id} 
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
                      <GripVertical className="h-4 w-4" style={{ color: '#898989' }} />
                      {section.component_type}
                    </CardTitle>
                    <CardDescription 
                      className="mt-1 text-xs"
                      style={{ color: '#898989' }}
                    >
                      Order: {section.order_index} •{' '}
                      {section.published ? 'Published' : 'Draft'}
                    </CardDescription>
                  </div>
                  <SectionEditorButton
                    pageId={page.id}
                    section={section}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <pre 
                  className="text-xs p-4 rounded overflow-auto max-h-32"
                  style={{ 
                    backgroundColor: '#171717',
                    color: '#898989',
                    border: '1px solid #2a2a2a'
                  }}
                >
                  {JSON.stringify(section.content, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}

          {(!sections || sections.length === 0) && (
            <Card style={{ backgroundColor: '#212121', borderColor: '#2a2a2a' }}>
              <CardContent className="py-12 text-center">
                <p 
                  className="mb-4 text-sm"
                  style={{ color: '#898989' }}
                >
                  No sections yet. Create your first section.
                </p>
                <SectionEditorButton pageId={page.id} />
              </CardContent>
            </Card>
          )}
        </div>
    </div>
  )
}
