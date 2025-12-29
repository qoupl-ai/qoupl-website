'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, Loader2, Image as ImageIcon, Plus, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { getStorageUrl } from '@/lib/supabase/storage-url'

interface MultiImageUploadFieldProps {
  value?: string[]
  onChange: (urls: string[]) => void
  bucket?: string
  label?: string
  description?: string
  maxImages?: number
}

export function MultiImageUploadField({
  value = [],
  onChange,
  bucket = 'hero-images',
  label = 'Images',
  description,
  maxImages = 20,
}: MultiImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isSupabaseStorageUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url)
      return parsed.pathname.includes('/storage/v1/object/public/')
    } catch {
      return false
    }
  }

  const extractStoragePath = (url: string): string | null => {
    if (!isSupabaseStorageUrl(url)) return null
    try {
      const parsed = new URL(url)
      const parts = parsed.pathname.split('/storage/v1/object/public/')
      return parts.length > 1 ? parts[1] ?? null : null
    } catch {
      return null
    }
  }

  // Convert storage paths to full URLs
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
    
    // If it's a storage path like "hero-images/women/image.png", convert it
    if (trimmedPath.includes('/')) {
      const parts = trimmedPath.split('/').filter(p => p) // Remove empty parts
      if (parts.length === 0) return ''
      
      const possibleBucket = parts[0] ?? ''
      // Common bucket names
      const buckets = ['hero-images', 'blog-images', 'couple-photos', 'app-screenshots', 'user-uploads', 'brand-assets']
      if (possibleBucket && buckets.includes(possibleBucket) && parts.length > 1) {
        // Path format: "bucket/path/to/file.png"
        const imagePath = parts.slice(1).join('/')
        const url = getStorageUrl(possibleBucket, imagePath)
        console.log('MultiImageUploadField: Converting path', { original: trimmedPath, bucket: possibleBucket, imagePath, url })
        return url
      }
      return ''
    }
    // If it's just a filename, assume it's in the default bucket
    const url = getStorageUrl(bucket, trimmedPath)
    console.log('MultiImageUploadField: Using default bucket for filename', { original: trimmedPath, bucket, url })
    return url
  }

  // Sync with value prop and convert paths to URLs
  useEffect(() => {
    // Handle various input formats
    let imageArray: string[] = []
    
    if (value) {
      if (Array.isArray(value)) {
        imageArray = value
      } else if (typeof value === 'string') {
        // Single string value, convert to array
        imageArray = [value]
      }
    }
    
    if (imageArray.length > 0) {
      const convertedImages = imageArray.map(convertToUrl)
      setImages(convertedImages)
    } else {
      setImages([])
    }
  }, [value, bucket, label])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check if adding these files would exceed max
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    // Validate file types
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'))
    if (invalidFiles.length > 0) {
      toast.error('Please select only image files')
      return
    }

    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > 20 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      toast.error('File size must be less than 20MB')
      return
    }

    setIsUploading(true)

    try {
      const uploadPromises = files.map(async (file) => {
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

        // Return storage path in format "bucket/path" for consistency with database
        return `${bucket}/${data.data.storage_path}`
      })

      const newPaths = await Promise.all(uploadPromises)
      
      // Get current paths (convert URLs to paths if needed)
      const currentPaths = (value || []).map(v => {
        if (v.startsWith('http://') || v.startsWith('https://')) {
          return extractStoragePath(v) || ''
        }
        return v
      })
      
      const updatedPaths = [...currentPaths, ...newPaths].filter((p): p is string => !!p)
      // Convert to URLs for display
      setImages(updatedPaths.map(convertToUrl))
      // Store as paths for database
      onChange(updatedPaths)
      toast.success(`${newPaths.length} image(s) uploaded successfully!`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload images')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = (index: number) => {
    const currentPaths = (value || []).map(v => {
      if (v.startsWith('http://') || v.startsWith('https://')) {
        return extractStoragePath(v) || ''
      }
      return v
    })
    const updatedPaths = currentPaths.filter((_, i) => i !== index).filter((p): p is string => !!p)
    setImages(updatedPaths.map(convertToUrl))
    onChange(updatedPaths)
    toast.success('Image removed')
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return

    // Get current paths
    const currentPaths = (value || []).map(v => {
      if (v.startsWith('http://') || v.startsWith('https://')) {
        return extractStoragePath(v) || ''
      }
      return v
    })
    
    const updatedPaths = [...currentPaths].filter((p): p is string => !!p)
    const temp = updatedPaths[index]
    updatedPaths[index] = updatedPaths[newIndex]!
    updatedPaths[newIndex] = temp!
    setImages(updatedPaths.map(convertToUrl))
    onChange(updatedPaths)
  }

  // Component for individual image with error handling
  function ImageItemWithError({ 
    imageUrl, 
    index, 
    label, 
    onMoveUp, 
    onMoveDown, 
    onDelete 
  }: { 
    imageUrl: string
    index: number
    label: string
    onMoveUp?: () => void
    onMoveDown?: () => void
    onDelete: () => void
  }) {
    const [imageError, setImageError] = useState(false)

    return (
      <div className="relative group">
        <div className="relative w-full aspect-square rounded-md overflow-hidden border cms-card-bg cms-border">
          {!imageError ? (
            <Image
              src={imageUrl}
              alt={`${label} ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
              onError={() => {
                console.error('Failed to load image:', imageUrl)
                setImageError(true)
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 cms-text-secondary">
              <AlertCircle className="h-6 w-6 mb-2" />
              <p className="text-xs text-center">Image not found</p>
              <p className="text-[10px] text-center mt-1 opacity-75 line-clamp-2 break-all">
                {imageUrl.split('/').pop()?.substring(0, 20)}...
              </p>
            </div>
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
            {onMoveUp && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onMoveUp}
                className="h-7 w-7 p-0 cms-card cms-text-primary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                title="Move up"
              >
                ↑
              </Button>
            )}
            {onMoveDown && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onMoveDown}
                className="h-7 w-7 p-0 cms-card cms-text-primary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                title="Move down"
              >
                ↓
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-7 w-7 p-0 cms-card cms-text-primary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
              title="Delete"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
          {index + 1}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium cms-text-primary" style={{ fontWeight: '500' }}>
          {label} ({images.length}/{maxImages})
        </label>
        {images.length < maxImages && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-7 px-2 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Images
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((imageUrl, index) => (
            <ImageItemWithError
              key={index}
              imageUrl={imageUrl}
              index={index}
              label={label}
              onMoveUp={index > 0 ? () => handleMove(index, 'up') : undefined}
              onMoveDown={index < images.length - 1 ? () => handleMove(index, 'down') : undefined}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>
      ) : (
        <div
          className="border-2 border-dashed cms-border rounded-md p-8 text-center cursor-pointer hover:border-opacity-70 transition-colors cms-card-bg"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin cms-text-secondary" />
              <p className="text-sm cms-text-secondary">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="h-8 w-8 cms-text-secondary" />
              <p className="text-sm cms-text-secondary">
                Click to upload images or drag and drop
              </p>
              <p className="text-xs cms-text-secondary">
                PNG, JPG, WEBP up to 20MB each
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
