import { useState, type FormEvent } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Check, ExternalLink, FolderGit2, LayoutDashboard, LogOut, Monitor, Moon, Rocket, Search, Settings as SettingsIcon, Sun } from 'lucide-react'
import { Dropdown, menuItem } from './Dropdown'
import { Logo } from './Logo'
import { useAuth } from '../hooks/useAuth'
import { useTheme, type Mode } from '../hooks/useTheme'
import { ReposProvider } from '../hooks/useRepos'
import { cx } from '../lib/utils'

const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/repositories', label: 'Repositories', icon: FolderGit2 },
  { to: '/deployments', label: 'Deployments', icon: Rocket },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]
const MODES: { m: Mode; label: string; icon: typeof Sun }[] = [
  { m: 'light', label: 'Light', icon: Sun }, { m: 'dark', label: 'Dark', icon: Moon }, { m: 'system', label: 'System', icon: Monitor },
]

export function Layout() {
  const { user, logout } = useAuth()
  const { mode, setMode, dark } = useTheme()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const search = (e: FormEvent) => { e.preventDefault(); navigate(`/repositories?q=${encodeURIComponent(q)}`) }

  return (
    <ReposProvider>
      <header className="glass fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 rounded-none border-x-0 border-t-0 px-4">
        <NavLink to="/" className="flex items-center gap-2 font-semibold"><Logo size={26} />Gitmage</NavLink>
        <form onSubmit={search} className="mx-auto hidden w-full max-w-sm sm:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search repositories" aria-label="Search repositories" className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary" />
          </div>
        </form>
        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <NavLink to="/repositories" aria-label="Search" className="grid h-10 w-10 place-items-center rounded-lg text-muted hover:bg-elevated sm:hidden"><Search className="h-5 w-5" /></NavLink>
          <Dropdown label="Theme" trigger={dark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}>
            {(close) => MODES.map(({ m, label, icon: I }) => (
              <button key={m} className={menuItem} onClick={() => { setMode(m); close() }}><I className="h-4 w-4" />{label}{mode === m && <Check className="ml-auto h-4 w-4 text-primary" />}</button>
            ))}
          </Dropdown>
          <Dropdown label="Profile menu" className="!h-9 !w-9 overflow-hidden rounded-full p-0" trigger={<img src={user?.avatarUrl} alt="" className="h-9 w-9 rounded-full" />}>
            {(close) => (
              <>
                <div className="px-3 py-2"><p className="truncate text-sm font-medium">{user?.name || user?.login}</p><p className="truncate text-xs text-muted">@{user?.login}</p></div>
                <a href={user?.url} target="_blank" rel="noreferrer" className={menuItem}><ExternalLink className="h-4 w-4" />GitHub profile</a>
                <NavLink to="/settings" onClick={close} className={menuItem}><SettingsIcon className="h-4 w-4" />Settings</NavLink>
                <button className={menuItem} onClick={() => void logout()}><LogOut className="h-4 w-4" />Log out</button>
              </>
            )}
          </Dropdown>
        </div>
      </header>

      <aside className="glass fixed bottom-0 left-0 top-14 hidden w-56 rounded-none border-b-0 border-l-0 border-t-0 p-3 lg:block">
        <nav className="space-y-1">
          {NAV.map(({ to, label, icon: I }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => cx('flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition', isActive ? 'bg-primary/10 font-medium text-primary' : 'text-muted hover:bg-elevated hover:text-fg')}><I className="h-4 w-4" />{label}</NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-56">
        <main className="mx-auto min-w-0 max-w-5xl px-4 pb-28 pt-20 lg:pb-10"><Outlet /></main>
      </div>

      <nav className="glass fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 rounded-none border-b-0 border-x-0 lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {NAV.map(({ to, label, icon: I }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => cx('flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] transition active:scale-95', isActive ? 'text-primary' : 'text-muted')}><I className="h-5 w-5" />{label}</NavLink>
        ))}
      </nav>
    </ReposProvider>
  )
}
