import type { VercelRequest, VercelResponse } from '@vercel/node'
import { NAME_RE, gh, ghFail, guard, json, str } from './_lib.js'

// Token Vercel hanya dibaca dari environment server dan tidak pernah dikirim ke browser.
function vc(path: string, init: RequestInit = {}) {
  const team = process.env.VERCEL_TEAM_ID
  const sep = path.includes('?') ? '&' : '?'
  return fetch(`https://api.vercel.com${path}${team ? `${sep}teamId=${encodeURIComponent(team)}` : ''}`, {
    ...init,
    headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}`, 'Content-Type': 'application/json' },
  })
}

async function vcFail(res: VercelResponse, r: Response) {
  const b = (await r.json().catch(() => ({}))) as { error?: { message?: string } }
  json(res, r.status === 401 ? 502 : r.status, { error: b.error?.message || `Vercel error (${r.status})` })
}

interface VDep { uid: string; name: string; url: string; state?: string; readyState?: string; created?: number; createdAt?: number; target?: string | null; meta?: { githubCommitRef?: string } }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const s = guard(req, res, ['GET', 'POST'])
  if (!s) return
  if (!process.env.VERCEL_TOKEN) return json(res, 503, { error: 'vercel_not_configured' })
  const action = String(req.query.action || '')

  if (req.method === 'GET' && action === 'projects') {
    const r = await vc('/v9/projects?limit=100')
    if (!r.ok) return vcFail(res, r)
    const d = (await r.json()) as { projects: { id: string; name: string; framework: string | null; link?: { org?: string; repo?: string } }[] }
    return json(res, 200, { projects: d.projects.map((p) => ({ id: p.id, name: p.name, framework: p.framework, repo: p.link?.org && p.link.repo ? `${p.link.org}/${p.link.repo}` : null })) })
  }

  if (req.method === 'GET' && action === 'deployments') {
    const r = await vc('/v6/deployments?limit=15')
    if (!r.ok) return vcFail(res, r)
    const d = (await r.json()) as { deployments: VDep[] }
    return json(res, 200, { deployments: d.deployments.map((x) => ({ id: x.uid, name: x.name, url: x.url, state: x.state || x.readyState || 'UNKNOWN', createdAt: x.created || x.createdAt || 0, branch: x.meta?.githubCommitRef || null, target: x.target || null })) })
  }

  if (req.method === 'POST' && action === 'deploy') {
    const b = (typeof req.body === 'object' && req.body ? req.body : {}) as Record<string, unknown>
    const project = str(b.project, 100), owner = str(b.owner, 100), repo = str(b.repo, 100), branch = str(b.branch, 250)
    if (!project || !branch || !NAME_RE.test(owner) || !NAME_RE.test(repo)) return json(res, 422, { error: 'Repository, branch and project are required.' })
    const gr = await gh(s, `/repos/${owner}/${repo}`) // memastikan pengguna punya akses ke repo
    if (!gr.ok) return ghFail(res, gr)
    const info = (await gr.json()) as { id: number; default_branch: string }
    const r = await vc('/v13/deployments?forceNew=1', {
      method: 'POST',
      body: JSON.stringify({ name: project, project, ...(branch === info.default_branch ? { target: 'production' } : {}), gitSource: { type: 'github', repoId: info.id, ref: branch } }),
    })
    if (!r.ok) return vcFail(res, r)
    const d = (await r.json()) as { id: string; url: string; readyState?: string }
    return json(res, 201, { id: d.id, url: d.url, state: d.readyState || 'QUEUED' })
  }

  json(res, 400, { error: 'Unknown action' })
}
