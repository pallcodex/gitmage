import { cx } from '../lib/utils'

const S: Record<string, [string, string]> = {
  READY: ['Ready', 'bg-fg'], BUILDING: ['Building', 'bg-primary animate-pulse'], INITIALIZING: ['Starting', 'bg-primary animate-pulse'],
  QUEUED: ['Queued', 'bg-muted'], ERROR: ['Failed', 'bg-red-500'], CANCELED: ['Canceled', 'bg-muted'],
}
export const ACTIVE = ['BUILDING', 'INITIALIZING', 'QUEUED']

export function DeploymentStatus({ state }: { state: string }) {
  const [label, dot] = S[state] || [state, 'bg-muted']
  return <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted"><span className={cx('h-2 w-2 rounded-full', dot)} />{label}</span>
}
