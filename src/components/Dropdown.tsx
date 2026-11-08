import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cx } from '../lib/utils'

export const menuItem = 'flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm hover:bg-elevated'

export function Dropdown({ trigger, label, children, className }: { trigger: ReactNode; label: string; children: (close: () => void) => ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const d = (e: Event) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', d); document.addEventListener('touchstart', d); document.addEventListener('keydown', k)
    return () => { document.removeEventListener('mousedown', d); document.removeEventListener('touchstart', d); document.removeEventListener('keydown', k) }
  }, [open])
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-label={label} aria-expanded={open} className={cx('grid h-10 w-10 place-items-center rounded-lg text-muted transition hover:bg-elevated hover:text-fg', className)}>{trigger}</button>
      {open && <div className="glass glass-strong fade-in absolute right-0 top-full z-40 mt-2 w-60 max-w-[calc(100vw-2rem)] rounded-xl p-1.5">{children(() => setOpen(false))}</div>}
    </div>
  )
}
