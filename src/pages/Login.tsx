import { Github, Lock, Trash2 } from 'lucide-react'
import { Logo } from '../components/Logo'
import { buttonClass } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import { useI18n } from '../hooks/useI18n'
import { t, type Key } from '../lib/i18n'

const ERRORS: Record<string, Key> = { invalid_state: 'login.errState', auth_failed: 'login.errFail' }

export default function Login() {
  const { expired } = useAuth()
  const { lang, setLang } = useI18n()
  const err = new URLSearchParams(location.search).get('error')
  const message = expired ? t('login.expired') : err ? t(ERRORS[err] || ERRORS.auth_failed) : ''
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden px-4" style={{ background: 'radial-gradient(60rem 28rem at 50% -10%, color-mix(in srgb, var(--primary) 16%, transparent), transparent), var(--bg)' }}>
      <div className="absolute right-4 top-4 flex rounded-lg border border-border p-0.5 text-xs" style={{ marginTop: 'env(safe-area-inset-top)' }}>
        {(['id', 'en'] as const).map((l) => (
          <button key={l} onClick={() => setLang(l)} aria-label={l === 'id' ? 'Bahasa Indonesia' : 'English'} className={`min-h-8 rounded-md px-3 uppercase transition ${lang === l ? 'bg-primary/10 text-primary' : 'text-muted'}`}>{l}</button>
        ))}
      </div>
      <div className="glass glass-strong w-full max-w-sm rounded-2xl p-6 text-center">
        <div className="mx-auto mb-4 w-fit"><Logo size={48} /></div>
        <h1 className="text-2xl font-semibold">Gitmage</h1>
        <p className="mt-2 text-sm text-muted">{t('login.desc')}</p>
        {message && <p className="mt-4 rounded-lg border border-red-500/30 p-3 text-sm text-red-500" role="alert">{message}</p>}
        <a href="/api/auth/login" className={buttonClass('primary', 'mt-6 h-11 w-full')}><Github className="h-4 w-4" />{t('login.cta')}</a>
        <ul className="mt-6 space-y-2 text-left text-xs text-muted">
          <li className="flex gap-2"><Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />{t('login.p1')}</li>
          <li className="flex gap-2"><Trash2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />{t('login.p2')}</li>
          <li className="flex gap-2"><Github className="mt-0.5 h-3.5 w-3.5 shrink-0" />{t('login.p3')}</li>
        </ul>
      </div>
    </div>
  )
}
