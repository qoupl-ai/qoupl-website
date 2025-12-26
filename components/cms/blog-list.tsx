'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pencil, Trash2, Eye } from 'lucide-react'
import { BlogDialog } from './blog-dialog'
import { DeleteBlogDialog } from './delete-blog-dialog'
import { format } from 'date-fns'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  publish_date: string
  is_published: boolean
  read_time: number
  category: {
    id: string
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

interface BlogListProps {
  posts: BlogPost[]
  categories: Category[]
}

// Category color mapping
const getCategoryColor = (categoryName: string) => {
  const name = categoryName.toLowerCase()
  if (name.includes('technology') || name.includes('tech')) {
    return { bg: '#3b82f6', text: '#ffffff' } // Blue
  }
  if (name.includes('relationship') || name.includes('dating')) {
    return { bg: '#ec4899', text: '#ffffff' } // Pink
  }
  if (name.includes('safety') || name.includes('security')) {
    return { bg: '#10b981', text: '#ffffff' } // Green
  }
  if (name.includes('lifestyle') || name.includes('tips')) {
    return { bg: '#f59e0b', text: '#ffffff' } // Amber
  }
  if (name.includes('news') || name.includes('update')) {
    return { bg: '#8b5cf6', text: '#ffffff' } // Purple
  }
  // Default colors
  return { bg: '#6366f1', text: '#ffffff' } // Indigo
}

export function BlogList({ posts, categories }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  let filteredPosts = posts

  if (selectedCategory !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.category.id === selectedCategory)
  }

  if (statusFilter === 'published') {
    filteredPosts = filteredPosts.filter(post => post.is_published)
  } else if (statusFilter === 'draft') {
    filteredPosts = filteredPosts.filter(post => !post.is_published)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label 
            className="text-sm font-semibold whitespace-nowrap" 
            style={{ color: '#898989', fontWeight: '600', fontSize: '13px' }}
          >
            Category:
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger 
              className="w-[200px]"
              style={{ 
                backgroundColor: '#212121',
                borderColor: '#2a2a2a',
                color: '#898989',
                fontSize: '13px'
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: '#212121', borderColor: '#2a2a2a' }}>
              <SelectItem value="all" style={{ color: '#898989', fontSize: '13px' }}>All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id} style={{ color: '#898989', fontSize: '13px' }}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label 
            className="text-sm font-semibold whitespace-nowrap" 
            style={{ color: '#898989', fontWeight: '600', fontSize: '13px' }}
          >
            Status:
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger 
              className="w-[150px]"
              style={{ 
                backgroundColor: '#212121',
                borderColor: '#2a2a2a',
                color: '#898989',
                fontSize: '13px'
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: '#212121', borderColor: '#2a2a2a' }}>
              <SelectItem value="all" style={{ color: '#898989', fontSize: '13px' }}>All</SelectItem>
              <SelectItem value="published" style={{ color: '#898989', fontSize: '13px' }}>Published</SelectItem>
              <SelectItem value="draft" style={{ color: '#898989', fontSize: '13px' }}>Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="text-sm ml-auto whitespace-nowrap" style={{ color: '#898989', fontSize: '13px' }}>
          Showing {filteredPosts.length} of {posts.length} posts
        </span>
      </div>

      {/* Blog Posts Table */}
      <div className="rounded-md border overflow-x-auto" style={{ borderColor: '#2a2a2a', backgroundColor: '#212121' }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: '#2a2a2a' }}>
              <TableHead 
                className="min-w-[300px]"
                style={{ color: '#898989', fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                Title
              </TableHead>
              <TableHead 
                className="w-[140px] whitespace-nowrap"
                style={{ color: '#898989', fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                Category
              </TableHead>
              <TableHead 
                className="w-[120px] whitespace-nowrap"
                style={{ color: '#898989', fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                Publish Date
              </TableHead>
              <TableHead 
                className="w-[100px] whitespace-nowrap"
                style={{ color: '#898989', fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                Read Time
              </TableHead>
              <TableHead 
                className="w-[100px] whitespace-nowrap"
                style={{ color: '#898989', fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                Status
              </TableHead>
              <TableHead 
                className="w-[150px] text-right whitespace-nowrap"
                style={{ color: '#898989', fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length === 0 ? (
              <TableRow style={{ borderColor: '#2a2a2a' }}>
                <TableCell colSpan={6} className="text-center py-8" style={{ color: '#898989', fontSize: '13px' }}>
                  No blog posts found
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => {
                const categoryColor = getCategoryColor(post.category.name)
                return (
                  <TableRow 
                    key={post.id}
                    style={{ borderColor: '#2a2a2a' }}
                    className="hover:bg-[#2a2a2a]"
                  >
                    <TableCell style={{ padding: '12px 16px' }}>
                      <div className="max-w-[400px]">
                        <p 
                          className="font-semibold mb-1" 
                          style={{ color: '#ffffff', fontWeight: '600', fontSize: '13px', lineHeight: '1.4' }}
                        >
                          {post.title}
                        </p>
                        <p 
                          className="text-sm line-clamp-1" 
                          style={{ color: '#898989', fontSize: '12px', lineHeight: '1.5' }}
                        >
                          {post.excerpt}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell style={{ padding: '12px 16px' }}>
                      <Badge 
                        variant="outline"
                        className="whitespace-nowrap"
                        style={{ 
                          backgroundColor: categoryColor.bg,
                          color: categoryColor.text,
                          borderColor: categoryColor.bg,
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '4px 10px'
                        }}
                      >
                        {post.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ padding: '12px 16px' }}>
                      <span className="text-sm whitespace-nowrap" style={{ color: '#898989', fontSize: '12px' }}>
                        {format(new Date(post.publish_date), 'MMM d, yyyy')}
                      </span>
                    </TableCell>
                    <TableCell style={{ padding: '12px 16px' }}>
                      <span className="text-sm whitespace-nowrap" style={{ color: '#898989', fontSize: '12px' }}>
                        {post.read_time} min
                      </span>
                    </TableCell>
                    <TableCell style={{ padding: '12px 16px' }}>
                      <Badge 
                        variant={post.is_published ? 'default' : 'secondary'}
                        className="whitespace-nowrap"
                        style={{ 
                          backgroundColor: post.is_published ? '#10b981' : '#6b7280',
                          color: '#ffffff',
                          borderColor: post.is_published ? '#10b981' : '#6b7280',
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '4px 10px'
                        }}
                      >
                        {post.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ padding: '12px 16px' }}>
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          asChild
                          className="h-8 w-8"
                          style={{ color: '#898989' }}
                        >
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                        <BlogDialog
                          categories={categories}
                          mode="edit"
                          post={post}
                        >
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                            style={{ color: '#898989' }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </BlogDialog>
                        <DeleteBlogDialog post={post}>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                            style={{ color: '#898989' }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </DeleteBlogDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
