const DEEPL_LANG_MAP: Record<string, string> = {
  tr: 'TR', de: 'DE', en: 'EN-US', fr: 'FR', ru: 'RU', zh: 'ZH', ar: 'AR', es: 'ES', ja: 'JA',
}

/**
 * Verilen metni belirtilen tüm dillere çevirir. DeepL API anahtarı yoksa veya
 * bir dil için çeviri başarısız olursa, o dil için orijinal metne düşer (sessizce) —
 * böylece çeviri hatası ürün/yorum kaydını asla engellemez.
 */
export async function translateText(text: string, targetLangs: string[], sourceLang = 'TR'): Promise<Record<string, string>> {
  const results: Record<string, string> = {}
  const apiKey = process.env.DEEPL_API_KEY

  if (!apiKey || !text.trim()) {
    for (const lang of targetLangs) results[lang] = text
    return results
  }

  const isFreeKey = apiKey.trim().endsWith(':fx')
  const endpoint = isFreeKey ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate'

  await Promise.all(targetLangs.map(async (lang) => {
    if (lang === sourceLang.toLowerCase()) { results[lang] = text; return }
    const deeplLang = DEEPL_LANG_MAP[lang]
    if (!deeplLang) { results[lang] = text; return }
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `DeepL-Auth-Key ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: [text], target_lang: deeplLang, source_lang: sourceLang }),
      })
      if (!res.ok) { results[lang] = text; return }
      const data = await res.json()
      results[lang] = data?.translations?.[0]?.text || text
    } catch {
      results[lang] = text
    }
  }))

  return results
}
