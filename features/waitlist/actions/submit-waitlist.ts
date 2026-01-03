/**
 * Server Action: Submit Waitlist
 *
 * Modern Next.js Server Action for waitlist submissions.
 * Provides built-in CSRF protection, better type safety, and cleaner API.
 *
 * Usage in components:
 *   import { submitWaitlist } from '@/features/waitlist/actions/submit-waitlist'
 *   const result = await submitWaitlist(formData)
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { waitlistInputSchema } from '@/lib/validation/forms'
import { createRateLimiter, WAITLIST_RATE_LIMIT } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { headers } from 'next/headers'

// Initialize rate limiter
const rateLimiter = createRateLimiter(WAITLIST_RATE_LIMIT)

export interface WaitlistActionResult {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: {
    id: string
    email: string
  }
}

export async function submitWaitlist(formData: FormData): Promise<WaitlistActionResult> {
  const startTime = Date.now()

  try {
    // 1. Get client identifier from headers
    const headersList = await headers()
    const ipAddress =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      headersList.get('x-real-ip') ??
      'unknown'
    const userAgent = headersList.get('user-agent') ?? 'unknown'

    logger.apiRequest('Server Action', 'submitWaitlist', { ip: ipAddress })

    // 2. Rate limiting check
    const rateLimitResult = await rateLimiter.check(ipAddress)

    if (!rateLimitResult.success) {
      logger.rateLimitHit(ipAddress, 'submitWaitlist')

      const retryAfter = Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
      return {
        success: false,
        message: `Too many requests. Please try again in ${retryAfter} seconds.`,
      }
    }

    // 3. Parse FormData and validate
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      gender: formData.get('gender'),
      age: formData.get('age'),
      lookingFor: formData.get('lookingFor'),
      website: formData.get('website'), // Honeypot
    }

    const validationResult = waitlistInputSchema.safeParse(rawData)

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors

      // Check if honeypot was triggered
      if (errors.website) {
        logger.spamDetected('honeypot', { ip: ipAddress })
        return {
          success: false,
          message: 'Invalid submission detected',
        }
      }

      logger.warn('Validation failed', { errors, ip: ipAddress })

      return {
        success: false,
        message: 'Validation failed',
        errors,
      }
    }

    const { name, email, phone, gender, age, lookingFor } = validationResult.data

    // 4. Database operations
    const supabase = await createClient()

    // Check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from('waitlist_signups')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (checkError) {
      logger.error('Database check failed', {
        error: checkError.message,
        table: 'waitlist_signups',
      })
      return {
        success: false,
        message: 'Failed to process request. Please try again.',
      }
    }

    if (existing) {
      logger.info('Duplicate email attempt', { email, ip: ipAddress })
      return {
        success: false,
        message: 'Email already registered on waitlist',
      }
    }

    // Insert into database
    const { data, error } = await supabase
      .from('waitlist_signups')
      .insert({
        name,
        email,
        phone,
        gender,
        age,
        looking_for: lookingFor,
        ip_address: ipAddress,
        user_agent: userAgent,
        verified: false,
      })
      .select('id, email')
      .single()

    if (error) {
      logger.error('Waitlist signup failed', {
        error: error.message,
        code: error.code,
      })
      return {
        success: false,
        message: 'Failed to submit waitlist signup. Please try again.',
      }
    }

    const duration = Date.now() - startTime
    logger.apiResponse('Server Action', 'submitWaitlist', 201, duration)
    logger.info('Waitlist signup successful', { email })

    return {
      success: true,
      message: 'Successfully joined waitlist!',
      data: {
        id: data.id,
        email: data.email,
      },
    }
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error('Waitlist server action error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    logger.apiResponse('Server Action', 'submitWaitlist', 500, duration)

    return {
      success: false,
      message: 'Internal server error. Please try again.',
    }
  }
}
