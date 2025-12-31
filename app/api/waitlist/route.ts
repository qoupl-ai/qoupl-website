import { adminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, gender, age, lookingFor } = body

    // Validation
    if (!name || !email || !phone || !gender || !age || !lookingFor) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Age validation (18-25)
    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 25) {
      return NextResponse.json(
        { error: 'Age must be between 18 and 25' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Use admin client for public waitlist signups
    // This is safe because:
    // 1. It's server-side only (never exposed to client)
    // 2. We have strict validation above
    // 3. Public forms commonly use service role for reliability
    // 4. RLS can be complex for anonymous inserts in API routes
    const supabase = adminClient

    // Check if email already exists
    const { data: existing } = await supabase
      .from('waitlist_signups')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered on waitlist' },
        { status: 409 }
      )
    }

    // Get IP address and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Insert into database
    const { data, error } = await supabase
      .from('waitlist_signups')
      .insert({
        name,
        email,
        phone,
        gender,
        age: ageNum,
        looking_for: lookingFor,
        ip_address: ipAddress,
        user_agent: userAgent,
        verified: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Waitlist signup error:', error)
      return NextResponse.json(
        { error: 'Failed to submit waitlist signup. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully joined waitlist!',
        data 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

