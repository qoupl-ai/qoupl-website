/**
 * Global Content Editor
 * 
 * Edit navbar, footer, social links, contact info, and site config.
 */

import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import GlobalContentEditor from '@/components/cms/global-content-editor'

export default async function GlobalContentPage() {
  await assertAdmin()
  const supabase = await createClient()

  // Fetch all global content
  const { data: globalContent, error } = await supabase
    .from('global_content')
    .select('*')
    .order('key', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch global content: ${error.message}`)
  }

  // Organize content by key
  const contentMap = new Map(globalContent?.map(item => [item.key, item]) || [])

  const contentItems = [
    {
      key: 'navbar',
      title: 'Navigation Bar',
      description: 'Edit navigation links and logo',
      icon: '🔗',
    },
    {
      key: 'footer',
      title: 'Footer',
      description: 'Edit footer links, description, and copyright',
      icon: '📄',
    },
    {
      key: 'social_links',
      title: 'Social Links',
      description: 'Edit social media links (LinkedIn, Instagram)',
      icon: '📱',
    },
    {
      key: 'contact_info',
      title: 'Contact Information',
      description: 'Edit contact email, phone, and address',
      icon: '📧',
    },
    {
      key: 'site_config',
      title: 'Site Configuration',
      description: 'Edit site-wide settings (tagline, waitlist count)',
      icon: '⚙️',
    },
  ]

  return (
    <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Global Content</h1>
          <p className="text-muted-foreground mt-2">
            Edit site-wide content that appears on all pages
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contentItems.map((item) => {
            const content = contentMap.get(item.key)
            return (
              <Card key={item.key} className="hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {content ? (
                      <p className="text-sm text-muted-foreground">
                        Last updated: {new Date(content.updated_at).toLocaleDateString()}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Not configured yet
                      </p>
                    )}
                    <GlobalContentEditor
                      key={item.key}
                      contentKey={item.key}
                      existingContent={content}
                    >
                      <Button variant="outline" className="w-full" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        {content ? 'Edit' : 'Create'}
                      </Button>
                    </GlobalContentEditor>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
    </div>
  )
}

