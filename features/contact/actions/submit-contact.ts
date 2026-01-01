/**
 * Server Action: Submit Contact Form
 *
 * Modern Next.js Server Action for contact form submissions.
 * Provides built-in CSRF protection, better type safety, and cleaner API.
 *
 * Usage in components:
 *   import { submitContact } from '@/features/contact/actions/submit-contact'
 *   const result = await submitContact(formData)
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { contactSchema } from '@/lib/validation/forms'
import { createRateLimiter, CONTACT_RATE_LIMIT } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { headers } from 'next/headers'

// Initialize rate limiter
const rateLimiter = createRateLimiter(CONTACT_RATE_LIMIT)

export interface ContactActionResult {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: {
    id: string
    email: string
  }
}

export async function submitContact(formData: FormData): Promise<ContactActionResult> {
  const startTime = Date.now()

  try {
    // 1. Get client identifier from headers
    const headersList = await headers()
    const ipAddress =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    logger.apiRequest('Server Action', 'submitContact', { ip: ipAddress })

    // 2. Rate limiting check
    const rateLimitResult = await rateLimiter.check(ipAddress)

    if (!rateLimitResult.success) {
      logger.rateLimitHit(ipAddress, 'submitContact')

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
      subject: formData.get('subject'),
      message: formData.get('message'),
      website: formData.get('website'), // Honeypot
    }

    const validationResult = contactSchema.safeParse(rawData)

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

    const { name, email, subject, message } = validationResult.data

    // 4. Database operations
    const supabase = await createClient()

    // Insert into database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        subject,
        message,
        status: 'new',
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select('id, email')
      .single()

    if (error) {
      logger.error('Contact form submission failed', {
        error: error.message,
        code: error.code,
      })
      return {
        success: false,
        message: 'Failed to submit contact form. Please try again.',
      }
    }

    const duration = Date.now() - startTime
    logger.apiResponse('Server Action', 'submitContact', 201, duration)
    logger.info('Contact form submitted', { email })

    return {
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        id: data.id,
        email: data.email,
      },
    }
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error('Contact server action error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    logger.apiResponse('Server Action', 'submitContact', 500, duration)

    return {
      success: false,
      message: 'Internal server error. Please try again.',
    }
  }
}
