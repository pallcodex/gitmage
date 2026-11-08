import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button, Dialog, Field } from './ui'
import { ApiError, api, errMsg } from '../lib/api'
import { useToast } from './Toast'
import { useRepos } from '../hooks/useRepos'
import type { Repo } from '../types'

export function DeleteRepoDialog({ repo, onClose }: { repo: Repo | null; onClose: () => void }) {
  const toast = useToast()
  const { removeRepo, reload } = useRepos()
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [forbidden, setForbidden] = useState(false)
  useEffect(() => { setConfirm(''); setError(''); setForbidden(false) }, [repo])

  const submit = async () => {
    if (!repo) return
    setBusy(true); setError('')
    try {
      await api('/api/repos', { method: 'DELETE', body: { owner: repo.owner, name: repo.name, confirm } })
      removeRepo(repo.id) // hanya setelah GitHub berhasil
      toast('success', `Repository ${repo.fullName} was deleted.`)
      onClose()
      void reload()
    } catch (e) {
      setError(errMsg(e)); setForbidden(e instanceof ApiError && e.status === 403)
    } finally { setBusy(false) }
  }

  return (
    <Dialog open={!!repo} onClose={onClose} title="Delete repository">
      {repo && (
        <div className="space-y-4">
          <div className="flex gap-3 rounded-lg border border-red-500/30 p-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p>This action is permanent. <span className="font-medium break-all">{repo.fullName}</span> and its issues, pull requests and history will be deleted from GitHub.</p>
          </div>
          <Field label={`Type "${repo.name}" to confirm`} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoCapitalize="none" autoCorrect="off" />
          {error && <p className="rounded-lg border border-red-500/30 p-3 text-sm text-red-500" role="alert">{error}{forbidden && ' If GitHub asked for extra verification, complete it on github.com. If the delete_repo permission is missing, log out and sign in again to grant it.'}</p>}
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button variant="danger" className="flex-1" loading={busy} disabled={confirm !== repo.name} onClick={() => void submit()}>Delete</Button>
          </div>
        </div>
      )}
    </Dialog>
  )
}
