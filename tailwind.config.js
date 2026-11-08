/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        elevated: 'var(--elevated)',
        border: 'var(--border)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        primary: { DEFAULT: 'var(--primary)', hover: 'var(--primary-hover)' },
      },
    },
  },
  plugins: [],
}
