import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, FolderGit2, Plus, Rocket } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useRepos } from '../hooks/useRepos'
import { Button, Card, EmptyState, ErrorState, Skeleton } from '../components/ui'
import { RepoCard } from '../components/RepoCard'
import { CreateRepoDialog } from '../components/CreateRepoDialog'
import { ImportRepoDialog } from '../components/ImportRepoDialog'
import { DeploymentStatus } from '../components/DeploymentStatus'
import { api } from '../lib/api'
import { timeAgo } from '../lib/utils'
import { t } from '../lib/i18n'
import type { VDeployment } from '../types'

export default function Overview() {
  const { user } = useAuth()
  const { repos, loading, error, reload } = useRepos()
  const [create, setCreate] = useState(false)
  const [imp, setImp] = useState(false)
  const [deps, setDeps] = useState<VDeployment[] | null>(null)
  useEffect(() => {
    if (user?.vercelConfigured) api<{ deployments: VDeployment[] }>('/api/vercel?action=deployments').then((d) => setDeps(d.deployments.slice(0, 3))).catch(() => setDeps([]))
  }, [user])

  const recent = repos.slice(0, 5)
  const pub = repos.filter((r) => !r.private).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <img src={user?.avatarUrl} alt="" className="h-12 w-12 rounded-full" />
        <div className="min-w-0"><h1 className="truncate text-xl font-semibold">{user?.name || user?.login}</h1><p className="text-sm text-muted">@{user?.login}</p></div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:max-w-sm">
        <Button onClick={() => setCreate(true)}><Plus className="h-4 w-4" />{t('ov.create')}</Button>
        <Button variant="secondary" onClick={() => setImp(true)}><Download className="h-4 w-4" />{t('ov.import')}</Button>
      </div>

      {error ? <ErrorState message={error} onRetry={() => void reload()} /> : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {[[t('ov.total'), repos.length], [t('public'), pub], [t('private'), repos.length - pub]].map(([l, v]) => (
              <Card key={l}><p className="text-xs text-muted">{l}</p>{loading ? <Skeleton className="mt-2 h-7 w-10" /> : <p className="mt-1 text-2xl font-semibold">{v}</p>}</Card>
            ))}
          </div>
          {!loading && recent[0] && <p className="text-sm text-muted">{t('ov.last')} <a className="text-primary" href={recent[0].url} target="_blank" rel="noreferrer">{recent[0].name}</a> {timeAgo(recent[0].updatedAt)}</p>}
          <section>
            <div className="mb-3 flex items-center justify-between"><h2 className="font-medium">{t('ov.recent')}</h2><Link to="/repositories" className="text-sm text-primary">{t('ov.viewAll')}</Link></div>
            {loading ? <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24" />)}</div>
              : recent.length === 0 ? <EmptyState icon={FolderGit2} title={t('ov.emptyTitle')} text={t('ov.emptyText')} action={<Button onClick={() => setCreate(true)}>{t('ov.create')}</Button>} />
              : <ul className="space-y-2">{recent.map((r) => <RepoCard key={r.id} repo={r} />)}</ul>}
          </section>
        </>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="font-medium">{t('nav.deployments')}</h2><Link to="/deployments" className="text-sm text-primary">{t('ov.manage')}</Link></div>
        {!user?.vercelConfigured ? <EmptyState icon={Rocket} title={t('ov.vncTitle')} text={t('ov.vncText')} action={<Link to="/deployments" className="text-sm text-primary">{t('ov.seeSetup')}</Link>} />
          : deps === null ? <Skeleton className="h-16" />
          : deps.length === 0 ? <EmptyState icon={Rocket} title={t('ov.noDepsTitle')} text={t('ov.noDepsText')} />
          : <ul className="space-y-2">{deps.map((d) => <li key={d.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 text-sm"><span className="truncate">{d.name}</span><DeploymentStatus state={d.state} /></li>)}</ul>}
      </section>

      <CreateRepoDialog open={create} onClose={() => setCreate(false)} />
      <ImportRepoDialog open={imp} onClose={() => setImp(false)} />
    </div>
  )
}
