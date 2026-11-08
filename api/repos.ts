import type { VercelRequest, VercelResponse } from '@vercel/node'
import { NAME_RE, gh, ghFail, guard, json, str } from './_lib.js'

interface GhRepo {
  id: number; name: string; full_name: string; owner: { login: string }; description: string | null
  private: boolean; default_branch: string; html_url: string; updated_at: string; pushed_at: string | null
  permissions?: { admin?: boolean }
}
interface Body {
  name?: unknown; description?: unknown; private?: unknown; autoInit?: unknown; gitignore?: unknown; license?: unknown
  owner?: unknown; confirm?: unknown; fork?: { owner?: unknown; name?: unknown }
}

const pick = (r: GhRepo) => ({
  id: r.id, name: r.name, fullName: r.full_name, owner: r.owner.login, description: r.description,
  private: r.private, defaultBranch: r.default_branch, url: r.html_url,
  updatedAt: r.pushed_at && r.pushed_at > r.updated_at ? r.pushed_at : r.updated_at,
  canDelete: !!r.permissions?.admin,
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const s = guard(req, res, ['GET', 'POST', 'DELETE'])
  if (!s) return
  const body: Body = typeof req.body === 'object' && req.body ? req.body : {}

  if (req.method === 'GET') {
    const repos: ReturnType<typeof pick>[] = []
    for (let page = 1; page <= 10; page++) {
      const r = await gh(s, `/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner,collaborator,organization_member`)
      if (!r.ok) return ghFail(res, r)
      const list = (await r.json()) as GhRepo[]
      repos.push(...list.map(pick))
      if (list.length < 100) break
    }
    repos.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    return json(res, 200, { repos })
  }

  if (req.method === 'POST') {
    if (body.fork) {
      const owner = str(body.fork.owner, 100), name = str(body.fork.name, 100)
      if (!NAME_RE.test(owner) || !NAME_RE.test(name)) return json(res, 422, { error: 'Use the format owner/repository.' })
      const r = await gh(s, `/repos/${owner}/${name}/forks`, { method: 'POST', body: '{}' })
      if (!r.ok) return ghFail(res, r)
      return json(res, 202, { repo: pick((await r.json()) as GhRepo) })
    }
    const name = str(body.name, 100)
    if (!NAME_RE.test(name) || name === '.' || name === '..' || name.endsWith('.git'))
      return json(res, 422, { error: 'Invalid repository name. Use letters, numbers, ".", "-" and "_" only.' })
    const payload: Record<string, unknown> = { name, description: str(body.description), private: !!body.private, auto_init: !!body.autoInit }
    const g = str(body.gitignore, 40), l = str(body.license, 40)
    if (g) { payload.gitignore_template = g; payload.auto_init = true }
    if (l) { payload.license_template = l; payload.auto_init = true }
    const r = await gh(s, '/user/repos', { method: 'POST', body: JSON.stringify(payload) })
    if (!r.ok) return ghFail(res, r)
    return json(res, 201, { repo: pick((await r.json()) as GhRepo) })
  }

  // DELETE: validasi di server, bukan hanya di frontend
  const owner = str(body.owner, 100), name = str(body.name, 100)
  if (!NAME_RE.test(owner) || !NAME_RE.test(name)) return json(res, 422, { error: 'Invalid repository.' })
  if (str(body.confirm, 100) !== name) return json(res, 422, { error: 'Confirmation does not match the repository name.' })
  const info = await gh(s, `/repos/${owner}/${name}`)
  if (!info.ok) return ghFail(res, info)
  if (!((await info.json()) as GhRepo).permissions?.admin)
    return json(res, 403, { error: 'You do not have admin permission on this repository.' })
  const r = await gh(s, `/repos/${owner}/${name}`, { method: 'DELETE' })
  if (r.status !== 204) return ghFail(res, r)
  json(res, 200, { ok: true })
}
