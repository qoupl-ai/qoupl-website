import { createAnonymousClient } from '@/lib/supabase/anonymous'
import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, CONTACT_RATE_LIMIT } from '@/lib/rate-limit'
import { contactSchema } from '@/lib/validation/forms'
import { logger } from '@/lib/logger'

// Force dynamic - API routes cannot be statically generated
export const dynamic = 'force-dynamic'

// Initialize rate limiter
const rateLimiter = createRateLimiter(CONTACT_RATE_LIMIT)

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // 1. Get client identifier (IP address)
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'
    const userAgent = request.headers.get('user-agent') ?? 'unknown'

    logger.apiRequest('POST', '/api/contact', { ip: ipAddress })

    // 2. Rate limiting check
    const rateLimitResult = await rateLimiter.check(ipAddress)

    if (!rateLimitResult.success) {
      logger.rateLimitHit(ipAddress, '/api/contact')

      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(CONTACT_RATE_LIMIT.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
          },
        }
      )
    }

    // 3. Parse and validate request body
    const body = await request.json()
    const validationResult = contactSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors

      // Check if honeypot was triggered
      if (errors.website) {
        logger.spamDetected('honeypot', { ip: ipAddress })
      }

      logger.warn('Validation failed', { errors, ip: ipAddress })

      return NextResponse.json(
        {
          error: 'Validation failed',
          details: errors,
        },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = validationResult.data

    // 4. Database operations
    const supabase = createAnonymousClient()

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
      .select()
      .single()

    if (error) {
      logger.error('Contact form submission failed', {
        error: error.message,
        code: error.code,
      })
      return NextResponse.json(
        { error: 'Failed to submit contact form. Please try again.' },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime
    logger.apiResponse('POST', '/api/contact', 201, duration)
    logger.info('Contact form submitted', { email })

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.',
        data: {
          id: data.id,
          email: data.email,
        },
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': String(CONTACT_RATE_LIMIT.limit),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.reset),
        },
      }
    )
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error('Contact API error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    logger.apiResponse('POST', '/api/contact', 500, duration)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

