/**
 * Waitlist Feature Types
 */

export interface WaitlistSignup {
  id: string
  name: string
  email: string
  phone: string
  gender: 'male' | 'female' | 'other'
  age: number
  looking_for: 'friendship' | 'dating' | 'serious'
  verified: boolean
  created_at: string
  ip_address?: string
  user_agent?: string
}

export interface WaitlistStats {
  total: number
  verified: number
  pending: number
  byGender: {
    male: number
    female: number
    other: number
  }
  byLookingFor: {
    friendship: number
    dating: number
    serious: number
  }
}
