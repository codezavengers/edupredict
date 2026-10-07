import type { Metadata } from 'next'
import { InterventionsBoard } from '@/components/interventions-board'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = {
  title: 'Interventions · EduPredict AI',
  description: 'Track support actions for students at medium and high dropout risk.',
}

export default function InterventionsPage() {
  return (
    <>
      <PageHeader
        title="Interventions"
        description="Track follow-up for students at medium or high risk. Updates are saved in this browser."
      />
      <InterventionsBoard />
    </>
  )
}
