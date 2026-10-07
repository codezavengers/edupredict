'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { RiskBadge } from '@/components/risk-badge'
import { StatusControl, STATUSES } from '@/components/status-control'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROWS, needsAttention } from '@/lib/analytics'
import { recommendedActions } from '@/lib/risk'
import { useStore } from '@/lib/store'
import type { InterventionStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const TRACKED = ROWS.filter((r) => needsAttention(r) || r.risk.level === 'MEDIUM').sort((a, b) => b.risk.score - a.risk.score)

type Filter = 'All' | InterventionStatus

export function InterventionsBoard() {
  const { getStatus, role, ready } = useStore()
  const [filter, setFilter] = useState<Filter>('All')

  const counts = useMemo(() => {
    const c: Record<InterventionStatus, number> = { Pending: 0, 'In Progress': 0, Completed: 0 }
    TRACKED.forEach((r) => (c[getStatus(r.student.id)] += 1))
    return c
    // getStatus identity changes whenever interventions change
  }, [getStatus])

  const visible = TRACKED.filter((r) => filter === 'All' || getStatus(r.student.id) === filter)
  const canEdit = role === 'admin' || role === 'faculty'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {STATUSES.map((status) => (
          <Card key={status} size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground">{status}</p>
              <p className="text-2xl font-semibold tabular-nums">{ready ? counts[status] : '–'}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList aria-label="Filter by status">
            {(['All', ...STATUSES] as Filter[]).map((f) => (
              <TabsTrigger key={f} value={f}>
                {f}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {!canEdit && ready && (
          <p className="text-xs text-muted-foreground">Read-only: only admins and faculty can update status.</p>
        )}
      </div>

      <ul className="space-y-3">
        {visible.map((r) => {
          const actions = recommendedActions(r.inputs, r.risk)
          return (
            <li key={r.student.id}>
              <Card size="sm">
                <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/students/${r.student.id}`}
                        className="rounded-sm font-medium hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                      >
                        {r.student.name}
                      </Link>
                      <RiskBadge level={r.risk.level} />
                      <span className={cn('text-xs tabular-nums text-muted-foreground')}>Score {r.risk.score}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {r.student.course} · Sem {r.student.semester}
                    </p>
                    {actions.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Next: </span>
                        {actions.map((a) => a.title).join(' · ')}
                      </p>
                    )}
                  </div>
                  <StatusControl studentId={r.student.id} studentName={r.student.name} />
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
      {visible.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground" role="status">
          No interventions with this status.
        </p>
      )}
    </div>
  )
}
