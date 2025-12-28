import { assertAdmin } from '@/lib/auth/assert-admin'
import CMSNav from '@/components/cms/cms-nav'
import CMSBodyClass from '@/components/cms/cms-body-class'
import { Toaster } from '@/components/ui/sonner'

export default async function CMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Single source of truth for admin authorization
  // assertAdmin() handles authentication and admin verification
  // It will redirect to /login if not authenticated or throw if not admin
  const { user, adminUser } = await assertAdmin()

  return (
    <>
      <CMSBodyClass />
      <div 
        className="min-h-screen cms-main-bg"
        style={{ 
          fontFamily: "'Google Sans Flex', system-ui, sans-serif"
        }}
      >
        <CMSNav user={user} adminUser={adminUser} />
      <main 
        data-cms-main
        className="transition-all duration-300 cms-main-bg"
        style={{ 
          marginLeft: '200px', // Default expanded width (w-[200px])
          padding: '2rem',
          minHeight: '100vh'
        }}
      >
        {children}
      </main>
      <Toaster position="top-center" richColors />
    </div>
    </>
  )
}
