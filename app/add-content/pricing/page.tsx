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
          <h1 
            className="text-2xl font-semibold mb-1.5"
            style={{ color: '#ffffff', fontWeight: '600', fontSize: '20px', lineHeight: '1.3' }}
          >
            Pricing Plans
          </h1>
          <p 
            className="text-sm"
            style={{ color: '#898989', fontSize: '13px', lineHeight: '1.5' }}
          >
            Manage subscription tiers and pricing
          </p>
        </div>
        <PricingDialog mode="create">
          <Button
            className="h-10 px-5"
            style={{ 
              backgroundColor: '#212121',
              borderColor: '#2a2a2a',
              color: '#898989',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </PricingDialog>
      </div>

      <Card style={{ backgroundColor: '#212121', borderColor: '#2a2a2a' }}>
        <CardHeader>
          <CardTitle style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px', lineHeight: '1.4' }}>
            All Plans ({plans?.length || 0})
          </CardTitle>
          <CardDescription style={{ color: '#898989', fontSize: '13px', lineHeight: '1.5' }}>
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
