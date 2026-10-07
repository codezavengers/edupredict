import { LoginPanel } from '@/components/login-panel'
import { GraduationCap, LineChart, ShieldCheck, Sparkles } from 'lucide-react'

const HIGHLIGHTS = [
  { icon: LineChart, title: 'Early dropout warnings', text: 'Spot at-risk students months before results are affected.' },
  { icon: Sparkles, title: 'Explainable by design', text: 'Every score shows exactly which factors raised or lowered it.' },
  { icon: ShieldCheck, title: 'Private demo data', text: 'Synthetic students only. Everything runs in your browser.' },
]

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="relative flex flex-col justify-between gap-12 bg-sidebar p-8 text-sidebar-foreground sm:p-12">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold">EduPredict AI</span>
        </div>
        <div className="max-w-lg">
          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Know which students need help, and why.
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-sidebar-foreground/75">
            A learning analytics dashboard that predicts dropout risk from attendance, marks, assignments, LMS activity and
            engagement, then recommends what to do next.
          </p>
          <ul className="mt-8 space-y-5">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-primary">
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-sm text-sidebar-foreground/65">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-sidebar-foreground/50">Hackathon prototype · all data is synthetic</p>
      </section>
      <section className="flex items-center justify-center p-6 sm:p-12">
        <LoginPanel />
      </section>
    </main>
  )
}
