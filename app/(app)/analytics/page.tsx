import type { Metadata } from 'next'
import { Lightbulb } from 'lucide-react'
import {
  AttendanceImpactChart,
  CohortTrendChart,
  CourseComparisonChart,
  FactorImpactChart,
} from '@/components/analytics-charts'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { attendanceBands, courseStats, factorImpact, monthlyRiskTrend } from '@/lib/analytics'

export const metadata: Metadata = {
  title: 'Analytics · EduPredict AI',
  description: 'Cohort trends, course comparisons and the factors driving dropout risk.',
}

export default function AnalyticsPage() {
  const trend = monthlyRiskTrend()
  const bands = attendanceBands()
  const factors = factorImpact()
  const courses = courseStats()

  const worstCourse = [...courses].sort((a, b) => b.avgRisk - a.avgRisk)[0]
  const topFactor = factors[0]
  const lowBand = bands.find((b) => b.students > 0)
  const highBand = [...bands].reverse().find((b) => b.students > 0)
  const first = trend[0]
  const last = trend[trend.length - 1]

  const insights = [
    `${topFactor.label} adds the most risk on average (+${topFactor.avgDelta} pts per student).`,
    `${worstCourse.course} has the highest average risk (${worstCourse.avgRisk}) and ${worstCourse.HIGH} high-risk students.`,
    lowBand && highBand && lowBand.band !== highBand.band
      ? `Students with ${highBand.band} attendance average ${highBand.avgMarks}% marks, versus ${lowBand.avgMarks}% for ${lowBand.band}.`
      : 'Attendance bands are evenly distributed.',
    `Average cohort risk moved from ${first.avgRisk} in ${first.month} to ${last.avgRisk} in ${last.month}.`,
  ]

  return (
    <>
      <PageHeader
        title="Analytics"
        description="See how attendance, marks and engagement relate to dropout risk across the cohort."
      />

      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="size-4 text-primary" aria-hidden="true" /> Key insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-x-8 gap-y-2 text-sm md:grid-cols-2">
            {insights.map((text) => (
              <li key={text} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cohort trend</CardTitle>
            <CardDescription>Monthly averages across all students</CardDescription>
          </CardHeader>
          <CardContent>
            <CohortTrendChart data={trend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance vs performance</CardTitle>
            <CardDescription>Average marks and risk grouped by attendance band</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceImpactChart data={bands} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>What drives risk</CardTitle>
            <CardDescription>Average points each factor adds (red) or removes (green)</CardDescription>
          </CardHeader>
          <CardContent>
            <FactorImpactChart data={factors} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Course comparison</CardTitle>
            <CardDescription>Average engagement metrics per course</CardDescription>
          </CardHeader>
          <CardContent>
            <CourseComparisonChart data={courses} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
