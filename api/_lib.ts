import crypto from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export interface Session { token: string; login: string; exp: number }

export const SESSION_COOKIE = 'gitmage_session'
const MAX_AGE = 60 * 60 * 24 * 30
const secure = () => process.env.NODE_ENV === 'production' || !!process.env.VERCEL

function key() {
  const s = process.env.SESSION_SECRET
  if (!s || s.length < 32) throw new Error('SESSION_SECRET is missing or shorter than 32 characters')
  return crypto.createHash('sha256').update(s).digest()
}

// AES-256-GCM: token GitHub hanya ada di cookie terenkripsi HttpOnly, tidak pernah dikirim ke JS browser.
export function seal(data: unknown): string {
  const iv = crypto.randomBytes(12)
  const c = crypto.createCipheriv('aes-256-gcm', key(), iv)
  const enc = Buffer.concat([c.update(JSON.stringify(data), 'utf8'), c.final()])
  return Buffer.concat([iv, c.getAuthTag(), enc]).toString('base64url')
}

export function unseal<T>(value?: string): T | null {
  try {
    const b = Buffer.from(value || '', 'base64url')
    const d = crypto.createDecipheriv('aes-256-gcm', key(), b.subarray(0, 12))
    d.setAuthTag(b.subarray(12, 28))
    return JSON.parse(Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8')) as T
  } catch {
    return null
  }
}

export function parseCookies(req: VercelRequest): Record<string, string> {
  const out: Record<string, string> = {}
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=')
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim())
  }
  return out
}

export function setCookie(res: VercelResponse, name: string, value: string, maxAge: number) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${maxAge}`]
  if (secure()) parts.push('Secure')
  const prev = res.getHeader('Set-Cookie')
  const list = Array.isArray(prev) ? prev : prev ? [String(prev)] : []
  res.setHeader('Set-Cookie', [...list, parts.join('; ')])
}

export const clearCookie = (res: VercelResponse, name: string) => setCookie(res, name, '', 0)

export function startSession(res: VercelResponse, s: { token: string; login: string }) {
  setCookie(res, SESSION_COOKIE, seal({ ...s, exp: Date.now() + MAX_AGE * 1000 }), MAX_AGE)
}

export function baseUrl(req: VercelRequest): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '')
  const proto = String(req.headers['x-forwarded-proto'] || 'http').split(',')[0]
  return `${proto}://${req.headers.host}`
}

export const json = (res: VercelResponse, status: number, body: unknown) => res.status(status).json(body)

/** Validasi method, CSRF (header kustom + Origin), dan session. Mengembalikan session atau null (respons sudah dikirim). */
export function guard(req: VercelRequest, res: VercelResponse, methods: string[], needSession = true): Session | null {
  if (!methods.includes(req.method || '')) {
    res.setHeader('Allow', methods.join(', '))
    json(res, 405, { error: 'Method not allowed' })
    return null
  }
  if (req.method !== 'GET') {
    const origin = req.headers.origin
    let sameOrigin = true
    try { sameOrigin = !origin || new URL(origin).host === req.headers.host } catch { sameOrigin = false }
    if (req.headers['x-gitmage'] !== '1' || !sameOrigin) {
      json(res, 403, { error: 'Request rejected (CSRF protection)' })
      return null
    }
  }
  if (!needSession) return null
  const s = unseal<Session>(parseCookies(req)[SESSION_COOKIE])
  if (!s || s.exp < Date.now()) {
    clearCookie(res, SESSION_COOKIE)
    json(res, 401, { error: 'session_expired' })
    return null
  }
  return s
}

export function gh(s: Session, path: string, init: RequestInit = {}) {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Gitmage',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${s.token}`,
    },
  })
}

export async function ghFail(res: VercelResponse, r: Response) {
  if (r.status === 401) {
    clearCookie(res, SESSION_COOKIE)
    return json(res, 401, { error: 'session_expired' })
  }
  const b = (await r.json().catch(() => ({}))) as { message?: string; errors?: { message?: string }[] }
  const detail = b.errors?.map((e) => e.message).filter(Boolean).join('; ')
  return json(res, r.status, { error: [b.message, detail].filter(Boolean).join(': ') || `GitHub error (${r.status})` })
}

export const NAME_RE = /^[A-Za-z0-9._-]{1,100}$/
export const str = (v: unknown, max = 350) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
