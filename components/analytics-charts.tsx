'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltip } from '@/components/chart-tooltip'

const AXIS = { fontSize: 12, fill: 'var(--muted-foreground)' }
const GRID = <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
const LEGEND = <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />

export function CohortTrendChart({
  data,
}: {
  data: { month: string; avgRisk: number; avgAttendance: number; avgMarks: number; avgEngagement: number }[]
}) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Line chart of cohort averages over six months">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          {GRID}
          <XAxis dataKey="month" tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} tick={AXIS} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} />
          {LEGEND}
          <Line type="monotone" dataKey="avgRisk" name="Avg risk" stroke="var(--risk-high)" strokeWidth={2.5} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="avgAttendance" name="Attendance" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="avgMarks" name="Marks" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="avgEngagement" name="Engagement" stroke="var(--chart-4)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AttendanceImpactChart({ data }: { data: { band: string; students: number; avgMarks: number; avgRisk: number }[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Bar chart of average marks and risk by attendance band">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          {GRID}
          <XAxis dataKey="band" tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} tick={AXIS} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.5 }} />
          {LEGEND}
          <Bar dataKey="avgMarks" name="Avg marks" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="avgRisk" name="Avg risk" fill="var(--risk-high)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function FactorImpactChart({ data }: { data: { label: string; avgDelta: number }[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Bar chart of average risk points added by each factor">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
          <XAxis type="number" tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="label" tick={AXIS} tickLine={false} axisLine={false} width={120} />
          <Tooltip content={<ChartTooltip suffix=" pts" />} cursor={{ fill: 'var(--muted)', opacity: 0.5 }} />
          <Bar dataKey="avgDelta" name="Avg points added" radius={4}>
            {data.map((d) => (
              <Cell key={d.label} fill={d.avgDelta > 0 ? 'var(--risk-high)' : 'var(--risk-low)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CourseComparisonChart({
  data,
}: {
  data: { course: string; avgAttendance: number; avgMarks: number; avgLms: number; avgEngagement: number }[]
}) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Grouped bar chart comparing courses on key metrics">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          {GRID}
          <XAxis
            dataKey="course"
            tick={AXIS}
            tickLine={false}
            axisLine={false}
            interval={0}
            tickFormatter={(value: string) => value.split(' ')[0]}
          />
          <YAxis domain={[0, 100]} tick={AXIS} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.5 }} />
          {LEGEND}
          <Bar dataKey="avgAttendance" name="Attendance" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
          <Bar dataKey="avgMarks" name="Marks" fill="var(--chart-2)" radius={[3, 3, 0, 0]} />
          <Bar dataKey="avgLms" name="LMS" fill="var(--chart-3)" radius={[3, 3, 0, 0]} />
          <Bar dataKey="avgEngagement" name="Engagement" fill="var(--chart-4)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
