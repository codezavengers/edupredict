'use client'

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from '@/components/chart-tooltip'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Point {
  month: string
  risk: number
  attendance: number
  marks: number
}

const AXIS = { fontSize: 12, fill: 'var(--muted-foreground)' }

export function StudentTrendChart({ data }: { data: Point[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Six-month trend</CardTitle>
        <CardDescription>Risk score compared with attendance and marks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full" role="img" aria-label="Line chart of risk, attendance and marks over six months">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={AXIS} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={AXIS} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="risk" name="Risk score" stroke="var(--risk-high)" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="attendance" name="Attendance" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="marks" name="Marks" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
