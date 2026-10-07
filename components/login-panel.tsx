'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, BookOpenCheck, Presentation, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DEMO_STUDENT_ID } from '@/lib/data'
import { useStore } from '@/lib/store'
import type { Role } from '@/lib/types'

const ROLES: { role: Role; title: string; text: string; icon: LucideIcon }[] = [
  {
    role: 'admin',
    title: 'Admin',
    text: 'Institution-wide dashboard, analytics and intervention tracking.',
    icon: ShieldCheck,
  },
  {
    role: 'faculty',
    title: 'Faculty',
    text: 'Review at-risk students, simulate improvements, update interventions.',
    icon: Presentation,
  },
  {
    role: 'student',
    title: 'Student',
    text: 'See your own risk explanation and a personal improvement plan.',
    icon: BookOpenCheck,
  },
]

export function LoginPanel() {
  const router = useRouter()
  const { ready, role: currentRole, setRole } = useStore()

  const destination = (role: Role) => (role === 'student' ? `/students/${DEMO_STUDENT_ID}` : '/dashboard')

  useEffect(() => {
    if (ready && currentRole) router.replace(destination(currentRole))
  }, [ready, currentRole, router])

  const choose = (role: Role) => {
    setRole(role)
    router.push(destination(role))
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-semibold tracking-tight">Sign in to the demo</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        No password needed. Pick a role to explore the platform from that point of view.
      </p>
      <div className="mt-6 space-y-3">
        {ROLES.map(({ role, title, text, icon: Icon }) => (
          <button
            key={role}
            type="button"
            onClick={() => choose(role)}
            className="group flex w-full items-center gap-4 rounded-xl border bg-card p-4 text-left shadow-xs transition-colors hover:border-primary/50 hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">Continue as {title}</span>
              <span className="mt-0.5 block text-pretty text-xs text-muted-foreground">{text}</span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
