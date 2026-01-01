import { createAnonymousClient } from '@/lib/supabase/anonymous'
import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, WAITLIST_RATE_LIMIT } from '@/lib/rate-limit'
import { waitlistInputSchema } from '@/lib/validation/forms'
import { logger } from '@/lib/logger'

// Force dynamic - API routes cannot be statically generated
export const dynamic = 'force-dynamic'

// Initialize rate limiter
const rateLimiter = createRateLimiter(WAITLIST_RATE_LIMIT)

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // 1. Get client identifier (IP address)
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    logger.apiRequest('POST', '/api/waitlist', { ip: ipAddress })

    // 2. Rate limiting check
    const rateLimitResult = await rateLimiter.check(ipAddress)

    if (!rateLimitResult.success) {
      logger.rateLimitHit(ipAddress, '/api/waitlist')

      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(WAITLIST_RATE_LIMIT.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
          },
        }
      )
    }

    // 3. Parse and validate request body
    const body = await request.json()
    const validationResult = waitlistInputSchema.safeParse(body)

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

    const { name, email, phone, gender, age, lookingFor } = validationResult.data

    // 4. Database operations
    const supabase = createAnonymousClient()

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
      return NextResponse.json(
        { error: 'Failed to process request. Please try again.' },
        { status: 500 }
      )
    }

    if (existing) {
      logger.info('Duplicate email attempt', { email, ip: ipAddress })
      return NextResponse.json(
        { error: 'Email already registered on waitlist' },
        { status: 409 }
      )
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
      .select()
      .single()

    if (error) {
      logger.error('Waitlist signup failed', {
        error: error.message,
        code: error.code,
      })
      return NextResponse.json(
        { error: 'Failed to submit waitlist signup. Please try again.' },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime
    logger.apiResponse('POST', '/api/waitlist', 201, duration)
    logger.info('Waitlist signup successful', { email })

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully joined waitlist!',
        data: {
          id: data.id,
          email: data.email,
        },
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': String(WAITLIST_RATE_LIMIT.limit),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.reset),
        },
      }
    )
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error('Waitlist API error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    logger.apiResponse('POST', '/api/waitlist', 500, duration)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

