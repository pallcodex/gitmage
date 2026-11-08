import type { VercelRequest, VercelResponse } from '@vercel/node'
import { gh, ghFail, guard, json } from './_lib.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const s = guard(req, res, ['GET'])
  if (!s) return
  const r = await gh(s, '/user')
  if (!r.ok) return ghFail(res, r)
  const u = (await r.json()) as { login: string; name: string | null; avatar_url: string; html_url: string }
  json(res, 200, { login: u.login, name: u.name, avatarUrl: u.avatar_url, url: u.html_url, vercelConfigured: !!process.env.VERCEL_TOKEN })
}
