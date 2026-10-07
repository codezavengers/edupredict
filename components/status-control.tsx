'use client'

import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { InterventionStatus } from '@/lib/types'

export const STATUSES: InterventionStatus[] = ['Pending', 'In Progress', 'Completed']

const ACTIVE_STYLE: Record<InterventionStatus, string> = {
  Pending: 'bg-amber-500 text-white',
  'In Progress': 'bg-primary text-primary-foreground',
  Completed: 'bg-emerald-600 text-white',
}

export const STATUS_BADGE: Record<InterventionStatus, string> = {
  Pending: 'bg-amber-500/20 text-amber-800 dark:text-amber-300',
  'In Progress': 'bg-primary/15 text-primary',
  Completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
}

export function StatusControl({ studentId, studentName }: { studentId: string; studentName: string }) {
  const { getStatus, setStatus, role } = useStore()
  const current = getStatus(studentId)
  const canEdit = role === 'admin' || role === 'faculty'

  return (
    <div
      role="radiogroup"
      aria-label={`Intervention status for ${studentName}`}
      className="inline-flex rounded-lg border bg-muted/50 p-0.5"
    >
      {STATUSES.map((status) => {
        const active = status === current
        return (
          <button
            key={status}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={!canEdit}
            onClick={() => setStatus(studentId, status)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors',
              'focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
              active ? ACTIVE_STYLE[status] : 'text-muted-foreground hover:text-foreground',
              !canEdit && !active && 'opacity-60',
              !canEdit && 'cursor-not-allowed',
            )}
          >
            {status}
          </button>
        )
      })}
    </div>
  )
}
