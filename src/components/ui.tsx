import { useEffect, useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { AlertCircle, Loader2, X, type LucideIcon } from 'lucide-react'
import { cx } from '../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
const V: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-surface text-fg border border-border hover:bg-elevated',
  ghost: 'text-muted hover:bg-elevated hover:text-fg',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}
export const buttonClass = (variant: Variant = 'primary', extra?: string) =>
  cx('inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary', V[variant], extra)

export function Button({ variant = 'primary', loading, disabled, className, children, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }) {
  return (
    <button type="button" {...p} disabled={disabled || loading} className={buttonClass(variant, className)}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

const inputCls = (err?: string) => cx('h-11 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20', err ? 'border-red-500' : 'border-border')

export function Field({ label, error, hint, ...p }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  const id = useId()
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <input id={id} {...p} className={inputCls(error)} />
      {error ? <p className="text-xs text-red-500">{error}</p> : hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  )
}

export function SelectField({ label, children, ...p }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  const id = useId()
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <select id={id} {...p} className={cx(inputCls(), 'disabled:opacity-50')}>{children}</select>
    </div>
  )
}

export function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = prev }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fade-in absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="glass glass-strong fade-in relative max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl p-5 sm:max-w-md sm:rounded-2xl" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-elevated"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export const Skeleton = ({ className }: { className?: string }) => <div className={cx('animate-pulse rounded-lg bg-elevated', className)} />

export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-elevated text-muted"><Icon className="h-5 w-5" /></div>
      <p className="font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-red-500/30 px-6 py-10 text-center">
      <AlertCircle className="mb-2 h-5 w-5 text-red-500" />
      <p className="text-sm">{message}</p>
      {onRetry && <Button variant="secondary" className="mt-4" onClick={onRetry}>Try again</Button>}
    </div>
  )
}

export const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
  <section className={cx('rounded-xl border border-border bg-surface p-4', className)}>{children}</section>
)
