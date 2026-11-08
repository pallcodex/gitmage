import { cx } from '../lib/utils'
import { t, type Key } from '../lib/i18n'

const DOT: Record<string, string> = {
  READY: 'bg-fg', BUILDING: 'bg-primary animate-pulse', INITIALIZING: 'bg-primary animate-pulse',
  QUEUED: 'bg-muted', ERROR: 'bg-red-500', CANCELED: 'bg-muted',
}
export const ACTIVE = ['BUILDING', 'INITIALIZING', 'QUEUED']

export function DeploymentStatus({ state }: { state: string }) {
  const label = state in DOT ? t(`st.${state}` as Key) : state
  return <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted"><span className={cx('h-2 w-2 rounded-full', DOT[state] || 'bg-muted')} />{label}</span>
}
