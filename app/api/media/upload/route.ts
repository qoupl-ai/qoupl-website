import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    await assertAdmin()

    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string
    const category = formData.get('category') as string
    const altText = formData.get('altText') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 20MB' },
        { status: 400 }
      )
    }

    if (!bucket) {
      return NextResponse.json(
        { error: 'Bucket is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `${category}/${timestamp}-${sanitizedFilename}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Get current user for uploaded_by
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Insert into media table
    const { data: mediaData, error: dbError } = await supabase
      .from('media')
      .insert({
        filename: file.name,
        storage_path: storagePath,
        bucket_name: bucket,
        file_type: file.type,
        file_size: file.size,
        alt_text: altText || file.name,
        category: category || 'other',
        metadata: {},
        uploaded_by: user?.id || null,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Try to delete uploaded file
      await supabase.storage.from(bucket).remove([storagePath])
      
      return NextResponse.json(
        { error: `Database insert failed: ${dbError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'File uploaded successfully',
        data: mediaData,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Media upload API error:', error)
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

