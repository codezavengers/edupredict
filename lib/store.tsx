'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_INTERVENTIONS } from './data'
import type { Intervention, InterventionStatus, Role } from './types'

const ROLE_KEY = 'edupredict:role'
const INTERVENTION_KEY = 'edupredict:interventions'

interface StoreValue {
  ready: boolean
  role: Role | null
  setRole: (role: Role | null) => void
  getStatus: (studentId: string) => InterventionStatus
  getIntervention: (studentId: string) => Intervention | undefined
  setStatus: (studentId: string, status: InterventionStatus) => void
  resetDemo: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

function defaultInterventions(): Record<string, Intervention> {
  const now = new Date().toISOString()
  return Object.fromEntries(
    Object.entries(DEFAULT_INTERVENTIONS).map(([id, status]) => [id, { status, updatedAt: now }]),
  )
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [role, setRoleState] = useState<Role | null>(null)
  const [interventions, setInterventions] = useState<Record<string, Intervention>>({})

  useEffect(() => {
    try {
      const storedRole = window.localStorage.getItem(ROLE_KEY) as Role | null
      if (storedRole === 'admin' || storedRole === 'faculty' || storedRole === 'student') {
        setRoleState(storedRole)
      }
      const storedInterventions = window.localStorage.getItem(INTERVENTION_KEY)
      setInterventions(storedInterventions ? JSON.parse(storedInterventions) : defaultInterventions())
    } catch {
      setInterventions(defaultInterventions())
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(INTERVENTION_KEY, JSON.stringify(interventions))
    } catch {}
  }, [interventions, ready])

  const setRole = useCallback((next: Role | null) => {
    setRoleState(next)
    try {
      if (next) window.localStorage.setItem(ROLE_KEY, next)
      else window.localStorage.removeItem(ROLE_KEY)
    } catch {}
  }, [])

  const setStatus = useCallback((studentId: string, status: InterventionStatus) => {
    setInterventions((prev) => ({
      ...prev,
      [studentId]: { status, updatedAt: new Date().toISOString() },
    }))
  }, [])

  const resetDemo = useCallback(() => setInterventions(defaultInterventions()), [])

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      role,
      setRole,
      getStatus: (id) => interventions[id]?.status ?? 'Pending',
      getIntervention: (id) => interventions[id],
      setStatus,
      resetDemo,
    }),
    [ready, role, setRole, interventions, setStatus, resetDemo],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'Admin',
  faculty: 'Faculty',
  student: 'Student',
}
