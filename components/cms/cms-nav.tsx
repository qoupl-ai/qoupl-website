'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Sparkles,
  DollarSign,
  Image as ImageIcon,
  History,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { AdminUser } from '@/lib/supabase/types'

interface CMSNavProps {
  user: User
  adminUser: AdminUser
}

const navItems = [
  { href: '/add-content', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/add-content/pages', label: 'Pages', icon: FileText },
  { href: '/add-content/global', label: 'Global Content', icon: Sparkles },
  { href: '/add-content/media', label: 'Media', icon: ImageIcon },
  { href: '/add-content/history', label: 'History', icon: History },
]

export default function CMSNav({ user, adminUser }: CMSNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/add-content" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#662D91] to-[#8B3DB8] bg-clip-text text-transparent">
                qoupl
              </span>
              <span className="text-sm text-muted-foreground">CMS</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="font-medium">{adminUser.name || user.email}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden overflow-x-auto pb-4">
          <div className="flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2 whitespace-nowrap"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
