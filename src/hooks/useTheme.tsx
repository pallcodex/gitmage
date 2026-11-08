import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Mode = 'light' | 'dark' | 'system'
const Ctx = createContext<{ mode: Mode; setMode: (m: Mode) => void; dark: boolean } | null>(null)
const KEY = 'gitmage-theme' // hanya preferensi tema, bukan data sensitif

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(() => (localStorage.getItem(KEY) as Mode) || 'system')
  const [sysDark, setSysDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches)
  const dark = mode === 'dark' || (mode === 'system' && sysDark)

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const h = (e: MediaQueryListEvent) => setSysDark(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])

  const setMode = (m: Mode) => { localStorage.setItem(KEY, m); setModeState(m) }
  return <Ctx.Provider value={{ mode, setMode, dark }}>{children}</Ctx.Provider>
}

export function useTheme() {
  const c = useContext(Ctx)
  if (!c) throw new Error('ThemeProvider missing')
  return c
}
