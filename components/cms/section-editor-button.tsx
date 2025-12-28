'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import SectionEditor from '@/components/cms/section-editor'
import type { Section } from '@/types/section'

interface SectionEditorButtonProps {
  pageId: string
  section?: {
    id: string
    section_type: string
    order_index: number
    content: any
    published: boolean
  }
}

export default function SectionEditorButton({
  pageId,
  section,
}: SectionEditorButtonProps) {
  const [open, setOpen] = useState(false)

  // Convert the section prop to match the Section type expected by SectionEditor
  const sectionForEditor: Section | null = section ? {
    id: section.id,
    page_id: pageId, // Use pageId as page_id
    section_type: section.section_type,
    order_index: section.order_index,
    content: section.content || {}, // Preserve content as-is from database
    published: section.published,
    created_at: new Date().toISOString(), // Fallback values
    updated_at: new Date().toISOString(),
    created_by: null,
    updated_by: null,
  } : null

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="cms-card cms-border cms-text-secondary"
        style={{
          fontWeight: '600',
          fontSize: '13px'
        }}
      >
        {section ? (
          'Edit'
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </>
        )}
      </Button>
      <SectionEditor
        pageId={pageId}
        section={sectionForEditor}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

