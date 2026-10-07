import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BASELINE_RISK } from '@/lib/risk'
import type { RiskResult } from '@/lib/types'
import { cn } from '@/lib/utils'

export function FactorExplanation({ risk }: { risk: RiskResult }) {
  const factors = [...risk.factors].sort((a, b) => b.delta - a.delta)
  const maxDelta = Math.max(...factors.map((f) => Math.abs(f.delta)), 1)
  const top = factors.filter((f) => f.impact === 'increase').slice(0, 2)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Why this score?</CardTitle>
        <CardDescription>
          {top.length > 0
            ? `Mainly driven by ${top.map((f) => f.label.toLowerCase()).join(' and ')}.`
            : 'No factor is pushing risk above the baseline.'}{' '}
          Score = baseline {BASELINE_RISK} + the points each factor adds or removes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {factors.map((f) => {
            const Icon = f.impact === 'increase' ? ArrowUp : f.impact === 'decrease' ? ArrowDown : Minus
            const tone =
              f.impact === 'increase'
                ? 'text-rose-600 dark:text-rose-400'
                : f.impact === 'decrease'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground'
            return (
              <li key={f.key}>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Icon className={cn('size-4', tone)} aria-hidden="true" />
                    {f.label}
                  </span>
                  <span className={cn('text-sm font-semibold tabular-nums', tone)}>
                    {f.delta > 0 ? '+' : ''}
                    {f.delta.toFixed(1)} pts
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      f.impact === 'increase' ? 'bg-rose-500' : f.impact === 'decrease' ? 'bg-emerald-500' : 'bg-muted-foreground/40',
                    )}
                    style={{ width: `${Math.max(4, (Math.abs(f.delta) / maxDelta) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{f.detail}</p>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
