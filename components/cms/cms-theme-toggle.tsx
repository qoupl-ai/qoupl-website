'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useGlobalContent } from '@/components/global-content-provider'
import { resolveLucideIcon } from '@/lib/utils/icons'

export function CMSThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { themeToggle } = useGlobalContent()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!mounted) {
    return null
  }

  if (!themeToggle || themeToggle.show === false) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Theme toggle content is missing in CMS.')
    }
    return null
  }

  const displayTheme = theme === 'system' ? resolvedTheme : theme
  const visibleOptions = (themeToggle.options || []).filter((option) => option.show !== false)
  const currentOption = visibleOptions.find((option) => option.value === displayTheme)
  const CurrentIcon = resolveLucideIcon(currentOption?.icon)

  if (!CurrentIcon) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Theme toggle icons are missing or invalid.')
    }
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full gap-2 h-9 px-2 justify-start cms-theme-toggle-button"
        style={{ fontWeight: '600' }}
      >
        <CurrentIcon className="h-4 w-4" />
        <span className="font-semibold" style={{ fontSize: '13px' }}>
          {themeToggle.label || ''}
        </span>
      </Button>

      {isOpen && (
        <div 
          className="fixed cms-menu-bg cms-menu-border rounded-md shadow-lg z-50 overflow-hidden"
          style={{ 
            width: '140px',
            left: '208px',
            bottom: '80px'
          }}
        >
          {visibleOptions.map((option) => {
            const OptionIcon = resolveLucideIcon(option.icon)
            if (!OptionIcon) return null
            return (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors cms-menu-item ${
                  theme === option.value
                    ? 'cms-menu-item-active'
                    : 'cms-menu-item-inactive'
                }`}
                style={{ fontWeight: '600', fontSize: '12px' }}
              >
                <OptionIcon className="h-4 w-4" />
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
