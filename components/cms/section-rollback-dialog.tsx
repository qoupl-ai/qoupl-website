'use client'

import { useState, useEffect, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
// ScrollArea not available, using div with overflow
import { History, RotateCcw, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getSectionHistory, rollbackSection } from '@/app/actions/section-actions'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

interface ContentHistory {
  id: string
  entity_type: string
  entity_id: string
  action: string
  snapshot: any
  performed_by: string | null
  performed_at: string
}

interface SectionRollbackDialogProps {
  sectionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SectionRollbackDialog({
  sectionId,
  open,
  onOpenChange,
}: SectionRollbackDialogProps) {
  const [history, setHistory] = useState<ContentHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [rollingBack, setRollingBack] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    if (open && sectionId) {
      setLoading(true)
      getSectionHistory(sectionId)
        .then((data) => {
          setHistory(data as ContentHistory[])
        })
        .catch((error) => {
          toast.error('Failed to load history', {
            description: error.message,
          })
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [open, sectionId])

  const handleRollback = async (historyId: string) => {
    if (!confirm('Are you sure you want to restore this version? This will overwrite the current content.')) {
      return
    }

    setRollingBack(historyId)
    try {
      await rollbackSection(sectionId, historyId)
      toast.success('Section restored successfully')
      onOpenChange(false)
      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      toast.error('Failed to restore section', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    } finally {
      setRollingBack(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] cms-card cms-border"
        style={{
          fontFamily: "'Google Sans Flex', system-ui, sans-serif",
        }}
      >
        <DialogHeader>
          <DialogTitle className="cms-text-primary" style={{ fontWeight: '600', fontSize: '18px' }}>
            Content History
          </DialogTitle>
          <DialogDescription className="cms-text-secondary" style={{ fontSize: '13px' }}>
            Restore a previous version of this section
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin cms-text-secondary" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 cms-text-secondary">
              <p className="text-sm">No history available for this section</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => {
                const snapshot = item.snapshot as any
                const sectionTitle = snapshot?.content?.title || 
                                   snapshot?.content?.name || 
                                   snapshot?.content?.heading ||
                                   snapshot?.section_type ||
                                   'Section'
                
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg border cms-card-bg cms-border"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium cms-text-primary">
                            {item.action === 'updated' ? 'Updated' : item.action === 'deleted' ? 'Deleted' : 'Created'}
                          </span>
                          <span className="text-xs cms-text-secondary">
                            {formatDistanceToNow(new Date(item.performed_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm cms-text-primary mb-1">
                          {sectionTitle}
                        </p>
                        {snapshot?.section_type && (
                          <p className="text-xs cms-text-secondary">
                            Type: {snapshot.section_type}
                          </p>
                        )}
                        {snapshot?.published !== undefined && (
                          <p className="text-xs cms-text-secondary">
                            Status: {snapshot.published ? 'Published' : 'Draft'}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRollback(item.id)}
                        disabled={rollingBack === item.id || isPending}
                        className="cms-card cms-border"
                        style={{
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        {rollingBack === item.id ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Restoring...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="mr-2 h-3 w-3" />
                            Restore
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface SectionRollbackButtonProps {
  sectionId: string
}

export function SectionRollbackButton({ sectionId }: SectionRollbackButtonProps) {
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
        <History className="mr-2 h-4 w-4" />
        History
      </Button>
      <SectionRollbackDialog
        sectionId={sectionId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

