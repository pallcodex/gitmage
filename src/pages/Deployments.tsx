import { useCallback, useEffect, useState } from 'react'
import { ExternalLink, RefreshCw, Rocket } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useRepos } from '../hooks/useRepos'
import { useToast } from '../components/Toast'
import { Button, Card, EmptyState, ErrorState, SelectField, Skeleton } from '../components/ui'
import { ACTIVE, DeploymentStatus } from '../components/DeploymentStatus'
import { api, errMsg } from '../lib/api'
import { timeAgo } from '../lib/utils'
import { t } from '../lib/i18n'
import type { VDeployment, VProject } from '../types'

function Setup() {
  const steps = [t('dp.s1'), t('dp.s2'), t('dp.s3'), t('dp.s4')]
  return (
    <Card>
      <h2 className="font-medium">{t('dp.connect')}</h2>
      <p className="mt-1 text-sm text-muted">{t('dp.tokenNote')}</p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
    </Card>
  )
}

export default function Deployments() {
  const { user } = useAuth()
  const { repos } = useRepos()
  const toast = useToast()
  const [projects, setProjects] = useState<VProject[]>([])
  const [deps, setDeps] = useState<VDeployment[] | null>(null)
  const [error, setError] = useState('')
  const [repoName, setRepoName] = useState('')
  const [branches, setBranches] = useState<string[]>([])
  const [branch, setBranch] = useState('')
  const [project, setProject] = useState('')
  const [busy, setBusy] = useState(false)
  const configured = !!user?.vercelConfigured
  const repo = repos.find((r) => r.fullName === repoName)

  const loadDeps = useCallback(async () => {
    try { setDeps((await api<{ deployments: VDeployment[] }>('/api/vercel?action=deployments')).deployments); setError('') }
    catch (e) { setError(errMsg(e)); setDeps((d) => d ?? []) }
  }, [])
  useEffect(() => {
    if (!configured) return
    void loadDeps()
    api<{ projects: VProject[] }>('/api/vercel?action=projects').then((d) => setProjects(d.projects)).catch((e) => setError(errMsg(e)))
  }, [configured, loadDeps])
  useEffect(() => {
    if (!deps?.some((d) => ACTIVE.includes(d.state))) return
    const t = setInterval(() => void loadDeps(), 5000)
    return () => clearInterval(t)
  }, [deps, loadDeps])

  useEffect(() => {
    if (!repo) { setBranches([]); return }
    setBranch(repo.defaultBranch)
    setProject(projects.find((p) => p.repo?.toLowerCase() === repo.fullName.toLowerCase())?.name || '')
    api<{ branches: string[] }>(`/api/branches?owner=${repo.owner}&name=${repo.name}`).then((d) => setBranches(d.branches)).catch(() => setBranches([repo.defaultBranch]))
  }, [repo, projects])

  const deploy = async () => {
    if (!repo) return
    setBusy(true)
    try {
      const d = await api<{ id: string; url: string; state: string }>('/api/vercel?action=deploy', { method: 'POST', body: { project, owner: repo.owner, repo: repo.name, branch } })
      toast('success', t('dp.created'))
      void loadDeps()
      return d
    } catch (e) { toast('error', errMsg(e)) } finally { setBusy(false) }
  }

  if (!configured) return <div className="space-y-4"><h1 className="text-xl font-semibold">{t('nav.deployments')}</h1><Setup /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{t('nav.deployments')}</h1>
      <Card className="space-y-4">
        <SelectField label={t('dp.repo')} value={repoName} onChange={(e) => setRepoName(e.target.value)}>
          <option value="">{t('dp.selectRepo')}</option>{repos.map((r) => <option key={r.id} value={r.fullName}>{r.fullName}</option>)}
        </SelectField>
        <SelectField label={t('dp.branch')} value={branch} onChange={(e) => setBranch(e.target.value)} disabled={!repo}>
          {branches.map((b) => <option key={b}>{b}</option>)}
        </SelectField>
        <SelectField label={t('dp.project')} value={project} onChange={(e) => setProject(e.target.value)} disabled={!repo}>
          <option value="">{t('dp.selectProject')}</option>{projects.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
        </SelectField>
        {projects.length === 0 && <p className="text-xs text-muted">{t('dp.noProjects')}</p>}
        <Button className="w-full" loading={busy} disabled={!repo || !branch || !project} onClick={() => void deploy()}><Rocket className="h-4 w-4" />{t('dp.deploy')}</Button>
      </Card>

      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="font-medium">{t('dp.recent')}</h2><Button variant="ghost" onClick={() => void loadDeps()} aria-label={t('refresh')}><RefreshCw className="h-4 w-4" /></Button></div>
        {error ? <ErrorState message={error} onRetry={() => void loadDeps()} />
          : deps === null ? <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16" />)}</div>
          : deps.length === 0 ? <EmptyState icon={Rocket} title={t('ov.noDepsTitle')} text={t('dp.emptyText')} />
          : (
            <ul className="space-y-2">
              {deps.map((d) => (
                <li key={d.id} className="rounded-xl border border-border bg-surface p-3 text-sm">
                  <div className="flex items-center justify-between gap-3"><span className="truncate font-medium">{d.name}</span><DeploymentStatus state={d.state} /></div>
                  <div className="mt-1 flex items-center justify-between gap-3 text-xs text-muted">
                    <span className="truncate">{d.branch ? `${d.branch} · ` : ''}{d.createdAt ? timeAgo(d.createdAt) : ''}</span>
                    {d.state === 'READY' && <a href={`https://${d.url}`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-primary">{t('dp.openSite')} <ExternalLink className="h-3 w-3" /></a>}
                  </div>
                </li>
              ))}
            </ul>
          )}
      </section>
    </div>
  )
}
