import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { StudentsTable } from '@/components/students-table'

export const metadata: Metadata = {
  title: 'Students · EduPredict AI',
  description: 'Search, filter and review every student with their current dropout risk.',
}

export default function StudentsPage() {
  return (
    <>
      <PageHeader
        title="Students"
        description="Search and filter the cohort. Select a student to see an explanation of their risk score."
      />
      <StudentsTable />
    </>
  )
}
