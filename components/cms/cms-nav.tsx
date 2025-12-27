'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Image as ImageIcon,
  History,
  Power,
  PanelLeft,
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

type SidebarMode = 'expanded' | 'collapsed' | 'hover'

export default function CMSNav({ user, adminUser }: CMSNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('hover')
  const [isHovered, setIsHovered] = useState(false)
  const [showModeMenu, setShowModeMenu] = useState(false)

  // Determine if sidebar should be expanded based on mode
  const isExpanded = sidebarMode === 'expanded' || (sidebarMode === 'hover' && isHovered)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Update main content margin when sidebar expands/collapses
  useEffect(() => {
    const main = document.querySelector('main[data-cms-main]') as HTMLElement
    if (main) {
      const width = isExpanded ? '200px' : '60px'
      main.style.marginLeft = width
      main.style.transition = 'margin-left 300ms ease-in-out'
    }
  }, [isExpanded])

  // Close mode menu when clicking outside or when sidebar collapses
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-sidebar-mode-menu]')) {
        setShowModeMenu(false)
      }
    }

    if (showModeMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showModeMenu])

  // Close menu when sidebar collapses (if in hover mode)
  useEffect(() => {
    if (!isExpanded && showModeMenu && sidebarMode === 'hover') {
      setShowModeMenu(false)
    }
  }, [isExpanded, showModeMenu, sidebarMode])

  const modeOptions = [
    { value: 'expanded' as SidebarMode, label: 'Expanded' },
    { value: 'collapsed' as SidebarMode, label: 'Collapsed' },
    { value: 'hover' as SidebarMode, label: 'Expand on Hover' },
  ]

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#212121] border-r border-[#2a2a2a] transition-all duration-300 z-50 flex flex-col ${
        isExpanded ? 'w-[200px]' : 'w-[60px]'
      }`}
      style={{ fontFamily: "'Google Sans Flex', system-ui, sans-serif" }}
      onMouseEnter={() => {
        if (sidebarMode === 'hover' && !showModeMenu) {
          setIsHovered(true)
        }
      }}
      onMouseLeave={() => {
        if (sidebarMode === 'hover' && !showModeMenu) {
          setIsHovered(false)
        }
      }}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-[#2a2a2a]">
        {isExpanded && (
          <Link href="/add-content" className="flex items-center gap-2">
            <div className="relative h-7 w-auto">
              <Image
                src="/images/quoupl.svg"
                alt="qoupl logo"
                width={80}
                height={28}
                className="h-7 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#898989' }}>CMS</span>
          </Link>
        )}
        {!isExpanded && (
          <Link href="/add-content" className="flex items-center justify-center w-full">
            <div className="relative h-7 w-7">
              <Image
                src="/images/quoupl.svg"
                alt="qoupl logo"
                width={28}
                height={28}
                className="h-7 w-7"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </Link>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-3">
        <div className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full gap-2 h-10 px-2 text-[#898989] hover:text-white hover:bg-[#2a2a2a] transition-colors ${
                    isExpanded ? 'justify-start' : 'justify-center'
                  } ${
                    isActive ? 'bg-[#2a2a2a] text-white' : ''
                  }`}
                  style={{ fontWeight: '600' }}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {isExpanded && (
                    <span className="font-semibold whitespace-nowrap" style={{ fontSize: '13px' }}>{item.label}</span>
                  )}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section - User, Logout, and Sidebar Control */}
      <div className="border-t border-[#2a2a2a] space-y-1 mt-auto">
        {/* User Profile */}
        <div className="p-2">
          {isExpanded ? (
            <div className="px-2 py-1">
              <p className="font-semibold text-white truncate" style={{ fontWeight: '600', fontSize: '13px' }}>
                {adminUser.name || user.email}
              </p>
              <p className="text-[#898989] font-medium" style={{ fontSize: '11px' }}>Admin</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                <span className="text-xs text-white font-semibold" style={{ fontWeight: '600' }}>
                  {(adminUser.name || user.email || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="px-2">
          {isExpanded ? (
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start gap-2 h-9 px-2 text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
              style={{ fontWeight: '600' }}
            >
              <Power className="h-4 w-4 shrink-0" />
              <span className="font-semibold" style={{ fontSize: '13px' }}>Sign Out</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="w-full h-9 text-[#898989] hover:text-white hover:bg-[#2a2a2a] justify-center"
              title="Sign Out"
            >
              <Power className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Sidebar Mode Control */}
        <div className="px-2 pb-2 relative" data-sidebar-mode-menu>
          <Button
            variant="ghost"
            onClick={() => setShowModeMenu(!showModeMenu)}
            className={`w-full gap-2 h-9 px-2 text-[#898989] hover:text-white hover:bg-[#2a2a2a] ${
              isExpanded ? 'justify-start' : 'justify-center'
            }`}
            style={{ fontWeight: '600' }}
            onMouseEnter={() => {
              // Prevent sidebar from collapsing when hovering over the menu button
              if (sidebarMode === 'hover') {
                setIsHovered(true)
              }
            }}
          >
            <PanelLeft className="h-4 w-4 shrink-0" />
            {isExpanded && (
              <span className="font-semibold" style={{ fontSize: '13px' }}>Sidebar</span>
            )}
          </Button>

          {/* Mode Menu - Positioned outside sidebar */}
          {showModeMenu && (
            <div 
              className="fixed bg-[#171717] border border-[#2a2a2a] rounded-md shadow-lg overflow-hidden"
              style={{ 
                zIndex: 1000, 
                width: '140px',
                left: isExpanded ? '208px' : '68px',
                bottom: '16px'
              }}
              onMouseEnter={() => {
                // Keep sidebar expanded when hovering over menu
                if (sidebarMode === 'hover') {
                  setIsHovered(true)
                }
              }}
              onMouseLeave={() => {
                // Only collapse if not in expanded mode
                if (sidebarMode === 'hover') {
                  setIsHovered(false)
                }
              }}
            >
              {modeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSidebarMode(option.value)
                    setShowModeMenu(false)
                    // If switching to expanded, ensure it stays expanded
                    if (option.value === 'expanded') {
                      setIsHovered(false)
                    }
                  }}
                  className={`w-full text-left px-3 py-2 transition-colors ${
                    sidebarMode === option.value
                      ? 'bg-[#2a2a2a] text-white'
                      : 'text-[#898989] hover:text-white hover:bg-[#2a2a2a]'
                  }`}
                  style={{ fontWeight: '600', fontSize: '12px' }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
