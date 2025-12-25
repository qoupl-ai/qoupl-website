import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { PricingList } from '@/components/cms/pricing-list'
import { PricingDialog } from '@/components/cms/pricing-dialog'

export default async function PricingPage() {
  const supabase = await createClient()

  // Fetch all pricing plans
  const { data: plans } = await supabase
    .from('pricing_plans')
    .select('*')
    .order('order_index', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pricing Plans</h1>
          <p className="text-muted-foreground mt-2">
            Manage subscription tiers and pricing
          </p>
        </div>
        <PricingDialog mode="create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </PricingDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Plans ({plans?.length || 0})</CardTitle>
          <CardDescription>
            Edit, reorder, or delete pricing plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PricingList plans={plans || []} />
        </CardContent>
      </Card>
    </div>
  )
}
