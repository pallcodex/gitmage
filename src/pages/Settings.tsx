import { Check, LogOut, Monitor, Moon, Sun } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTheme, type Mode } from '../hooks/useTheme'
import { Button, Card } from '../components/ui'
import { cx } from '../lib/utils'

const MODES: { m: Mode; label: string; icon: typeof Sun }[] = [{ m: 'light', label: 'Light', icon: Sun }, { m: 'dark', label: 'Dark', icon: Moon }, { m: 'system', label: 'System', icon: Monitor }]

export default function Settings() {
  const { user, logout } = useAuth()
  const { mode, setMode } = useTheme()
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <Card className="flex items-center gap-3"><img src={user?.avatarUrl} alt="" className="h-12 w-12 rounded-full" /><div className="min-w-0"><p className="truncate font-medium">{user?.name || user?.login}</p><a href={user?.url} target="_blank" rel="noreferrer" className="text-sm text-primary">@{user?.login}</a></div></Card>
      <Card>
        <h2 className="mb-3 font-medium">Appearance</h2>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map(({ m, label, icon: I }) => (
            <button key={m} onClick={() => setMode(m)} className={cx('flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg border text-sm transition', mode === m ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted')}><I className="h-4 w-4" />{label}</button>
          ))}
        </div>
      </Card>
      <Card className="space-y-2 text-sm">
        <h2 className="font-medium">Access</h2>
        <p className="text-muted">GitHub scopes: repo, delete_repo. Your token lives only in an encrypted HttpOnly cookie on the server session.</p>
        <p className="flex items-center gap-2 text-muted"><Check className="h-4 w-4 text-primary" />Vercel integration: {user?.vercelConfigured ? 'configured' : 'not configured'}</p>
      </Card>
      <Button variant="secondary" onClick={() => void logout()}><LogOut className="h-4 w-4" />Log out</Button>
    </div>
  )
}
