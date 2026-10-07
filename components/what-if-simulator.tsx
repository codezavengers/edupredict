'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { LEVEL_STYLES, RiskBadge } from '@/components/risk-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { currentInputs, simulateRisk, type Simulation } from '@/lib/risk'
import type { Student } from '@/lib/types'
import { cn } from '@/lib/utils'

const CONTROLS: { key: keyof Simulation; label: string }[] = [
  { key: 'attendance', label: 'Attendance' },
  { key: 'marks', label: 'Marks' },
  { key: 'assignment', label: 'Assignment completion' },
  { key: 'lms', label: 'LMS activity' },
]

export function WhatIfSimulator({ student }: { student: Student }) {
  const initial = useMemo<Simulation>(() => {
    const i = currentInputs(student)
    return {
      attendance: Math.round(i.attendance),
      marks: Math.round(i.marks),
      assignment: Math.round(i.assignment),
      lms: Math.round(i.lms),
    }
  }, [student])

  const [sim, setSim] = useState<Simulation>(initial)
  const before = useMemo(() => simulateRisk(student, initial), [student, initial])
  const after = useMemo(() => simulateRisk(student, sim), [student, sim])
  const diff = after.score - before.score
  const changed = CONTROLS.some(({ key }) => sim[key] !== initial[key])

  return (
    <Card>
      <CardHeader>
        <CardTitle>What-if simulator</CardTitle>
        <CardDescription>Drag the sliders to see how improving a metric would change the risk score.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {CONTROLS.map(({ key, label }) => (
            <div key={key} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label>{label}</Label>
                <span className="text-sm tabular-nums">
                  <span className="text-muted-foreground">{initial[key]}% →</span>{' '}
                  <span className="font-semibold">{sim[key]}%</span>
                </span>
              </div>
              <Slider
                aria-label={label}
                min={0}
                max={100}
                step={1}
                value={[sim[key]]}
                onValueChange={(v) => {
                  const next = Array.isArray(v) ? v[0] : v
                  setSim((prev) => ({ ...prev, [key]: next }))
                }}
              />
            </div>
          ))}
        </div>

        <div
          className="flex flex-wrap items-center gap-4 rounded-xl bg-muted/60 p-4"
          role="status"
          aria-live="polite"
        >
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Current</p>
            <p className={cn('text-2xl font-semibold tabular-nums', LEVEL_STYLES[before.level].text)}>{before.score}</p>
          </div>
          <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Simulated</p>
            <p className={cn('text-2xl font-semibold tabular-nums', LEVEL_STYLES[after.level].text)}>{after.score}</p>
          </div>
          <RiskBadge level={after.level} />
          <p className="min-w-40 flex-1 text-sm">
            {!changed
              ? 'Move a slider to explore a scenario.'
              : diff < 0
                ? `Risk falls by ${Math.abs(diff)} points${after.level !== before.level ? `, moving to ${after.level} risk` : ''}.`
                : diff > 0
                  ? `Risk rises by ${diff} points.`
                  : 'No change in risk score.'}
          </p>
          <Button variant="outline" size="sm" disabled={!changed} onClick={() => setSim(initial)}>
            <RotateCcw aria-hidden="true" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
