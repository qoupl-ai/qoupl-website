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
        return <Plus className="h-4 w-4" style={{ color: '#10b981' }} />
      case 'updated':
        return <Edit className="h-4 w-4" style={{ color: '#3b82f6' }} />
      case 'deleted':
        return <Trash2 className="h-4 w-4" style={{ color: '#ef4444' }} />
      default:
        return <FileText className="h-4 w-4" style={{ color: '#898989' }} />
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'created':
        return { bg: '#10b981', text: '#ffffff' } // Green
      case 'updated':
        return { bg: '#3b82f6', text: '#ffffff' } // Blue
      case 'deleted':
        return { bg: '#ef4444', text: '#ffffff' } // Red
      default:
        return { bg: '#6b7280', text: '#ffffff' } // Gray
    }
  }

  const getEntityTypeColor = (entityType: string) => {
    const type = entityType.toLowerCase()
    if (type.includes('blog')) {
      return { bg: '#8b5cf6', text: '#ffffff' } // Purple
    }
    if (type.includes('faq')) {
      return { bg: '#ec4899', text: '#ffffff' } // Pink
    }
    if (type.includes('feature')) {
      return { bg: '#f59e0b', text: '#ffffff' } // Amber
    }
    if (type.includes('pricing')) {
      return { bg: '#10b981', text: '#ffffff' } // Green
    }
    if (type.includes('page')) {
      return { bg: '#6366f1', text: '#ffffff' } // Indigo
    }
    return { bg: '#6b7280', text: '#ffffff' } // Gray
  }

  return (
    <div className="rounded-md border overflow-x-auto" style={{ borderColor: '#2a2a2a', backgroundColor: '#212121' }}>
      <Table>
        <TableHeader>
          <TableRow style={{ borderColor: '#2a2a2a' }}>
            <TableHead 
              className="w-[50px] whitespace-nowrap" 
              style={{ color: '#898989', fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
            >
            </TableHead>
            <TableHead 
              className="w-[140px] whitespace-nowrap"
              style={{ color: '#898989', fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
            >
              Entity Type
            </TableHead>
            <TableHead 
              className="w-[100px] whitespace-nowrap"
              style={{ color: '#898989', fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
            >
              Action
            </TableHead>
            <TableHead 
              className="min-w-[200px]"
              style={{ color: '#898989', fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
            >
              Title/Name
            </TableHead>
            <TableHead 
              className="w-[180px] whitespace-nowrap"
              style={{ color: '#898989', fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
            >
              Performed By
            </TableHead>
            <TableHead 
              className="w-[140px] whitespace-nowrap"
              style={{ color: '#898989', fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
            >
              When
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length === 0 ? (
            <TableRow style={{ borderColor: '#2a2a2a' }}>
              <TableCell colSpan={6} className="text-center py-8" style={{ color: '#898989', fontSize: '13px' }}>
                No history entries found
              </TableCell>
            </TableRow>
          ) : (
            history.map((entry) => {
              const title = entry.snapshot?.title || entry.snapshot?.question || entry.snapshot?.name || entry.entity_id
              const actionColor = getActionBadge(entry.action)
              const entityColor = getEntityTypeColor(entry.entity_type)

              return (
                <TableRow 
                  key={entry.id}
                  style={{ borderColor: '#2a2a2a' }}
                  className="hover:bg-[#2a2a2a]"
                >
                  <TableCell style={{ padding: '12px 16px' }}>{getActionIcon(entry.action)}</TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    <Badge 
                      variant="outline" 
                      className="capitalize whitespace-nowrap"
                      style={{ 
                        backgroundColor: entityColor.bg,
                        color: entityColor.text,
                        borderColor: entityColor.bg,
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '4px 10px'
                      }}
                    >
                      {entry.entity_type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    <Badge 
                      variant="outline"
                      className="capitalize whitespace-nowrap"
                      style={{ 
                        backgroundColor: actionColor.bg,
                        color: actionColor.text,
                        borderColor: actionColor.bg,
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '4px 10px'
                      }}
                    >
                      {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    <div 
                      className="max-w-[300px] truncate" 
                      title={title} 
                      style={{ color: '#ffffff', fontWeight: '600', fontSize: '13px' }}
                    >
                      {title}
                    </div>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    <div className="text-sm">
                      {entry.admin ? (
                        <div>
                          <p className="font-semibold" style={{ color: '#ffffff', fontWeight: '600', fontSize: '13px' }}>
                            {entry.admin.name}
                          </p>
                          <p className="text-xs" style={{ color: '#898989', fontSize: '12px' }}>
                            {entry.admin.email}
                          </p>
                        </div>
                      ) : (
                        <span style={{ color: '#898989', fontSize: '13px' }}>System</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    <span className="text-sm whitespace-nowrap" style={{ color: '#898989', fontSize: '12px' }}>
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
