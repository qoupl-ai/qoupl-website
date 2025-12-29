/**
 * Global Content Editor
 * 
 * Visual editor for global content items (navbar, footer, etc.)
 */

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { toast } from 'sonner'
import { updateGlobalContent } from '@/app/actions/global-content-actions'
import { getGlobalContentSchema } from '@/lib/validation/global-content-schemas'
import { SchemaWalker } from '@/components/cms/section-editor/schema-walker'

interface Page {
  slug: string
  title: string
}

interface GlobalContentEditorProps {
  contentKey: string
  existingContent?: {
    id: string
    key: string
    content: unknown
    updated_at: string
  }
  pages?: Page[]
  children: React.ReactNode
}

type FormValues = {
  data: Record<string, unknown>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value)

const normalizeLogo = (value: Record<string, unknown> | undefined) => {
  if (!value) return value
  const logo = { ...value }
  if (!logo.image && typeof logo.src === 'string') {
    logo.image = logo.src
  }
  return logo
}

const normalizeContent = (key: string, content: unknown): Record<string, unknown> => {
  if (!isRecord(content)) return {}

  if (key === 'social_links') {
    const record = { ...content }
    const legacyLinkedIn = record.linkedin
    const legacyInstagram = record.instagram
    if (typeof legacyLinkedIn === 'string' || typeof legacyInstagram === 'string') {
      const links: Array<Record<string, unknown>> = []
      if (typeof legacyLinkedIn === 'string') {
        links.push({ icon: 'Linkedin', url: legacyLinkedIn, label: 'LinkedIn', show: true })
      }
      if (typeof legacyInstagram === 'string') {
        links.push({ icon: 'Instagram', url: legacyInstagram, label: 'Instagram', show: true })
      }
      return { links }
    }
    return record
  }

  const normalized = { ...content }

  if (key === 'navbar') {
    if (isRecord(normalized.logo)) {
      normalized.logo = normalizeLogo(normalized.logo)
    }
  }

  if (key === 'footer') {
    if (isRecord(normalized.brand)) {
      const brand = { ...normalized.brand }
      if (isRecord(brand.logo)) {
        brand.logo = normalizeLogo(brand.logo)
      }
      normalized.brand = brand
    }
    if (isRecord(normalized.copyright)) {
      const copyright = { ...normalized.copyright }
      if (!copyright.primary_prefix && typeof copyright.text === 'string') {
        copyright.primary_prefix = copyright.text
      }
      normalized.copyright = copyright
    }
  }

  if (key === 'waitlist_modal' || key === 'splash_screen') {
    if (isRecord(normalized.logo)) {
      normalized.logo = normalizeLogo(normalized.logo)
    }
  }

  return normalized
}

const mergeDeep = (base: unknown, override: unknown): unknown => {
  if (override === undefined) return base
  if (Array.isArray(base) && Array.isArray(override)) return override
  if (isRecord(base) && isRecord(override)) {
    const result: Record<string, unknown> = { ...base }
    Object.keys(override).forEach((key) => {
      result[key] = mergeDeep(base[key], override[key])
    })
    return result
  }
  return override
}

function getContentTitle(key: string): string {
  const titles: Record<string, string> = {
    navbar: 'Navigation Bar',
    footer: 'Footer',
    social_links: 'Social Links',
    theme_toggle: 'Theme Toggle',
    waitlist_modal: 'Waitlist Modal',
    splash_screen: 'Splash Screen',
    legal_ui: 'Legal UI',
    error_ui: 'Error UI',
    loading_ui: 'Loading UI',
    faq_ui: 'FAQ UI',
    blog_ui: 'Blog UI',
    contact_info: 'Contact Information',
    site_config: 'Site Configuration',
  }
  return titles[key] || key
}

export default function GlobalContentEditor({
  contentKey,
  existingContent,
  pages = [],
  children,
}: GlobalContentEditorProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const contentSchema = useMemo(() => getGlobalContentSchema(contentKey), [contentKey])
  const formSchema = useMemo(() => {
    return z.object({
      data: contentSchema ?? z.record(z.unknown()),
    })
  }, [contentSchema])

  const defaultData = useMemo(() => {
    if (!contentSchema) return {}
    const parsed = contentSchema.safeParse({})
    if (parsed.success && parsed.data && typeof parsed.data === 'object') {
      return parsed.data as Record<string, unknown>
    }
    return {}
  }, [contentSchema])

  const buildFormData = () => {
    const normalized = normalizeContent(contentKey, existingContent?.content)
    const merged = mergeDeep(defaultData, normalized) as Record<string, unknown>
    return { data: merged }
  }

  const resolver = zodResolver(formSchema as z.ZodSchema) as Resolver<FormValues>

  const form = useForm<FormValues>({
    resolver,
    defaultValues: buildFormData(),
  })

  useEffect(() => {
    if (!open) return
    form.reset(buildFormData(), {
      keepDefaultValues: false,
      keepValues: false,
      keepDirty: false,
    })
  }, [open, contentKey, existingContent?.id ?? '', form, defaultData])

  const handleSave = async (values: FormValues) => {
    setLoading(true)
    try {
      await updateGlobalContent(contentKey, values.data)
      toast.success(`${getContentTitle(contentKey)} updated successfully`)
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto cms-card cms-border"
          style={{
            fontFamily: "'Google Sans Flex', system-ui, sans-serif",
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="cms-text-primary"
              style={{
                fontWeight: '600',
                fontSize: '18px',
                lineHeight: '1.4',
              }}
            >
              Edit {getContentTitle(contentKey)}
            </DialogTitle>
            <DialogDescription
              className="cms-text-secondary"
              style={{
                fontSize: '13px',
                lineHeight: '1.5',
              }}
            >
              Make changes to the content. Changes will be reflected on the website.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              {contentSchema ? (
                <SchemaWalker
                  control={form.control}
                  schema={contentSchema}
                  basePath="data"
                  bucket="brand-assets"
                  pages={pages}
                />
              ) : (
                <div className="p-4 rounded-md border cms-card-bg cms-border">
                  <p className="text-sm cms-text-secondary">
                    No schema registered for this content type.
                  </p>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="h-10 px-5 cms-card cms-border cms-text-secondary"
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-10 px-5"
                  style={{
                    backgroundColor: loading ? 'rgba(102, 45, 145, 0.5)' : '#662D91',
                    borderColor: loading ? 'rgba(102, 45, 145, 0.5)' : '#662D91',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
