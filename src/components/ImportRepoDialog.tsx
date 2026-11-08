import { useState } from 'react'
import { Button, Dialog, Field } from './ui'
import { api, errMsg } from '../lib/api'
import { t } from '../lib/i18n'
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
      toast('success', t('im.success', { name: `${m[1]}/${m[2]}` }), repo.url)
      setValue(''); onClose()
    } catch (e) { setError(errMsg(e)) } finally { setBusy(false) }
  }

  return (
    <Dialog open={open} onClose={onClose} title={t('im.title')}>
      <div className="space-y-4">
        <p className="text-sm text-muted">{t('im.text')}</p>
        <Field label={t('im.label')} value={value} onChange={(e) => setValue(e.target.value)} placeholder={t('im.ph')} autoCapitalize="none" autoCorrect="off" error={value && !m ? t('im.err') : undefined} />
        {error && <p className="rounded-lg border border-red-500/30 p-3 text-sm text-red-500" role="alert">{error}</p>}
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>{t('cancel')}</Button>
          <Button className="flex-1" loading={busy} disabled={!m} onClick={() => void submit()}>{t('im.submit')}</Button>
        </div>
      </div>
    </Dialog>
  )
}
