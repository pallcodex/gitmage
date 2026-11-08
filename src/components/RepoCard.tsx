import { ExternalLink, GitBranch, Globe, Lock, Trash2 } from 'lucide-react'
import type { Repo } from '../types'
import { timeAgo } from '../lib/utils'
import { t } from '../lib/i18n'

export function RepoCard({ repo, onDelete }: { repo: Repo; onDelete?: (r: Repo) => void }) {
  return (
    <li className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <a href={repo.url} target="_blank" rel="noreferrer" className="block truncate font-medium text-primary hover:underline">{repo.fullName}</a>
          <p className="mt-1 line-clamp-2 break-words text-sm text-muted">{repo.description || t('repo.noDesc')}</p>
        </div>
        <div className="flex shrink-0 items-center">
          <a href={repo.url} target="_blank" rel="noreferrer" aria-label={t('repo.open', { name: repo.name })} className="grid h-10 w-10 place-items-center rounded-lg text-muted hover:bg-elevated hover:text-fg"><ExternalLink className="h-4 w-4" /></a>
          {onDelete && repo.canDelete && (
            <button onClick={() => onDelete(repo)} aria-label={t('repo.delete', { name: repo.name })} className="grid h-10 w-10 place-items-center rounded-lg text-muted hover:bg-red-500/10 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1">{repo.private ? <Lock className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}{repo.private ? t('private') : t('public')}</span>
        <span className="inline-flex items-center gap-1"><GitBranch className="h-3.5 w-3.5" />{repo.defaultBranch}</span>
        <span>{t('repo.updated', { time: timeAgo(repo.updatedAt) })}</span>
      </div>
    </li>
  )
}
