'use client'

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
import { Pencil, Trash2, Check } from 'lucide-react'
import { PricingDialog } from './pricing-dialog'
import { DeletePricingDialog } from './delete-pricing-dialog'

interface PricingPlan {
  id: string
  name: string
  price: number
  billing_period: string
  description: string
  features: string[]
  is_popular: boolean
  is_published: boolean
  order_index: number
}

interface PricingListProps {
  plans: PricingPlan[]
}

export function PricingList({ plans }: PricingListProps) {
  return (
    <div className="space-y-4">
      {/* Pricing Plans Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Plan Name</TableHead>
              <TableHead className="w-[120px]">Price</TableHead>
              <TableHead className="w-[100px]">Features</TableHead>
              <TableHead className="w-[100px]">Popular</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No pricing plans found
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.order_index}</TableCell>
                  <TableCell>
                    <div className="max-w-[300px]">
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {plan.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">
                      ${plan.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{plan.billing_period}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {plan.features.length} items
                    </span>
                  </TableCell>
                  <TableCell>
                    {plan.is_popular && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={plan.is_published ? 'default' : 'secondary'}>
                      {plan.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <PricingDialog
                        mode="edit"
                        plan={plan}
                      >
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </PricingDialog>
                      <DeletePricingDialog plan={plan}>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </DeletePricingDialog>
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
