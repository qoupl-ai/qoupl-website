/**
 * Contact Feature Types
 */

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'in_progress' | 'resolved' | 'closed'
  created_at: string
  ip_address?: string
  user_agent?: string
}

export interface ContactStats {
  total: number
  new: number
  in_progress: number
  resolved: number
  closed: number
  avgResponseTime?: number
}
