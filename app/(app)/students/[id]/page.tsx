import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FactorExplanation } from '@/components/factor-explanation'
import { ProfileSummary } from '@/components/profile-summary'
import { RecommendedActions } from '@/components/recommended-actions'
import { StudentTrendChart } from '@/components/student-trend-chart'
import { WhatIfSimulator } from '@/components/what-if-simulator'
import { ROW_BY_ID, ROWS } from '@/lib/analytics'
import { riskAt, recommendedActions } from '@/lib/risk'

export function generateStaticParams() {
  return ROWS.map((r) => ({ id: r.student.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const row = ROW_BY_ID[id]
  return { title: row ? `${row.student.name} · EduPredict AI` : 'Student not found' }
}

export default async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const row = ROW_BY_ID[id]
  if (!row) notFound()

  const { student, risk, inputs } = row
  const trend = student.history.map((h, i) => ({
    month: h.month,
    risk: riskAt(student, i).score,
    attendance: Math.round(h.attendance),
    marks: Math.round(h.marks),
  }))
  const actions = recommendedActions(inputs, risk)

  return (
    <>
      <ProfileSummary row={row} />
      <div className="grid gap-4 lg:grid-cols-2">
        <FactorExplanation risk={risk} />
        <div className="space-y-4">
          <RecommendedActions actions={actions} />
          <StudentTrendChart data={trend} />
        </div>
      </div>
      <WhatIfSimulator student={student} />
    </>
  )
}
