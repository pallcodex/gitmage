import type { VercelRequest, VercelResponse } from '@vercel/node'
import { SESSION_COOKIE, clearCookie, guard, json } from '../_lib.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  guard(req, res, ['POST'], false)
  if (res.writableEnded) return
  clearCookie(res, SESSION_COOKIE)
  json(res, 200, { ok: true })
}
