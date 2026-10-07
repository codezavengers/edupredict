'use client'

import Link from 'next/link'
import { ChevronRight, TrendingUp } from 'lucide-react'
import { RiskBadge } from '@/components/risk-badge'
import { STATUS_BADGE } from '@/components/status-control'
import { Badge } from '@/components/ui/badge'
import type { StudentRow } from '@/lib/analytics'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function AttentionList({ rows }: { rows: StudentRow[] }) {
  const { getStatus } = useStore()

  return (
    <ul className="divide-y">
      {rows.map((row) => {
        const status = getStatus(row.student.id)
        return (
          <li key={row.student.id}>
            <Link
              href={`/students/${row.student.id}`}
              className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {row.student.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{row.student.name}</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{row.student.course}</span>
                  {row.scoreChange > 0 && (
                    <span className="inline-flex shrink-0 items-center gap-0.5 text-rose-600 dark:text-rose-400">
                      <TrendingUp className="size-3" aria-hidden="true" />+{row.scoreChange} this month
                    </span>
                  )}
                </span>
              </span>
              <Badge variant="ghost" className={cn('hidden sm:inline-flex', STATUS_BADGE[status])}>
                {status}
              </Badge>
              <span className="flex flex-col items-end gap-0.5">
                <span className="text-sm font-semibold tabular-nums">{row.risk.score}</span>
                <RiskBadge level={row.risk.level} />
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
