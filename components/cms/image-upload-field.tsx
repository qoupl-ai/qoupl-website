'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
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

  // Convert storage path to full URL
  const convertToUrl = (path: string): string => {
    if (!path) return ''
    // If it's already a full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    // If it's a storage path like "hero-images/image.png" or "hero-images/women/image.png", convert it
    if (path.includes('/')) {
      const parts = path.split('/')
      // Check if first part is a bucket name
      const possibleBucket = parts[0]
      // Common bucket names
      const buckets = ['hero-images', 'blog-images', 'couple-photos', 'app-screenshots', 'user-uploads']
      if (buckets.includes(possibleBucket) && parts.length > 1) {
        // Path format: "bucket/path/to/file.png"
        return getStorageUrl(possibleBucket, parts.slice(1).join('/'))
      }
      // If path doesn't start with a bucket name, use the provided bucket prop
      return getStorageUrl(bucket, path)
    }
    // If it's just a filename, assume it's in the default bucket
    return getStorageUrl(bucket, path)
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
        <label className="text-sm font-medium" style={{ color: '#ffffff', fontWeight: '500' }}>
          {label}
        </label>
        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-7 px-2 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
          >
            <X className="h-3 w-3 mr-1" />
            Remove
          </Button>
        )}
      </div>

      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-md overflow-hidden border border-[#2a2a2a] bg-[#171717]">
            <Image
              src={preview}
              alt={label}
              fill
              className="object-contain"
              unoptimized
              onError={() => {
                console.error('Failed to load image:', preview)
                toast.error('Failed to load image. Please check the image path.')
              }}
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReplace}
              className="h-8 px-3 text-xs bg-[#212121] text-white hover:bg-[#2a2a2a]"
            >
              <Upload className="h-3 w-3 mr-1" />
              Replace
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 px-3 text-xs bg-[#212121] text-white hover:bg-[#2a2a2a]"
            >
              <X className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-[#2a2a2a] rounded-md p-8 text-center cursor-pointer hover:border-[#3a3a3a] transition-colors bg-[#171717]"
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
              <Loader2 className="h-8 w-8 animate-spin text-[#898989]" />
              <p className="text-sm" style={{ color: '#898989' }}>Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="h-8 w-8 text-[#898989]" />
              <p className="text-sm" style={{ color: '#898989' }}>
                Click to upload or drag and drop
              </p>
              <p className="text-xs" style={{ color: '#5a5a5a' }}>
                PNG, JPG, WEBP up to 20MB
              </p>
            </div>
          )}
        </div>
      )}

      {description && (
        <p className="text-xs" style={{ color: '#898989' }}>
          {description}
        </p>
      )}
    </div>
  )
}

