import type { VercelRequest, VercelResponse } from '@vercel/node'
import { NAME_RE, gh, ghFail, guard, json } from './_lib.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const s = guard(req, res, ['GET'])
  if (!s) return
  const { owner = '', name = '' } = req.query as Record<string, string>
  if (!NAME_RE.test(owner) || !NAME_RE.test(name)) return json(res, 422, { error: 'Invalid repository.' })
  const r = await gh(s, `/repos/${owner}/${name}/branches?per_page=100`)
  if (!r.ok) return ghFail(res, r)
  json(res, 200, { branches: ((await r.json()) as { name: string }[]).map((b) => b.name) })
}
