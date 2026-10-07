import { AlertTriangle, CheckCircle2, CircleAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/lib/types'

export const LEVEL_STYLES: Record<
  RiskLevel,
  { label: string; badge: string; text: string; bar: string; cssVar: string }
> = {
  LOW: {
    label: 'Low',
    badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    text: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-500',
    cssVar: 'var(--risk-low)',
  },
  MEDIUM: {
    label: 'Medium',
    badge: 'bg-amber-500/20 text-amber-800 dark:text-amber-300',
    text: 'text-amber-600 dark:text-amber-400',
    bar: 'bg-amber-500',
    cssVar: 'var(--risk-medium)',
  },
  HIGH: {
    label: 'High',
    badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
    text: 'text-rose-600 dark:text-rose-400',
    bar: 'bg-rose-500',
    cssVar: 'var(--risk-high)',
  },
}

const ICONS = { LOW: CheckCircle2, MEDIUM: CircleAlert, HIGH: AlertTriangle }

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const Icon = ICONS[level]
  return (
    <Badge variant="ghost" className={cn('gap-1 font-semibold', LEVEL_STYLES[level].badge, className)}>
      <Icon aria-hidden="true" />
      {level}
    </Badge>
  )
}
