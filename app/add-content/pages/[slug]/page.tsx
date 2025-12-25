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
  const { slug } = await params
  const supabase = await createClient()

  // Get page
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (pageError || !page) {
    notFound()
  }

  // Get sections for this page
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
        <div className="flex items-center gap-4 mb-8">
          <Link href="/add-content/pages">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{page.title}</h1>
            <p className="text-muted-foreground mt-1">
              /{page.slug} • {sections?.length || 0} sections
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {sections?.map((section) => (
            <Card key={section.id} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      {section.component_type}
                    </CardTitle>
                    <CardDescription className="mt-1">
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
                <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-32">
                  {JSON.stringify(section.content, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}

          {(!sections || sections.length === 0) && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
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

