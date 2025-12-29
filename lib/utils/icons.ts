import * as LucideIcons from 'lucide-react'

export type LucideIcon = React.ComponentType<{ className?: string }>

export function resolveLucideIcon(name?: string): LucideIcon | null {
  if (!name) return null
  const icons = LucideIcons as Record<string, LucideIcon>
  return icons[name] || icons[`${name}Icon`] || null
}
