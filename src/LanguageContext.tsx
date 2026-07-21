import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type Lang, dict, languages } from './i18n'

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string, vars?: Record<string, string | number>) => string }
const LanguageContext = createContext<Ctx | null>(null)

function detectInitialLang(): Lang {
  try {
    const saved = localStorage.getItem('osa-lang') as Lang | null
    if (saved && dict[saved]) return saved
  } catch { /* localStorage unavailable */ }
  const browser = (navigator.language || 'en').slice(0, 2)
  const supported = languages.map(l => l.code)
  return (supported as string[]).includes(browser) ? (browser as Lang) : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang)

  useEffect(() => {
    const meta = languages.find(l => l.code === lang)
    document.documentElement.lang = lang
    document.documentElement.dir = meta?.dir || 'ltr'
  }, [lang])

  function setLang(l: Lang) {
    setLangState(l)
    try { localStorage.setItem('osa-lang', l) } catch { /* ignore */ }
  }

  function t(key: string, vars?: Record<string, string | number>) {
    let str = dict[lang][key] ?? dict.en[key] ?? key
    if (vars) for (const [k, v] of Object.entries(vars)) str = str.replace(`{${k}}`, String(v))
    return str
  }

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
