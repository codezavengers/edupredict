import { cn } from '@/lib/utils'

export function RiskMeter({ score, className }: { score: number; className?: string }) {
  const clamped = Math.min(100, Math.max(0, score))
  return (
    <div className={cn('w-full', className)}>
      <div
        role="meter"
        aria-label="Dropout risk score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
        className="relative h-3 overflow-hidden rounded-full"
        style={{
          background:
            'linear-gradient(to right, var(--risk-low) 0%, var(--risk-low) 40%, var(--risk-medium) 40%, var(--risk-medium) 70%, var(--risk-high) 70%, var(--risk-high) 100%)',
        }}
      >
        <div className="absolute inset-y-0 right-0 bg-background/70 transition-all" style={{ width: `${100 - clamped}%` }} />
      </div>
      <div className="relative mt-1 h-4 text-[10px] text-muted-foreground">
        <span className="absolute left-0">0</span>
        <span className="absolute left-[40%] -translate-x-1/2">40 Medium</span>
        <span className="absolute left-[70%] -translate-x-1/2">70 High</span>
        <span className="absolute right-0">100</span>
      </div>
    </div>
  )
}
