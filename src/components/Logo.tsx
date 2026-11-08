export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <circle cx="11" cy="9.5" r="2.4" fill="#fff" /><circle cx="11" cy="22.5" r="2.4" fill="#fff" /><circle cx="21" cy="14" r="2.4" fill="#fff" />
      <path d="M11 12v8M11 18c0-3 4-2.5 8-3.2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
