'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { MetricBar } from '@/components/metric-bar'
import { RiskBadge } from '@/components/risk-badge'
import { STATUS_BADGE } from '@/components/status-control'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ROWS } from '@/lib/analytics'
import { COURSES } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const COURSE_ITEMS = [{ value: 'all', label: 'All courses' }, ...COURSES.map((c) => ({ value: c, label: c }))]
const RISK_ITEMS = [
  { value: 'all', label: 'All risk levels' },
  { value: 'HIGH', label: 'High risk' },
  { value: 'MEDIUM', label: 'Medium risk' },
  { value: 'LOW', label: 'Low risk' },
]
const SORT_ITEMS = [
  { value: 'risk', label: 'Risk: high to low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: 'attendance', label: 'Attendance: low to high' },
  { value: 'marks', label: 'Marks: low to high' },
]

function FilterSelect({
  label,
  items,
  value,
  onChange,
  className,
}: {
  label: string
  items: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <Select items={items} value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger aria-label={label} className={cn('w-full sm:w-44', className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function StudentsTable() {
  const { getStatus } = useStore()
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState('all')
  const [risk, setRisk] = useState('all')
  const [sort, setSort] = useState('risk')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = ROWS.filter(
      (r) =>
        (course === 'all' || r.student.course === course) &&
        (risk === 'all' || r.risk.level === risk) &&
        (!q || r.student.name.toLowerCase().includes(q) || r.student.id.toLowerCase().includes(q)),
    )
    return filtered.sort((a, b) => {
      if (sort === 'name') return a.student.name.localeCompare(b.student.name)
      if (sort === 'attendance') return a.current.attendance - b.current.attendance
      if (sort === 'marks') return a.current.marks - b.current.marks
      return b.risk.score - a.risk.score
    })
  }, [query, course, risk, sort])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or ID"
            aria-label="Search students"
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:flex">
          <FilterSelect label="Filter by course" items={COURSE_ITEMS} value={course} onChange={setCourse} />
          <FilterSelect label="Filter by risk level" items={RISK_ITEMS} value={risk} onChange={setRisk} />
          <FilterSelect label="Sort students" items={SORT_ITEMS} value={sort} onChange={setSort} className="sm:w-52" />
        </div>
      </div>

      <Card className="gap-0 p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Student</TableHead>
              <TableHead className="hidden md:table-cell">Course</TableHead>
              <TableHead className="min-w-28">Attendance</TableHead>
              <TableHead className="hidden min-w-28 lg:table-cell">Marks</TableHead>
              <TableHead className="hidden min-w-28 xl:table-cell">Assignments</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead className="hidden pr-4 sm:table-cell">Intervention</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => {
              const status = getStatus(r.student.id)
              return (
                <TableRow key={r.student.id}>
                  <TableCell className="pl-4">
                    <Link
                      href={`/students/${r.student.id}`}
                      className="block rounded-sm font-medium hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      {r.student.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {r.student.id} · Sem {r.student.semester}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{r.student.course}</TableCell>
                  <TableCell>
                    <MetricBar value={r.current.attendance} label={`${r.student.name} attendance`} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <MetricBar value={r.current.marks} label={`${r.student.name} marks`} />
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <MetricBar value={r.current.assignment} label={`${r.student.name} assignments`} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-sm font-semibold tabular-nums">{r.risk.score}</span>
                      <RiskBadge level={r.risk.level} />
                    </div>
                  </TableCell>
                  <TableCell className="hidden pr-4 sm:table-cell">
                    {r.risk.level === 'LOW' && status === 'Pending' ? (
                      <span className="text-xs text-muted-foreground">Not required</span>
                    ) : (
                      <Badge variant="ghost" className={STATUS_BADGE[status]}>
                        {status}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {rows.length === 0 && (
          <p className="p-10 text-center text-sm text-muted-foreground" role="status">
            No students match your filters.
          </p>
        )}
      </Card>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        Showing {rows.length} of {ROWS.length} students
      </p>
    </div>
  )
}
