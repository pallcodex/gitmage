import { useState } from 'react'
import { Button, Dialog, Field, SelectField } from './ui'
import { api, errMsg } from '../lib/api'
import { t } from '../lib/i18n'
import { useToast } from './Toast'
import { useRepos } from '../hooks/useRepos'
import type { Repo } from '../types'

const NAME_RE = /^[A-Za-z0-9._-]{1,100}$/
const GITIGNORE = ['Node', 'Python', 'Go', 'Java', 'Rust', 'Ruby', 'Swift', 'C++']
const LICENSES: [string, string][] = [['mit', 'MIT'], ['apache-2.0', 'Apache 2.0'], ['gpl-3.0', 'GPL 3.0'], ['bsd-3-clause', 'BSD 3-Clause'], ['mpl-2.0', 'MPL 2.0'], ['unlicense', 'Unlicense']]

export function CreateRepoDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast()
  const { addRepo } = useRepos()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [priv, setPriv] = useState(false)
  const [readme, setReadme] = useState(true)
  const [gitignore, setGitignore] = useState('')
  const [license, setLicense] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const nameErr = name && (!NAME_RE.test(name) || name === '.' || name === '..' || name.endsWith('.git')) ? t('cr.nameErr') : ''

  const submit = async () => {
    setBusy(true); setError('')
    try {
      const { repo } = await api<{ repo: Repo }>('/api/repos', { method: 'POST', body: { name, description, private: priv, autoInit: readme, gitignore, license } })
      addRepo(repo)
      toast('success', t('cr.success', { name: repo.fullName }), repo.url)
      setName(''); setDescription(''); setGitignore(''); setLicense('')
      onClose()
    } catch (e) { setError(errMsg(e)) } finally { setBusy(false) }
  }

  return (
    <Dialog open={open} onClose={onClose} title={t('cr.title')}>
      <div className="space-y-4">
        <Field label={t('cr.name')} value={name} onChange={(e) => setName(e.target.value)} error={nameErr} placeholder="my-project" autoCapitalize="none" autoCorrect="off" />
        <Field label={t('cr.desc')} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={350} />
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t('cr.visibility')}>
          {[false, true].map((p) => (
            <button key={String(p)} type="button" role="radio" aria-checked={priv === p} onClick={() => setPriv(p)} className={`min-h-11 rounded-lg border text-sm transition ${priv === p ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted'}`}>{p ? t('private') : t('public')}</button>
          ))}
        </div>
        <SelectField label=".gitignore" value={gitignore} onChange={(e) => setGitignore(e.target.value)}>
          <option value="">{t('cr.none')}</option>{GITIGNORE.map((g) => <option key={g}>{g}</option>)}
        </SelectField>
        <SelectField label={t('cr.license')} value={license} onChange={(e) => setLicense(e.target.value)}>
          <option value="">{t('cr.none')}</option>{LICENSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </SelectField>
        <label className="flex min-h-10 items-center gap-3 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-[var(--primary)]" checked={readme || !!gitignore || !!license} disabled={!!gitignore || !!license} onChange={(e) => setReadme(e.target.checked)} />
          {t('cr.readme')}
        </label>
        {error && <p className="rounded-lg border border-red-500/30 p-3 text-sm text-red-500" role="alert">{error}</p>}
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>{t('cancel')}</Button>
          <Button className="flex-1" loading={busy} disabled={!name || !!nameErr} onClick={() => void submit()}>{t('cr.submit')}</Button>
        </div>
      </div>
    </Dialog>
  )
}
