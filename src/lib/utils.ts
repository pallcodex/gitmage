export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')

export function timeAgo(input: string | number): string {
  const s = (new Date(input).getTime() - Date.now()) / 1000
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const units: [Intl.RelativeTimeFormatUnit, number][] = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]]
  for (const [unit, sec] of units) if (Math.abs(s) >= sec) return rtf.format(Math.round(s / sec), unit)
  return 'just now'
}
