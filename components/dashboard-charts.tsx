'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltip } from '@/components/chart-tooltip'
import type { RiskLevel } from '@/lib/types'

const LEVEL_COLOR: Record<RiskLevel, string> = {
  LOW: 'var(--risk-low)',
  MEDIUM: 'var(--risk-medium)',
  HIGH: 'var(--risk-high)',
}
const LEVEL_NAME: Record<RiskLevel, string> = { LOW: 'Low risk', MEDIUM: 'Medium risk', HIGH: 'High risk' }
const AXIS = { fontSize: 12, fill: 'var(--muted-foreground)' }

export function RiskDonut({ counts }: { counts: Record<RiskLevel, number> }) {
  const data = (['HIGH', 'MEDIUM', 'LOW'] as RiskLevel[]).map((level) => ({
    level,
    name: LEVEL_NAME[level],
    value: counts[level],
  }))
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-52 w-52 shrink-0" role="img" aria-label={`Risk distribution: ${data.map((d) => `${d.value} ${d.name}`).join(', ')}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3} stroke="none">
              {data.map((d) => (
                <Cell key={d.level} fill={LEVEL_COLOR[d.level]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip suffix=" students" />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums">{total}</span>
          <span className="text-xs text-muted-foreground">students</span>
        </div>
      </div>
      <ul className="w-full space-y-3">
        {data.map((d) => (
          <li key={d.level} className="flex items-center gap-3 text-sm">
            <span className="size-3 rounded-sm" style={{ background: LEVEL_COLOR[d.level] }} aria-hidden="true" />
            <span className="flex-1">{d.name}</span>
            <span className="font-medium tabular-nums">{d.value}</span>
            <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface TrendPoint {
  month: string
  LOW: number
  MEDIUM: number
  HIGH: number
}

export function RiskTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-64 w-full" role="img" aria-label="Stacked area chart of students per risk level by month">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="month" tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="HIGH" name="High" stackId="1" stroke={LEVEL_COLOR.HIGH} fill={LEVEL_COLOR.HIGH} fillOpacity={0.75} />
          <Area type="monotone" dataKey="MEDIUM" name="Medium" stackId="1" stroke={LEVEL_COLOR.MEDIUM} fill={LEVEL_COLOR.MEDIUM} fillOpacity={0.75} />
          <Area type="monotone" dataKey="LOW" name="Low" stackId="1" stroke={LEVEL_COLOR.LOW} fill={LEVEL_COLOR.LOW} fillOpacity={0.75} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

interface CoursePoint {
  course: string
  LOW: number
  MEDIUM: number
  HIGH: number
}

export function CourseRiskChart({ data }: { data: CoursePoint[] }) {
  return (
    <div className="h-64 w-full" role="img" aria-label="Stacked bar chart of risk levels per course">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
          <XAxis type="number" tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis type="category" dataKey="course" tick={AXIS} tickLine={false} axisLine={false} width={110} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.5 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="HIGH" name="High" stackId="a" fill={LEVEL_COLOR.HIGH} />
          <Bar dataKey="MEDIUM" name="Medium" stackId="a" fill={LEVEL_COLOR.MEDIUM} />
          <Bar dataKey="LOW" name="Low" stackId="a" fill={LEVEL_COLOR.LOW} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
