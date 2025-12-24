import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CMSNav from '@/components/cms/cms-nav'

export default async function CMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/add-content')
  }

  // Check if user is admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!adminUser) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <CMSNav user={user} adminUser={adminUser} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
