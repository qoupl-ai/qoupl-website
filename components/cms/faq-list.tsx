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
import { FAQDialog } from './faq-dialog'
import { DeleteFAQDialog } from './delete-faq-dialog'

interface FAQ {
  id: string
  question: string
  answer: string
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

interface FAQListProps {
  faqs: FAQ[]
  categories: Category[]
}

export function FAQList({ faqs, categories }: FAQListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredFAQs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category.id === selectedCategory)

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
          Showing {filteredFAQs.length} of {faqs.length} FAQs
        </span>
      </div>

      {/* FAQ Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Question</TableHead>
              <TableHead className="w-[150px]">Category</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFAQs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No FAQs found
                </TableCell>
              </TableRow>
            ) : (
              filteredFAQs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium">{faq.order_index}</TableCell>
                  <TableCell>
                    <div className="max-w-[500px]">
                      <p className="font-medium">{faq.question}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {faq.answer}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{faq.category.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={faq.is_published ? 'default' : 'secondary'}>
                      {faq.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <FAQDialog
                        categories={categories}
                        mode="edit"
                        faq={faq}
                      >
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </FAQDialog>
                      <DeleteFAQDialog faq={faq}>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </DeleteFAQDialog>
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
