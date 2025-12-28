'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteSection } from '@/app/actions/section-actions'
import { toast } from 'sonner'

interface DeleteSectionDialogProps {
  sectionId: string
  sectionTitle?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteSectionDialog({
  sectionId,
  sectionTitle,
  open,
  onOpenChange,
}: DeleteSectionDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    try {
      await deleteSection(sectionId)
      toast.success('Section deleted successfully', {
        description: 'The section has been removed.',
      })
      onOpenChange(false)
      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      toast.error('Failed to delete section', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="cms-card cms-border border">
        <AlertDialogHeader>
          <AlertDialogTitle className="cms-text-primary">Delete Section</AlertDialogTitle>
          <AlertDialogDescription className="cms-text-secondary">
            Are you sure you want to delete this section?
            {sectionTitle && (
              <span className="block mt-1 font-medium cms-text-primary">
                &quot;{sectionTitle}&quot;
              </span>
            )}
            <span className="block mt-2">
              This action cannot be undone. The section will be permanently removed.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cms-card cms-border cms-text-secondary">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

