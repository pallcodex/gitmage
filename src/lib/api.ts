import { t, translateServer } from './i18n'

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message) }
}

interface Init { method?: string; body?: unknown; quiet?: boolean }

export async function api<T>(path: string, init: Init = {}): Promise<T> {
  const r = await fetch(path, {
    method: init.method || 'GET',
    credentials: 'same-origin',
    headers: { 'X-Gitmage': '1', ...(init.body ? { 'Content-Type': 'application/json' } : {}) },
    body: init.body ? JSON.stringify(init.body) : undefined,
  })
  const data = (await r.json().catch(() => ({}))) as { error?: string }
  if (!r.ok) {
    if (r.status === 401 && !init.quiet) window.dispatchEvent(new Event('gitmage:expired'))
    throw new ApiError(r.status, data.error === 'session_expired' ? t('login.expired') : data.error ? translateServer(data.error) : t('err.request', { n: r.status }))
  }
  return data as T
}

export const errMsg = (e: unknown) => (e instanceof Error ? e.message : t('err.generic'))
