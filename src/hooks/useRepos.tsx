import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, errMsg } from '../lib/api'
import type { Repo } from '../types'

interface Ctx { repos: Repo[]; loading: boolean; error: string | null; reload: () => Promise<void>; addRepo: (r: Repo) => void; removeRepo: (id: number) => void }
const C = createContext<Ctx | null>(null)

export function ReposProvider({ children }: { children: ReactNode }) {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true); setError(null)
    try { setRepos((await api<{ repos: Repo[] }>('/api/repos')).repos) }
    catch (e) { setError(errMsg(e)) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { void reload() }, [reload])

  const addRepo = (r: Repo) => setRepos((p) => [r, ...p.filter((x) => x.id !== r.id)])
  const removeRepo = (id: number) => setRepos((p) => p.filter((x) => x.id !== id))
  return <C.Provider value={{ repos, loading, error, reload, addRepo, removeRepo }}>{children}</C.Provider>
}

export function useRepos() {
  const c = useContext(C)
  if (!c) throw new Error('ReposProvider missing')
  return c
}
