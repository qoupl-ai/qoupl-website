import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MediaGrid } from '@/components/cms/media-grid'
import { getStorageUrl } from '@/lib/supabase/storage'

export default async function MediaPage() {
  const supabase = await createClient()

  // Fetch all media from database
  const { data: mediaFiles } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })

  // Add URLs to media files
  const mediaWithUrls = mediaFiles?.map(file => ({
    ...file,
    url: getStorageUrl(file.bucket_name, file.storage_path)
  })) || []

  // Group by category
  const groupedMedia: Record<string, typeof mediaWithUrls> = {}
  mediaWithUrls.forEach(file => {
    const category = file.category || 'uncategorized'
    if (!groupedMedia[category]) {
      groupedMedia[category] = []
    }
    groupedMedia[category].push(file)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage images from Supabase Storage ({mediaWithUrls.length} files)
          </p>
        </div>
      </div>

      {Object.entries(groupedMedia).map(([category, files]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize">{category} ({files.length})</CardTitle>
            <CardDescription>
              Images stored in Supabase Storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MediaGrid media={files} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
