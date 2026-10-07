import type { InterventionStatus, MonthlyRecord, Student } from './types'

export const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] as const

export const COURSES = [
  'Computer Science',
  'Data Science',
  'Electronics',
  'Business Admin',
  'Mechanical Eng.',
] as const

/**
 * [name, course, semester, attendance, marks, assignment, lms, engagement, marksTrendPerMonth]
 * The first five numbers are the CURRENT (October) values. The monthly trend is used to derive a
 * deterministic 6-month history ending at those values (no runtime randomness).
 */
type Seed = [string, (typeof COURSES)[number], number, number, number, number, number, number, number]

const SEEDS: Seed[] = [
  // Likely high risk
  ['Rohan Mehta', 'Computer Science', 3, 54, 41, 38, 24, 28, -5],
  ['Kavya Nair', 'Business Admin', 5, 58, 46, 45, 32, 35, -4],
  ['Arjun Malhotra', 'Mechanical Eng.', 3, 49, 38, 30, 18, 22, -6],
  ['Sneha Kulkarni', 'Electronics', 5, 56, 44, 46, 30, 34, -4],
  ['Imran Sheikh', 'Data Science', 1, 52, 44, 40, 28, 30, -5],
  ['Vikram Chauhan', 'Business Admin', 3, 47, 36, 33, 20, 25, -7],
  ['Neha Bansal', 'Computer Science', 5, 57, 47, 42, 26, 33, -4],
  // Likely medium risk
  ['Aditya Rao', 'Computer Science', 3, 72, 58, 64, 52, 55, -2],
  ['Pooja Iyer', 'Data Science', 3, 68, 61, 58, 48, 50, -3],
  ['Mohit Verma', 'Electronics', 1, 72, 53, 58, 50, 54, -2],
  ['Ananya Das', 'Business Admin', 5, 70, 64, 60, 45, 52, -2],
  ['Siddharth Joshi', 'Mechanical Eng.', 5, 62, 52, 50, 42, 44, -4],
  ['Fatima Khan', 'Data Science', 1, 75, 58, 63, 54, 57, -2],
  ['Karan Bhatia', 'Computer Science', 7, 70, 63, 60, 47, 52, -2],
  ['Meera Reddy', 'Electronics', 3, 63, 55, 54, 43, 47, -3],
  ['Tanvi Deshmukh', 'Business Admin', 7, 70, 59, 61, 50, 54, -2],
  // Likely low risk
  ['Priya Sharma', 'Computer Science', 5, 94, 88, 96, 90, 86, 2],
  ['Aarav Patel', 'Data Science', 3, 91, 82, 92, 85, 80, 1],
  ['Ishita Gupta', 'Electronics', 5, 89, 79, 90, 78, 76, 2],
  ['Rahul Singh', 'Mechanical Eng.', 3, 86, 74, 85, 72, 70, 0],
  ['Sana Qureshi', 'Business Admin', 1, 92, 85, 94, 88, 84, 1],
  ['Dev Agarwal', 'Computer Science', 7, 84, 77, 82, 70, 68, 1],
  ['Lakshmi Menon', 'Data Science', 5, 95, 91, 98, 93, 90, 3],
  ['Nikhil Chopra', 'Mechanical Eng.', 7, 82, 70, 80, 66, 65, 0],
  ['Zoya Ahmed', 'Electronics', 1, 88, 80, 88, 80, 78, 2],
  ['Harsh Vardhan', 'Business Admin', 3, 80, 72, 78, 64, 62, 0],
  ['Riya Banerjee', 'Data Science', 7, 77, 68, 74, 60, 60, 1],
  ['Omar Farooq', 'Computer Science', 1, 85, 76, 84, 74, 72, 0],
]

const clamp = (v: number) => Math.min(100, Math.max(0, Math.round(v)))

/** Deterministic pseudo-noise in [-1, 1] so that every build produces identical data. */
const noise = (studentIdx: number, monthIdx: number, metricIdx: number) =>
  Math.sin(studentIdx * 7.31 + monthIdx * 2.17 + metricIdx * 1.73)

function buildHistory(seed: Seed, studentIdx: number): MonthlyRecord[] {
  const [, , , attendance, marks, assignment, lms, engagement, trend] = seed
  const last = MONTHS.length - 1
  return MONTHS.map((month, m) => {
    const monthsAgo = last - m
    const value = (current: number, slope: number, metricIdx: number, amplitude: number) =>
      monthsAgo === 0
        ? current
        : clamp(current - slope * monthsAgo + noise(studentIdx, m, metricIdx) * amplitude)
    return {
      month,
      attendance: value(attendance, trend * 0.9, 0, 2.5),
      marks: value(marks, trend, 1, 2),
      assignment: value(assignment, trend * 1.1, 2, 3),
      lms: value(lms, trend * 1.3, 3, 3),
      engagement: value(engagement, trend * 0.8, 4, 2.5),
    }
  })
}

export const STUDENTS: Student[] = SEEDS.map((seed, i) => ({
  id: `STU-${2401 + i}`,
  name: seed[0],
  course: seed[1],
  semester: seed[2],
  history: buildHistory(seed, i),
}))

export const STUDENT_BY_ID: Record<string, Student> = Object.fromEntries(STUDENTS.map((s) => [s.id, s]))

/** The student shown when the demo "Student" role is selected. */
export const DEMO_STUDENT_ID = 'STU-2408'

export const DEFAULT_INTERVENTIONS: Record<string, InterventionStatus> = {
  'STU-2401': 'In Progress',
  'STU-2403': 'Pending',
  'STU-2406': 'Completed',
}
