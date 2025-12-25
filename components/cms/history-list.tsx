'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Trash2, Edit, Plus } from 'lucide-react'

interface HistoryEntry {
  id: string
  entity_type: string
  entity_id: string
  action: string
  snapshot: any
  performed_at: string
  admin?: {
    name: string
    email: string
  } | null
}

interface HistoryListProps {
  history: HistoryEntry[]
}

export function HistoryList({ history }: HistoryListProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <Plus className="h-4 w-4 text-green-500" />
      case 'updated':
        return <Edit className="h-4 w-4 text-blue-500" />
      case 'deleted':
        return <Trash2 className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getActionBadge = (action: string) => {
    const variants: Record<string, any> = {
      'created': 'default',
      'updated': 'secondary',
      'deleted': 'destructive',
    }
    return variants[action] || 'outline'
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Entity Type</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Title/Name</TableHead>
            <TableHead>Performed By</TableHead>
            <TableHead>When</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No history entries found
              </TableCell>
            </TableRow>
          ) : (
            history.map((entry) => {
              const title = entry.snapshot?.title || entry.snapshot?.question || entry.snapshot?.name || entry.entity_id

              return (
                <TableRow key={entry.id}>
                  <TableCell>{getActionIcon(entry.action)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {entry.entity_type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getActionBadge(entry.action)} className="capitalize">
                      {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px] truncate" title={title}>
                      {title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {entry.admin ? (
                        <div>
                          <p className="font-medium">{entry.admin.name}</p>
                          <p className="text-muted-foreground text-xs">{entry.admin.email}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">System</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(entry.performed_at), { addSuffix: true })}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
