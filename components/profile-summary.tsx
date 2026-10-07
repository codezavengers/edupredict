'use client'

import Link from 'next/link'
import { ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react'
import { MetricBar } from '@/components/metric-bar'
import { LEVEL_STYLES, RiskBadge } from '@/components/risk-badge'
import { RiskMeter } from '@/components/risk-meter'
import { StatusControl } from '@/components/status-control'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { StudentRow } from '@/lib/analytics'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const METRICS = [
  { key: 'attendance', label: 'Attendance' },
  { key: 'marks', label: 'Marks' },
  { key: 'assignment', label: 'Assignments' },
  { key: 'lms', label: 'LMS activity' },
  { key: 'engagement', label: 'Engagement' },
] as const

export function ProfileSummary({ row }: { row: StudentRow }) {
  const { role } = useStore()
  const { student, risk, current, scoreChange } = row
  const isStudent = role === 'student'

  return (
    <div className="space-y-4">
      {!isStudent && (
        <Link href="/students" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), '-ml-2')}>
          <ArrowLeft aria-hidden="true" /> All students
        </Link>
      )}
      <Card>
        <CardContent className="grid gap-6 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div className="flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
            <div className="min-w-0">
              <h1 className="text-balance text-2xl font-semibold tracking-tight">{student.name}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {student.id} · {student.course} · Semester {student.semester}
              </p>
              {risk.level !== 'LOW' || !isStudent ? (
                <div className="mt-3 space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Intervention status</p>
                  <StatusControl studentId={student.id} studentName={student.name} />
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">Dropout risk score</p>
            <div className="mt-1 flex items-baseline gap-3">
              <span className={cn('text-5xl font-semibold tabular-nums', LEVEL_STYLES[risk.level].text)}>{risk.score}</span>
              <RiskBadge level={risk.level} />
            </div>
            <p
              className={cn(
                'mt-1 inline-flex items-center gap-1 text-xs',
                scoreChange > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400',
              )}
            >
              {scoreChange > 0 ? (
                <TrendingUp className="size-3.5" aria-hidden="true" />
              ) : (
                <TrendingDown className="size-3.5" aria-hidden="true" />
              )}
              {scoreChange === 0 ? 'No change' : `${scoreChange > 0 ? '+' : ''}${scoreChange} points`} since last month
            </p>
            <RiskMeter score={risk.score} className="mt-3" />
          </div>

          <dl className="space-y-2.5">
            {METRICS.map(({ key, label }) => (
              <div key={key} className="grid grid-cols-[6.5rem_1fr] items-center gap-2">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd>
                  <MetricBar value={current[key]} label={label} />
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
