import { useState } from 'react'
import { Button, Dialog, Field } from './ui'
import { api, errMsg } from '../lib/api'
import { useToast } from './Toast'
import { useRepos } from '../hooks/useRepos'
import type { Repo } from '../types'

export function ImportRepoDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast()
  const { addRepo } = useRepos()
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const m = value.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').replace(/\/$/, '').match(/^([\w.-]+)\/([\w.-]+)$/)

  const submit = async () => {
    if (!m) return
    setBusy(true); setError('')
    try {
      const { repo } = await api<{ repo: Repo }>('/api/repos', { method: 'POST', body: { fork: { owner: m[1], name: m[2] } } })
      addRepo(repo)
      toast('success', `Fork of ${m[1]}/${m[2]} requested. GitHub may take a moment to finish copying.`, repo.url)
      setValue(''); onClose()
    } catch (e) { setError(errMsg(e)) } finally { setBusy(false) }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Import repository">
      <div className="space-y-4">
        <p className="text-sm text-muted">Copies a public GitHub repository into your account as a fork.</p>
        <Field label="Repository" value={value} onChange={(e) => setValue(e.target.value)} placeholder="owner/repository or GitHub URL" autoCapitalize="none" autoCorrect="off" error={value && !m ? 'Use the format owner/repository.' : undefined} />
        {error && <p className="rounded-lg border border-red-500/30 p-3 text-sm text-red-500" role="alert">{error}</p>}
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" loading={busy} disabled={!m} onClick={() => void submit()}>Import</Button>
        </div>
      </div>
    </Dialog>
  )
}
