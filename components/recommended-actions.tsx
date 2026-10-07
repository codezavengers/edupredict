'use client'

import { CheckCircle2, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { RecommendedAction } from '@/lib/risk'
import { useStore } from '@/lib/store'

export function RecommendedActions({ actions }: { actions: RecommendedAction[] }) {
  const { role } = useStore()
  const firstPerson = role === 'student'
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="size-4 text-primary" aria-hidden="true" />
          {firstPerson ? 'Your improvement plan' : 'Recommended interventions'}
        </CardTitle>
        <CardDescription>Generated from the factors that are raising risk.</CardDescription>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            {firstPerson ? 'You are on track. Keep it up!' : 'On track. No intervention needed right now.'}
          </p>
        ) : (
          <ol className="space-y-3">
            {actions.map((action, i) => (
              <li key={action.title} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{action.reason}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
