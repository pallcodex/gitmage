import { Github, Lock, Trash2 } from 'lucide-react'
import { Logo } from '../components/Logo'
import { buttonClass } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

const ERRORS: Record<string, string> = { invalid_state: 'The sign-in request could not be verified. Please try again.', auth_failed: 'GitHub sign-in failed. Please try again.' }

export default function Login() {
  const { expired } = useAuth()
  const err = new URLSearchParams(location.search).get('error')
  const message = expired ? 'Your session expired. Please sign in again.' : err ? ERRORS[err] || ERRORS.auth_failed : ''
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden px-4" style={{ background: 'radial-gradient(60rem 28rem at 50% -10%, color-mix(in srgb, var(--primary) 16%, transparent), transparent), var(--bg)' }}>
      <div className="glass glass-strong w-full max-w-sm rounded-2xl p-6 text-center">
        <div className="mx-auto mb-4 w-fit"><Logo size={48} /></div>
        <h1 className="text-2xl font-semibold">Gitmage</h1>
        <p className="mt-2 text-sm text-muted">Manage your GitHub repositories and deploy them to Vercel from one place.</p>
        {message && <p className="mt-4 rounded-lg border border-red-500/30 p-3 text-sm text-red-500" role="alert">{message}</p>}
        <a href="/api/auth/login" className={buttonClass('primary', 'mt-6 h-11 w-full')}><Github className="h-4 w-4" />Continue with GitHub</a>
        <ul className="mt-6 space-y-2 text-left text-xs text-muted">
          <li className="flex gap-2"><Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />Read and manage your repositories (repo scope).</li>
          <li className="flex gap-2"><Trash2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />Delete repositories only after you confirm by typing the name (delete_repo scope).</li>
          <li className="flex gap-2"><Github className="mt-0.5 h-3.5 w-3.5 shrink-0" />Your GitHub password is never shared with Gitmage.</li>
        </ul>
      </div>
    </div>
  )
}
