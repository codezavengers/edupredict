import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, BookOpenCheck, CalendarCheck, ShieldCheck, Users } from 'lucide-react'
import { AttentionList } from '@/components/attention-list'
import { CourseRiskChart, RiskDonut, RiskTrendChart } from '@/components/dashboard-charts'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROWS, courseStats, monthlyRiskTrend, needsAttention, overviewStats } from '@/lib/analytics'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Dashboard · EduPredict AI',
  description: 'Overview of student dropout risk, attendance and academic performance.',
}

export default function DashboardPage() {
  const stats = overviewStats()
  const trend = monthlyRiskTrend()
  const courses = courseStats()
  const attention = ROWS.filter(needsAttention)
    .sort((a, b) => b.risk.score - a.risk.score)
    .slice(0, 6)

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A live overview of dropout risk across all courses. Scores update from attendance, marks, assignments, LMS activity and engagement."
        actions={
          <Link href="/students" className={cn(buttonVariants({ variant: 'outline' }), 'self-start')}>
            View all students <ArrowRight aria-hidden="true" />
          </Link>
        }
      />

      <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total students" value={stats.total} hint="Across 5 courses" icon={Users} />
        <StatCard
          label="High risk"
          value={stats.counts.HIGH}
          hint={`${stats.needingAttention} need attention`}
          icon={AlertTriangle}
          iconClassName="bg-rose-500/15 text-rose-600 dark:text-rose-400"
        />
        <StatCard
          label="Low risk"
          value={stats.counts.LOW}
          hint={`${Math.round((stats.counts.LOW / stats.total) * 100)}% of cohort`}
          icon={ShieldCheck}
          iconClassName="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard label="Avg attendance" value={`${Math.round(stats.avgAttendance)}%`} hint="Latest month" icon={CalendarCheck} />
        <StatCard label="Avg marks" value={`${Math.round(stats.avgMarks)}%`} hint="Latest month" icon={BookOpenCheck} />
      </section>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Risk distribution</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskDonut counts={stats.counts} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Risk trend</CardTitle>
            <CardDescription>Students per risk level, last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskTrendChart data={trend} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Students needing attention</CardTitle>
            <CardDescription>High risk, or risk rising by 10+ points in the last month</CardDescription>
          </CardHeader>
          <CardContent>
            <AttentionList rows={attention} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Risk by course</CardTitle>
            <CardDescription>Where support is needed most</CardDescription>
          </CardHeader>
          <CardContent>
            <CourseRiskChart data={courses} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
