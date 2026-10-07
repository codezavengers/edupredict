import type { MonthlyRecord, RiskFactor, RiskInputs, RiskLevel, RiskResult, Student } from './types'

/**
 * Transparent, rule-based dropout risk model.
 *
 * Every factor has a weight (weights sum to 100) and a severity between 0 and 1 obtained by
 * linearly mapping the student's value between a "healthy" level (severity 0) and a "critical"
 * level (severity 1). Risk score = sum(weight * severity), so it is always within 0-100.
 *
 * For explainability each factor is compared with a neutral reference severity (0.35):
 * factors above it ADD risk, factors below it REDUCE risk, and
 * score = baseline (100 * 0.35 = 35) + sum of all factor deltas.
 */

export const NEUTRAL_SEVERITY = 0.35
export const BASELINE_RISK = 100 * NEUTRAL_SEVERITY

interface FactorConfig {
  key: RiskFactor['key']
  weight: number
  healthy: number
  critical: number
  riskLabel: string
  protectiveLabel: string
  neutralLabel: string
  describe: (value: number) => string
}

const pct = (v: number) => `${Math.round(v)}%`
const signed = (v: number) => `${v > 0 ? '+' : ''}${Math.round(v)}`

export const FACTOR_CONFIG: FactorConfig[] = [
  {
    key: 'attendance',
    weight: 22,
    healthy: 92,
    critical: 45,
    riskLabel: 'Low attendance',
    protectiveLabel: 'Strong attendance',
    neutralLabel: 'Average attendance',
    describe: (v) => `${pct(v)} attendance (healthy ≥ 92%, critical ≤ 45%)`,
  },
  {
    key: 'marks',
    weight: 20,
    healthy: 80,
    critical: 35,
    riskLabel: 'Low marks',
    protectiveLabel: 'Strong marks',
    neutralLabel: 'Average marks',
    describe: (v) => `${pct(v)} average marks (healthy ≥ 80%, critical ≤ 35%)`,
  },
  {
    key: 'assignment',
    weight: 16,
    healthy: 92,
    critical: 35,
    riskLabel: 'Missing assignments',
    protectiveLabel: 'Assignments on track',
    neutralLabel: 'Average assignment completion',
    describe: (v) => `${pct(v)} assignments completed (healthy ≥ 92%, critical ≤ 35%)`,
  },
  {
    key: 'lms',
    weight: 14,
    healthy: 80,
    critical: 20,
    riskLabel: 'Low LMS activity',
    protectiveLabel: 'Active on the LMS',
    neutralLabel: 'Average LMS activity',
    describe: (v) => `${pct(v)} LMS activity (healthy ≥ 80%, critical ≤ 20%)`,
  },
  {
    key: 'engagement',
    weight: 10,
    healthy: 80,
    critical: 25,
    riskLabel: 'Low engagement',
    protectiveLabel: 'High engagement',
    neutralLabel: 'Average engagement',
    describe: (v) => `${Math.round(v)}/100 engagement score (healthy ≥ 80, critical ≤ 25)`,
  },
  {
    key: 'trend',
    weight: 18,
    healthy: 5,
    critical: -20,
    riskLabel: 'Declining marks',
    protectiveLabel: 'Improving marks',
    neutralLabel: 'Stable marks',
    describe: (v) => `${signed(v)} pts vs. previous 3-month average (healthy ≥ +5, critical ≤ -20)`,
  },
]

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'HIGH'
  if (score >= 40) return 'MEDIUM'
  return 'LOW'
}

function valueFor(key: RiskFactor['key'], inputs: RiskInputs): number {
  switch (key) {
    case 'attendance':
      return inputs.attendance
    case 'marks':
      return inputs.marks
    case 'assignment':
      return inputs.assignment
    case 'lms':
      return inputs.lms
    case 'engagement':
      return inputs.engagement
    case 'trend':
      return inputs.marksTrend
  }
}

