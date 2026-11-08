import { Check, LogOut, Monitor, Moon, Sun } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTheme, type Mode } from '../hooks/useTheme'
import { Button, Card } from '../components/ui'
import { cx } from '../lib/utils'
import { useI18n } from '../hooks/useI18n'
import { t, type Key } from '../lib/i18n'

const MODES: { m: Mode; label: Key; icon: typeof Sun }[] = [{ m: 'light', label: 'theme.light', icon: Sun }, { m: 'dark', label: 'theme.dark', icon: Moon }, { m: 'system', label: 'theme.system', icon: Monitor }]

export default function Settings() {
  const { user, logout } = useAuth()
  const { mode, setMode } = useTheme()
  const { lang, setLang } = useI18n()
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{t('nav.settings')}</h1>
      <Card className="flex items-center gap-3"><img src={user?.avatarUrl} alt="" className="h-12 w-12 rounded-full" /><div className="min-w-0"><p className="truncate font-medium">{user?.name || user?.login}</p><a href={user?.url} target="_blank" rel="noreferrer" className="text-sm text-primary">@{user?.login}</a></div></Card>
      <Card>
        <h2 className="mb-3 font-medium">{t('set.appearance')}</h2>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map(({ m, label, icon: I }) => (
            <button key={m} onClick={() => setMode(m)} className={cx('flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg border text-sm transition', mode === m ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted')}><I className="h-4 w-4" />{t(label)}</button>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="mb-3 font-medium">{t('set.language')}</h2>
        <div className="grid grid-cols-2 gap-2">
          {(['id', 'en'] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)} className={cx('min-h-11 rounded-lg border text-sm transition', lang === l ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted')}>{l === 'id' ? 'Bahasa Indonesia' : 'English'}</button>
          ))}
        </div>
      </Card>
      <Card className="space-y-2 text-sm">
        <h2 className="font-medium">{t('set.access')}</h2>
        <p className="text-muted">{t('set.accessText')}</p>
        <p className="flex items-center gap-2 text-muted"><Check className="h-4 w-4 text-primary" />{user?.vercelConfigured ? t('set.vercelOn') : t('set.vercelOff')}</p>
      </Card>
      <Button variant="secondary" onClick={() => void logout()}><LogOut className="h-4 w-4" />{t('logout')}</Button>
    </div>
  )
}
