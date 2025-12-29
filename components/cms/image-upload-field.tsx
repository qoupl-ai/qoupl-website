'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { getStorageUrl } from '@/lib/supabase/storage-url'

interface ImageUploadFieldProps {
  value?: string
  onChange: (url: string) => void
  bucket?: string
  label?: string
  description?: string
}

export function ImageUploadField({
  value,
  onChange,
  bucket = 'blog-images',
  label = 'Image',
  description,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isSupabaseStorageUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url)
      return parsed.pathname.includes('/storage/v1/object/public/')
    } catch {
      return false
    }
  }

  // Convert storage path to full URL
  const convertToUrl = (path: string): string => {
    if (!path) return ''
    
    // Trim whitespace
    const trimmedPath = path.trim()
    
    // If it's already a full Supabase storage URL, return as is
    if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
      if (isSupabaseStorageUrl(trimmedPath)) {
        return trimmedPath
      }
      return ''
    }
    
    // If it's a storage path like "hero-images/image.png" or "hero-images/women/image.png", convert it
    if (trimmedPath.includes('/')) {
      const parts = trimmedPath.split('/').filter(p => p) // Remove empty parts
      if (parts.length === 0) return ''
      
      // Check if first part is a bucket name
      const possibleBucket = parts[0] ?? ''
      // Common bucket names
      const buckets = ['hero-images', 'blog-images', 'couple-photos', 'app-screenshots', 'user-uploads', 'brand-assets']
      if (possibleBucket && buckets.includes(possibleBucket) && parts.length > 1) {
        // Path format: "bucket/path/to/file.png"
        const imagePath = parts.slice(1).join('/')
        const url = getStorageUrl(possibleBucket, imagePath)
        console.log('ImageUploadField: Converting path', { original: trimmedPath, bucket: possibleBucket, imagePath, url })
        return url
      }
      return ''
    }
    
    // If it's just a filename, assume it's in the default bucket
    const url = getStorageUrl(bucket, trimmedPath)
    console.log('ImageUploadField: Using default bucket for filename', { original: trimmedPath, bucket, url })
    return url
  }

  // Update preview when value changes (for existing images)
  useEffect(() => {
    if (value) {
      const url = convertToUrl(value)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }, [value, bucket])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size must be less than 20MB')
      return
    }

    setIsUploading(true)

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)
      formData.append('category', 'section')
      formData.append('altText', file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '))

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      // Store as storage path in format "bucket/path" for consistency with database
      const storagePath = `${bucket}/${data.data.storage_path}`
      onChange(storagePath)
      
      // Update preview to use the full URL
      const publicUrl = getStorageUrl(bucket, data.data.storage_path)
      setPreview(publicUrl)
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
      setPreview(value || null)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = () => {
    setPreview(null)
    onChange('')
    toast.success('Image removed')
  }

  const handleReplace = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium cms-text-primary" style={{ fontWeight: '500' }}>
          {label}
        </label>
        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-7 px-2 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
          >
            <X className="h-3 w-3 mr-1" />
            Remove
          </Button>
        )}
      </div>

      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-md overflow-hidden border cms-card-bg cms-border">
            <Image
              src={preview}
              alt={label}
              fill
              className="object-contain"
              unoptimized
              onError={() => {
                console.error('Failed to load image:', preview)
                console.error('Original value:', value)
                toast.error('Failed to load image. Please check the storage path.')
              }}
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReplace}
              className="h-8 px-3 text-xs cms-card cms-text-primary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
            >
              <Upload className="h-3 w-3 mr-1" />
              Replace
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 px-3 text-xs cms-card cms-text-primary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
            >
              <X className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed cms-border rounded-md p-8 text-center cursor-pointer hover:border-opacity-70 transition-colors cms-card-bg"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin cms-text-secondary" />
              <p className="text-sm cms-text-secondary">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="h-8 w-8 cms-text-secondary" />
              <p className="text-sm cms-text-secondary">
                Click to upload or drag and drop
              </p>
              <p className="text-xs cms-text-secondary">
                PNG, JPG, WEBP up to 20MB
              </p>
            </div>
          )}
        </div>
      )}

      {description && (
        <p className="text-xs cms-text-secondary">
          {description}
        </p>
      )}
    </div>
  )
}
