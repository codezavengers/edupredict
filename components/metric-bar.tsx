import { cn } from '@/lib/utils'

function toneFor(value: number) {
  if (value >= 75) return 'bg-emerald-500'
  if (value >= 55) return 'bg-amber-500'
  return 'bg-rose-500'
}

interface MetricBarProps {
  value: number
  label: string
  showValue?: boolean
  className?: string
  barClassName?: string
}

export function MetricBar({ value, label, showValue = true, className, barClassName }: MetricBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
        className="h-1.5 min-w-12 flex-1 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn('h-full rounded-full transition-all', barClassName ?? toneFor(clamped))}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showValue && <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{Math.round(clamped)}%</span>}
    </div>
  )
}
