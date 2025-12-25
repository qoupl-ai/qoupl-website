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
import { Pencil, Trash2 } from 'lucide-react'
import { FeatureDialog } from './feature-dialog'
import { DeleteFeatureDialog } from './delete-feature-dialog'

interface Feature {
  id: string
  title: string
  description: string
  icon: string
  order_index: number
  is_published: boolean
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

interface FeatureListProps {
  features: Feature[]
  categories: Category[]
}

export function FeatureList({ features, categories }: FeatureListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredFeatures = selectedCategory === 'all'
    ? features
    : features.filter(feature => feature.category.id === selectedCategory)

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filter by category:</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[250px]">
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
        <span className="text-sm text-muted-foreground">
          Showing {filteredFeatures.length} of {features.length} features
        </span>
      </div>

      {/* Features Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="w-[60px]">Icon</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[150px]">Category</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeatures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No features found
                </TableCell>
              </TableRow>
            ) : (
              filteredFeatures.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell className="font-medium">{feature.order_index}</TableCell>
                  <TableCell>
                    <div className="text-2xl">{feature.icon}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[400px]">
                      <p className="font-medium">{feature.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{feature.category.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={feature.is_published ? 'default' : 'secondary'}>
                      {feature.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <FeatureDialog
                        categories={categories}
                        mode="edit"
                        feature={feature}
                      >
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </FeatureDialog>
                      <DeleteFeatureDialog feature={feature}>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </DeleteFeatureDialog>
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