export function calculateRisk(inputs: RiskInputs): RiskResult {
  const factors: RiskFactor[] = FACTOR_CONFIG.map((cfg) => {
    const value = valueFor(cfg.key, inputs)
    const severity = clamp((cfg.healthy - value) / (cfg.healthy - cfg.critical))
    const delta = cfg.weight * (severity - NEUTRAL_SEVERITY)
    const impact: RiskFactor['impact'] = delta > 0.75 ? 'increase' : delta < -0.75 ? 'decrease' : 'neutral'
    const label =
      impact === 'increase' ? cfg.riskLabel : impact === 'decrease' ? cfg.protectiveLabel : cfg.neutralLabel
    return {
      key: cfg.key,
      label,
      weight: cfg.weight,
      severity,
      delta: Math.round(delta * 10) / 10,
      impact,
      detail: cfg.describe(value),
    }
  })

  const raw = FACTOR_CONFIG.reduce((sum, cfg) => {
    const value = valueFor(cfg.key, inputs)
    return sum + cfg.weight * clamp((cfg.healthy - value) / (cfg.healthy - cfg.critical))
  }, 0)
  const score = Math.round(clamp(raw, 0, 100))

  return {
    score,
    level: getRiskLevel(score),
    baseline: BASELINE_RISK,
    factors: [...factors].sort((a, b) => b.delta - a.delta),
  }
}

/** Marks of record `index` minus the average of up to 3 preceding records (0 for the first). */
export function marksTrendAt(history: MonthlyRecord[], index: number): number {
  if (index <= 0) return 0
  const previous = history.slice(Math.max(0, index - 3), index)
  const avg = previous.reduce((s, r) => s + r.marks, 0) / previous.length
  return history[index].marks - avg
}

export function inputsAt(student: Student, index: number): RiskInputs {
  const rec = student.history[index]
  return {
    attendance: rec.attendance,
    marks: rec.marks,
    assignment: rec.assignment,
    lms: rec.lms,
    engagement: rec.engagement,
    marksTrend: marksTrendAt(student.history, index),
  }
}

export function currentInputs(student: Student): RiskInputs {
  return inputsAt(student, student.history.length - 1)
}

export function riskAt(student: Student, index: number): RiskResult {
  return calculateRisk(inputsAt(student, index))
}

export function currentRisk(student: Student): RiskResult {
  return riskAt(student, student.history.length - 1)
}

/** Average of the marks in the 3 months before the latest record (used by the what-if simulator). */
export function priorMarksAverage(student: Student): number {
  const idx = student.history.length - 1
  const previous = student.history.slice(Math.max(0, idx - 3), idx)
  return previous.reduce((s, r) => s + r.marks, 0) / previous.length
}

export interface Simulation {
  attendance: number
  marks: number
  assignment: number
  lms: number
}

export function simulateRisk(student: Student, sim: Simulation): RiskResult {
  const base = currentInputs(student)
  return calculateRisk({
    ...base,
    attendance: sim.attendance,
    marks: sim.marks,
    assignment: sim.assignment,
    lms: sim.lms,
    marksTrend: sim.marks - priorMarksAverage(student),
  })
}

export interface RecommendedAction {
  title: string
  reason: string
}

export function recommendedActions(inputs: RiskInputs, result: RiskResult): RecommendedAction[] {
  const increasing = new Set(result.factors.filter((f) => f.impact === 'increase').map((f) => f.key))
  const actions: RecommendedAction[] = []

  if (increasing.has('attendance') || increasing.has('engagement')) {
    actions.push({
      title: 'Improve attendance',
      reason: `Attendance is ${Math.round(inputs.attendance)}%. Set a weekly attendance target and follow up on absences.`,
    })
  }
  if (increasing.has('assignment') || increasing.has('lms')) {
    actions.push({
      title: 'Complete pending assignments',
      reason: `Only ${Math.round(inputs.assignment)}% of assignments are complete and LMS activity is ${Math.round(inputs.lms)}%. Agree a catch-up plan with deadlines.`,
    })
  }
  if (increasing.has('marks') || increasing.has('trend')) {
    actions.push({
      title: 'Review weak subjects',
      reason: `Marks are ${Math.round(inputs.marks)}% (${signed(inputs.marksTrend)} pts recently). Identify weak subjects and arrange remedial sessions.`,
    })
  }
  if (result.level === 'HIGH' || (result.level === 'MEDIUM' && actions.length >= 3)) {
    actions.push({
      title: 'Faculty counseling',
      reason: 'Schedule a one-to-one session to discuss obstacles and agree on an academic support plan.',
    })
  }
  return actions
}
