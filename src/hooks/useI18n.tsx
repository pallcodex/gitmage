import { createContext, useContext, useState, type ReactNode } from 'react'
import { getLang, setLang as apply, type Lang } from '../lib/i18n'

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void } | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, set] = useState<Lang>(getLang())
  const setLang = (l: Lang) => { apply(l); set(l) }
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>
}

export function useI18n() {
  const c = useContext(Ctx)
  if (!c) throw new Error('I18nProvider missing')
  return c
}
