/**
 * Global Content Editor
 * 
 * Edit global content items (navbar, footer, etc.)
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { updateGlobalContent } from '@/app/actions/global-content-actions'

interface GlobalContentEditorProps {
  contentKey: string
  existingContent?: {
    id: string
    key: string
    content: any
    updated_at: string
  }
  children: React.ReactNode
}

export default function GlobalContentEditor({
  contentKey,
  existingContent,
  children,
}: GlobalContentEditorProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [contentJson, setContentJson] = useState(
    existingContent
      ? JSON.stringify(existingContent.content, null, 2)
      : '{}'
  )

  const handleSave = async () => {
    setLoading(true)

    try {
      // Parse JSON to validate
      const content = JSON.parse(contentJson)

      // Update global content via server action
      await updateGlobalContent(contentKey, content)

      toast.success(`${contentKey} updated successfully`)
      setOpen(false)
      router.refresh()
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error('Invalid JSON format')
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to save')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {contentKey}</DialogTitle>
            <DialogDescription>
              Edit the content as JSON. Changes will be reflected on the website.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content (JSON)</Label>
              <Textarea
                id="content"
                value={contentJson}
                onChange={(e) => setContentJson(e.target.value)}
                rows={20}
                className="font-mono text-sm"
                placeholder='{"key": "value"}'
              />
              <p className="text-sm text-muted-foreground">
                Enter valid JSON. Use double quotes for strings.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

