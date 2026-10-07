interface TooltipEntry {
  name?: string | number
  value?: string | number | readonly (string | number)[]
  color?: string
  dataKey?: string | number
}

interface ChartTooltipProps {
  active?: boolean
  label?: string | number
  payload?: readonly TooltipEntry[]
  suffix?: string
}

export function ChartTooltip({ active, label, payload, suffix = '' }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
      {label !== undefined && <p className="mb-1 font-medium">{label}</p>}
      <ul className="space-y-0.5">
        {payload.map((entry, i) => (
          <li key={`${entry.dataKey ?? entry.name}-${i}`} className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ background: entry.color }} aria-hidden="true" />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ml-auto pl-3 font-medium tabular-nums">
              {String(entry.value)}
              {suffix}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
