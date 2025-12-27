'use client'

import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Check } from 'lucide-react'

// Get all Lucide icon names
const iconNames = Object.keys(LucideIcons).filter(
  (name) => typeof (LucideIcons as any)[name] === 'function' && name[0] === name[0].toUpperCase()
)

// Common icons used in the app
const commonIcons = [
  'Heart', 'Shield', 'Zap', 'Users', 'Sparkles', 'Check', 'Lock', 'Eye', 'Star',
  'Filter', 'Bell', 'MapPin', 'Camera', 'Phone', 'MessageCircle', 'Code', 'Rocket',
  'Mail', 'Target', 'TrendingUp', 'Globe', 'Settings', 'Home', 'User', 'Search',
  'Menu', 'X', 'Plus', 'Minus', 'Edit', 'Trash2', 'Save', 'Download', 'Upload',
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ChevronRight', 'ChevronLeft',
  'Calendar', 'Clock', 'DollarSign', 'FileText', 'Image', 'Video', 'Music', 'Film'
]

interface IconSelectorProps {
  value?: string
  onChange: (value: string) => void
  label?: string
}

export function IconSelector({ value, onChange, label = 'Icon' }: IconSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Filter icons based on search
  const filteredIcons = iconNames.filter((icon) =>
    icon.toLowerCase().includes(search.toLowerCase())
  )

  // Sort: common icons first, then alphabetically
  const sortedIcons = [
    ...commonIcons.filter((icon) => filteredIcons.includes(icon)),
    ...filteredIcons.filter((icon) => !commonIcons.includes(icon)).sort()
  ]

  // Safely get the icon component
  const getSelectedIcon = () => {
    if (!value) return null
    const IconComponent = (LucideIcons as any)[value]
    // Check if it's actually a React component (function)
    if (typeof IconComponent === 'function') {
      return IconComponent
    }
    return null
  }

  const SelectedIcon = getSelectedIcon()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          style={{
            backgroundColor: '#212121',
            borderColor: '#2a2a2a',
            color: '#898989',
            fontSize: '13px',
            fontWeight: '500'
          }}
        >
          {SelectedIcon ? (
            <>
              <SelectedIcon className="h-4 w-4 mr-2" />
              {value}
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              {value ? `${value} (not found)` : `Select ${label}`}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] p-0"
        style={{
          backgroundColor: '#212121',
          borderColor: '#2a2a2a',
        }}
      >
        <div className="p-3 border-b border-[#2a2a2a]">
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
            style={{
              backgroundColor: '#171717',
              borderColor: '#2a2a2a',
              color: '#ffffff',
            }}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          <div className="grid grid-cols-4 gap-2">
            {sortedIcons.map((iconName) => {
              const Icon = (LucideIcons as any)[iconName]
              const isSelected = value === iconName
              
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    onChange(iconName)
                    setOpen(false)
                    setSearch('')
                  }}
                  className="relative p-2 rounded-md border transition-all hover:bg-[#2a2a2a]"
                  style={{
                    backgroundColor: isSelected ? '#2a2a2a' : '#171717',
                    borderColor: isSelected ? '#662D91' : '#2a2a2a',
                  }}
                  title={iconName}
                >
                  {Icon && <Icon className="h-5 w-5 mx-auto" style={{ color: '#898989' }} />}
                  <div className="text-[10px] mt-1 text-center truncate" style={{ color: '#898989' }}>
                    {iconName}
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1">
                      <Check className="h-3 w-3" style={{ color: '#662D91' }} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          {sortedIcons.length === 0 && (
            <p className="text-center py-4 text-sm" style={{ color: '#898989' }}>
              No icons found
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

