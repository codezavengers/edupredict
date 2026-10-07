import { COURSES, MONTHS, STUDENTS } from './data'
import { calculateRisk, currentInputs, currentRisk, inputsAt, riskAt } from './risk'
import type { MonthlyRecord, RiskInputs, RiskLevel, RiskResult, Student } from './types'

export interface StudentRow {
  student: Student
  current: MonthlyRecord
  inputs: RiskInputs
  risk: RiskResult
  previousScore: number
  scoreChange: number
}

export const ROWS: StudentRow[] = STUDENTS.map((student) => {
  const risk = currentRisk(student)
  const lastIdx = student.history.length - 1
  const previousScore = riskAt(student, lastIdx - 1).score
  return {
    student,
    current: student.history[lastIdx],
    inputs: currentInputs(student),
    risk,
    previousScore,
    scoreChange: risk.score - previousScore,
  }
})

export const ROW_BY_ID: Record<string, StudentRow> = Object.fromEntries(ROWS.map((r) => [r.student.id, r]))

export const LEVELS: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH']

const avg = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0)

export function riskCounts(rows: StudentRow[] = ROWS): Record<RiskLevel, number> {
  const counts: Record<RiskLevel, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 }
  rows.forEach((r) => (counts[r.risk.level] += 1))
  return counts
}

/** Students needing attention: HIGH risk, or risk that rose by 10+ points in the last month. */
export function needsAttention(row: StudentRow): boolean {
  return row.risk.level === 'HIGH' || row.scoreChange >= 10
}

export function overviewStats() {
  const counts = riskCounts()
  return {
    total: ROWS.length,
    counts,
    avgAttendance: avg(ROWS.map((r) => r.current.attendance)),
    avgMarks: avg(ROWS.map((r) => r.current.marks)),
    avgRisk: avg(ROWS.map((r) => r.risk.score)),
    needingAttention: ROWS.filter(needsAttention).length,
  }
}

export function monthlyRiskTrend() {
  return MONTHS.map((month, idx) => {
    const results = STUDENTS.map((s) => riskAt(s, idx))
    return {
      month,
      LOW: results.filter((r) => r.level === 'LOW').length,
      MEDIUM: results.filter((r) => r.level === 'MEDIUM').length,
      HIGH: results.filter((r) => r.level === 'HIGH').length,
      avgRisk: Math.round(avg(results.map((r) => r.score)) * 10) / 10,
      avgAttendance: Math.round(avg(STUDENTS.map((s) => s.history[idx].attendance)) * 10) / 10,
      avgMarks: Math.round(avg(STUDENTS.map((s) => s.history[idx].marks)) * 10) / 10,
      avgEngagement: Math.round(avg(STUDENTS.map((s) => s.history[idx].engagement)) * 10) / 10,
    }
  })
}

export function courseStats() {
  return COURSES.map((course) => {
    const rows = ROWS.filter((r) => r.student.course === course)
    const counts = riskCounts(rows)
    return {
      course,
      students: rows.length,
      avgRisk: Math.round(avg(rows.map((r) => r.risk.score))),
      avgAttendance: Math.round(avg(rows.map((r) => r.current.attendance))),
      avgMarks: Math.round(avg(rows.map((r) => r.current.marks))),
      avgLms: Math.round(avg(rows.map((r) => r.current.lms))),
      avgEngagement: Math.round(avg(rows.map((r) => r.current.engagement))),
      ...counts,
    }
  })
}

/** Average risk points each factor adds (+) or removes (-) across the whole cohort. */
export function factorImpact() {
  const keys = ROWS[0].risk.factors.map((f) => f.key)
  return keys
    .map((key) => {
      const factors = ROWS.map((r) => r.risk.factors.find((f) => f.key === key)!)
      const sample = factors[0]
      return {
        key,
        label: sample.label,
        weight: sample.weight,
        avgDelta: Math.round(avg(factors.map((f) => f.delta)) * 10) / 10,
        driving: factors.filter((f) => f.impact === 'increase').length,
      }
    })
    .sort((a, b) => b.avgDelta - a.avgDelta)
}

export const FACTOR_NAMES: Record<string, string> = {
  attendance: 'Attendance',
  marks: 'Marks',
  assignment: 'Assignments',
  lms: 'LMS activity',
  engagement: 'Engagement',
  trend: 'Recent marks trend',
}

export function attendanceBands() {
  const bands = [
    { band: '< 60%', min: 0, max: 60 },
    { band: '60–74%', min: 60, max: 75 },
    { band: '75–89%', min: 75, max: 90 },
    { band: '90%+', min: 90, max: 101 },
  ]
  return bands.map(({ band, min, max }) => {
    const rows = ROWS.filter((r) => r.current.attendance >= min && r.current.attendance < max)
    return {
      band,
      students: rows.length,
      avgMarks: Math.round(avg(rows.map((r) => r.current.marks))),
      avgRisk: Math.round(avg(rows.map((r) => r.risk.score))),
    }
  })
}

export { calculateRisk, inputsAt }
