import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react'
import { t as tr } from '../lib/i18n'

interface T { id: number; kind: 'success' | 'error'; message: string; href?: string }
const Ctx = createContext<(kind: T['kind'], message: string, href?: string) => void>(() => undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<T[]>([])
  const push = useCallback((kind: T['kind'], message: string, href?: string) => {
    const id = Date.now() + Math.random()
    setItems((p) => [...p, { id, kind, message, href }])
    setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 6000)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-16 z-[60] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className="glass glass-strong fade-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl p-3 text-sm">
            {t.kind === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />}
            <div className="min-w-0 flex-1 break-words">
              {t.message}
              {t.href && <a href={t.href} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-1 text-primary">{tr('open')} <ExternalLink className="h-3 w-3" /></a>}
            </div>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
export const useToast = () => useContext(Ctx)
