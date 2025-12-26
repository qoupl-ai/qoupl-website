'use client'

import { useState, useTransition } from 'react'
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { deleteFAQ } from '@/app/actions/faq-actions'

interface FAQ {
  id: string
  question: string
}

interface DeleteFAQDialogProps {
  faq: FAQ
  children: React.ReactNode
}

export function DeleteFAQDialog({ faq, children }: DeleteFAQDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteFAQ(faq.id)
        toast.success('FAQ deleted successfully')
        setOpen(false)
        router.refresh()
      } catch (error) {
        toast.error('Failed to delete FAQ')
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent
        style={{
          backgroundColor: '#212121',
          borderColor: '#2a2a2a',
          fontFamily: "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif"
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle
            style={{ 
              color: '#ffffff', 
              fontWeight: '600', 
              fontSize: '18px',
              lineHeight: '1.4'
            }}
          >
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription
            style={{ 
              color: '#898989', 
              fontSize: '13px',
              lineHeight: '1.5'
            }}
          >
            This will permanently delete the FAQ: <strong style={{ color: '#ffffff' }}>{faq.question}</strong>
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isPending}
            className="h-10 px-5"
            style={{
              backgroundColor: '#212121',
              borderColor: '#2a2a2a',
              color: '#898989',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="h-10 px-5"
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!isPending) {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)'
            }}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
