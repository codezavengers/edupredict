'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BarChart3,
  Check,
  ChevronsUpDown,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  RotateCcw,
  UserRound,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'
import { DEMO_STUDENT_ID, STUDENT_BY_ID } from '@/lib/data'
import { ROLE_LABEL, useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Role } from '@/lib/types'

const STAFF_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/interventions', label: 'Interventions', icon: ClipboardCheck },
]

const STUDENT_HOME = `/students/${DEMO_STUDENT_ID}`
const STUDENT_NAV = [{ href: STUDENT_HOME, label: 'My Profile', icon: UserRound }]

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { role } = useStore()
  const items = role === 'student' ? STUDENT_NAV : STAFF_NAV

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <GraduationCap className="size-5" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">EduPredict AI</p>
          <p className="text-xs text-sidebar-foreground/60">Learning analytics</p>
        </div>
      </div>
      <nav aria-label="Main" className="flex-1 space-y-1 px-3 py-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="m-3 rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3 text-xs leading-relaxed text-sidebar-foreground/70">
        Demo uses <span className="font-medium text-sidebar-foreground">synthetic data</span> only. Risk scores are computed
        in your browser.
      </div>
    </div>
  )
}

function UserMenu() {
  const router = useRouter()
  const { role, setRole, resetDemo } = useStore()
  if (!role) return null

  const switchRole = (next: Role) => {
    setRole(next)
    if (next === 'student') router.push(STUDENT_HOME)
    else if (role === 'student') router.push('/dashboard')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" className="gap-2" aria-label="Account and role menu" />}>
        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          {ROLE_LABEL[role][0]}
        </span>
        <span className="hidden sm:inline">{ROLE_LABEL[role]}</span>
        <ChevronsUpDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Switch demo role</DropdownMenuLabel>
          {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
            <DropdownMenuItem key={r} onClick={() => switchRole(r)}>
              {ROLE_LABEL[r]}
              {r === role && <Check className="ml-auto size-4" aria-hidden="true" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={resetDemo}>
          <RotateCcw aria-hidden="true" /> Reset interventions
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setRole(null)
            router.push('/')
          }}
        >
          <LogOut aria-hidden="true" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { ready, role } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (!role) router.replace('/')
    else if (role === 'student' && pathname !== STUDENT_HOME) router.replace(STUDENT_HOME)
  }, [ready, role, pathname, router])

  const allowed = ready && role && (role !== 'student' || pathname === STUDENT_HOME)
  const studentName = STUDENT_BY_ID[DEMO_STUDENT_ID].name

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground" role="status">
        Loading EduPredict AI…
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border lg:block">
        <SidebarNav />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 max-w-[85vw] gap-0 p-0 sm:max-w-72">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Main navigation links</SheetDescription>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur sm:px-6">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu aria-hidden="true" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {role === 'student' ? `Welcome, ${studentName.split(' ')[0]}` : 'Student Learning Analytics'}
            </p>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              Dropout risk prediction · Autumn term 2026
            </p>
          </div>
          <ThemeToggle />
          <UserMenu />
        </header>
        <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
