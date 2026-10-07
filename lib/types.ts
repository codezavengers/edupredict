export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type Role = 'admin' | 'faculty' | 'student'
export type InterventionStatus = 'Pending' | 'In Progress' | 'Completed'

export interface MonthlyRecord {
  month: string
  attendance: number
  marks: number
  assignment: number
  lms: number
  engagement: number
}

export interface Student {
  id: string
  name: string
  course: string
  semester: number
  history: MonthlyRecord[]
}

export interface RiskInputs {
  attendance: number
  marks: number
  assignment: number
  lms: number
  engagement: number
  /** Latest marks minus the average of the previous (up to) 3 months. */
  marksTrend: number
}

export interface RiskFactor {
  key: 'attendance' | 'marks' | 'assignment' | 'lms' | 'engagement' | 'trend'
  label: string
  weight: number
  /** 0 (no risk) to 1 (maximum risk) */
  severity: number
  /** Points added to (+) or removed from (-) the baseline risk. */
  delta: number
  impact: 'increase' | 'decrease' | 'neutral'
  detail: string
}

export interface RiskResult {
  score: number
  level: RiskLevel
  baseline: number
  factors: RiskFactor[]
}

export interface Intervention {
  status: InterventionStatus
  updatedAt: string
}
