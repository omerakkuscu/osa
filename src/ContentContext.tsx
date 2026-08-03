import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type ContentMap = Record<string, Record<string, string>>
const ContentContext = createContext<ContentMap>({})

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentMap>({})

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => { if (data?.content) setContent(data.content) })
      .catch(() => { /* CMS henüz hazır değilse sessizce statik metinlere devam edilir */ })
  }, [])

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

/**
 * Belirli bir CMS anahtarı için admin panelinden girilmiş bir override varsa onu,
 * yoksa `fallback` (statik i18n metni) döner. Site asla boş/kırık görünmez.
 */
export function useContentOverride(key: string, lang: string, fallback: string): string {
  const content = useContext(ContentContext)
  return content[key]?.[lang] || fallback
}
