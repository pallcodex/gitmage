import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, FolderGit2, Plus, Search } from 'lucide-react'
import { useRepos } from '../hooks/useRepos'
import { Button, EmptyState, ErrorState, Skeleton } from '../components/ui'
import { RepoCard } from '../components/RepoCard'
import { CreateRepoDialog } from '../components/CreateRepoDialog'
import { ImportRepoDialog } from '../components/ImportRepoDialog'
import { DeleteRepoDialog } from '../components/DeleteRepoDialog'
import { cx } from '../lib/utils'
import type { Repo } from '../types'

const PER = 10
type Filter = 'all' | 'public' | 'private'

export default function Repositories() {
  const { repos, loading, error, reload } = useRepos()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<'updated' | 'name'>('updated')
  const [page, setPage] = useState(1)
  const [create, setCreate] = useState(false)
  const [imp, setImp] = useState(false)
  const [del, setDel] = useState<Repo | null>(null)

  const list = useMemo(() => {
    const t = q.toLowerCase()
    return repos
      .filter((r) => (filter === 'all' || (filter === 'private') === r.private) && (!t || r.fullName.toLowerCase().includes(t) || (r.description || '').toLowerCase().includes(t)))
      .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : b.updatedAt.localeCompare(a.updatedAt)))
  }, [repos, q, filter, sort])
  const pages = Math.max(1, Math.ceil(list.length / PER))
  const cur = Math.min(page, pages)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Repositories</h1>
        <div className="flex gap-2"><Button variant="secondary" onClick={() => setImp(true)}>Import</Button><Button onClick={() => setCreate(true)}><Plus className="h-4 w-4" />Create</Button></div>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => { setParams(e.target.value ? { q: e.target.value } : {}); setPage(1) }} placeholder="Search repositories" aria-label="Search repositories" className="h-11 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-border p-0.5">
          {(['all', 'public', 'private'] as Filter[]).map((f) => (
            <button key={f} onClick={() => { setFilter(f); setPage(1) }} className={cx('min-h-9 rounded-md px-3 text-sm capitalize transition', filter === f ? 'bg-primary/10 text-primary' : 'text-muted')}>{f}</button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as 'updated' | 'name')} aria-label="Sort" className="ml-auto h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none">
          <option value="updated">Recently updated</option><option value="name">Name</option>
        </select>
      </div>

      {error ? <ErrorState message={error} onRetry={() => void reload()} />
        : loading ? <div className="space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}</div>
        : list.length === 0 ? <EmptyState icon={FolderGit2} title={repos.length ? 'No matching repositories' : 'No repositories yet'} text={repos.length ? 'Try a different search or filter.' : 'Create your first repository to get started.'} action={!repos.length && <Button onClick={() => setCreate(true)}>Create Repository</Button>} />
        : (
          <>
            <ul className="space-y-2">{list.slice((cur - 1) * PER, cur * PER).map((r) => <RepoCard key={r.id} repo={r} onDelete={setDel} />)}</ul>
            {pages > 1 && (
              <div className="flex items-center justify-between pt-2 text-sm text-muted">
                <Button variant="secondary" disabled={cur === 1} onClick={() => setPage(cur - 1)} aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></Button>
                <span>Page {cur} of {pages}</span>
                <Button variant="secondary" disabled={cur === pages} onClick={() => setPage(cur + 1)} aria-label="Next page"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            )}
          </>
        )}

      <CreateRepoDialog open={create} onClose={() => setCreate(false)} />
      <ImportRepoDialog open={imp} onClose={() => setImp(false)} />
      <DeleteRepoDialog repo={del} onClose={() => setDel(null)} />
    </div>
  )
}
