import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CMSNav from '@/components/cms/cms-nav'
import CMSBodyClass from '@/components/cms/cms-body-class'
import { Toaster } from '@/components/ui/sonner'

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
    <>
      <CMSBodyClass />
      <div 
        className="min-h-screen"
        style={{ 
          backgroundColor: '#171717',
          fontFamily: "'Google Sans Flex', system-ui, sans-serif"
        }}
      >
        <CMSNav user={user} adminUser={adminUser} />
      <main 
        data-cms-main
        className="transition-all duration-300"
        style={{ 
          marginLeft: '200px', // Default expanded width (w-[200px])
          padding: '2rem',
          minHeight: '100vh',
          color: '#898989'
        }}
      >
        {children}
      </main>
      <Toaster position="top-center" richColors />
    </div>
    </>
  )
}
