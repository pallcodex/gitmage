import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import type { User } from '../types'

interface AuthCtx { user: User | null; loading: boolean; expired: boolean; logout: () => Promise<void> }
const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    api<User>('/api/me', { quiet: true }).then(setUser).catch(() => setUser(null)).finally(() => setLoading(false))
    const h = () => { setUser(null); setExpired(true) }
    window.addEventListener('gitmage:expired', h)
    return () => window.removeEventListener('gitmage:expired', h)
  }, [])

  const logout = async () => {
    await api('/api/auth/logout', { method: 'POST', quiet: true }).catch(() => undefined)
    setExpired(false)
    setUser(null)
  }
  return <Ctx.Provider value={{ user, loading, expired, logout }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('AuthProvider missing')
  return c
}
