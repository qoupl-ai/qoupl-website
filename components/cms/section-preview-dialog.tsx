'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { SectionRenderer } from '@/lib/components/registry'
import type { Section } from '@/types/section'

interface SectionPreviewDialogProps {
  section: Section
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SectionPreviewDialog({
  section,
  open,
  onOpenChange,
}: SectionPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[95vh] p-0 flex flex-col"
        style={{
          fontFamily: "'Google Sans Flex', system-ui, sans-serif",
        }}
      >
        {/* Fixed Header */}
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="cms-text-primary" style={{ fontWeight: '600', fontSize: '18px' }}>
            Preview Section
          </DialogTitle>
          <DialogDescription className="cms-text-secondary" style={{ fontSize: '13px' }}>
            {section.published ? 'Published version' : 'Draft preview - not visible to visitors'}
          </DialogDescription>
        </DialogHeader>
        
        {/* Scrollable Content Area - only scrolls if content exceeds viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            {!section.published && (
              <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Draft Mode:</strong> This section is not published and will not be visible on the website.
                </p>
              </div>
            )}
            
            {/* Preview Container - matches website rendering */}
            <div className="w-full">
              <SectionRenderer section={section} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface SectionPreviewButtonProps {
  section: Section
}

export function SectionPreviewButton({ section }: SectionPreviewButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="cms-card cms-border cms-text-secondary"
        style={{
          fontWeight: '500',
          fontSize: '13px'
        }}
      >
        <Eye className="mr-2 h-4 w-4" />
        Preview
      </Button>
      <SectionPreviewDialog
        section={section}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

