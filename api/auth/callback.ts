import type { VercelRequest, VercelResponse } from '@vercel/node'
import { baseUrl, clearCookie, parseCookies, startSession, unseal } from '../_lib.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const fail = (code: string) => { clearCookie(res, 'gitmage_oauth'); res.redirect(302, `/?error=${code}`) }
  try {
    const { code, state } = req.query as Record<string, string | undefined>
    const saved = unseal<{ state: string; verifier: string }>(parseCookies(req).gitmage_oauth)
    if (!code || !state || !saved || saved.state !== state) return fail('invalid_state')

    const tr = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${baseUrl(req)}/api/auth/callback`,
        code_verifier: saved.verifier,
      }),
    })
    const t = (await tr.json()) as { access_token?: string }
    if (!t.access_token) return fail('auth_failed')

    const ur = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${t.access_token}`, 'User-Agent': 'Gitmage', Accept: 'application/vnd.github+json' },
    })
    if (!ur.ok) return fail('auth_failed')
    const u = (await ur.json()) as { login: string }
    startSession(res, { token: t.access_token, login: u.login })
    clearCookie(res, 'gitmage_oauth')
    res.redirect(302, '/')
  } catch {
    fail('auth_failed')
  }
}
