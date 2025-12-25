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
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Category:</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Status:</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="text-sm text-muted-foreground ml-auto">
          Showing {filteredPosts.length} of {posts.length} posts
        </span>
      </div>

      {/* Blog Posts Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="w-[150px]">Category</TableHead>
              <TableHead className="w-[120px]">Publish Date</TableHead>
              <TableHead className="w-[100px]">Read Time</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No blog posts found
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="max-w-[400px]">
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {post.excerpt}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.category.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(new Date(post.publish_date), 'MMM d, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {post.read_time} min
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.is_published ? 'default' : 'secondary'}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <BlogDialog
                        categories={categories}
                        mode="edit"
                        post={post}
                      >
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </BlogDialog>
                      <DeleteBlogDialog post={post}>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </DeleteBlogDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
