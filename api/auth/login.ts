import crypto from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { baseUrl, seal, setCookie } from '../_lib.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GITHUB_CLIENT_ID
  if (!clientId) return void res.status(500).send('GITHUB_CLIENT_ID is not configured')
  const state = crypto.randomBytes(16).toString('base64url')
  const verifier = crypto.randomBytes(32).toString('base64url')
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url')
  setCookie(res, 'gitmage_oauth', seal({ state, verifier }), 600)
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl(req)}/api/auth/callback`,
    scope: 'repo delete_repo',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  })
  res.redirect(302, `https://github.com/login/oauth/authorize?${params}`)
}
