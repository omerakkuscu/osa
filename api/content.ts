import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from './_lib/db.js'
import { verifySessionToken, parseCookies, COOKIE_NAME } from './_lib/auth.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getDb()

  if (req.method === 'GET') {
    try {
      const rows = await sql`SELECT key, lang, value FROM site_content`
      // { "announcement_bar_text": { "tr": "...", "de": "..." }, ... } şeklinde grupla
      const grouped: Record<string, Record<string, string>> = {}
      for (const r of rows as { key: string; lang: string; value: string }[]) {
        if (!grouped[r.key]) grouped[r.key] = {}
        grouped[r.key][r.lang] = r.value
      }
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120')
      return res.status(200).json({ content: grouped })
    } catch (err) {
      console.error('GET /api/content hata:', err)
      return res.status(200).json({ content: {} }) // CMS tablosu henüz yoksa sessizce boş dön, site kırılmasın
    }
  }

  if (req.method === 'PUT') {
    const cookies = parseCookies(req.headers.cookie)
    if (!verifySessionToken(cookies[COOKIE_NAME])) return res.status(401).json({ error: 'Yetkisiz' })
    try {
      const { key, lang, value } = req.body || {}
      if (!key || !lang || typeof value !== 'string') return res.status(400).json({ error: 'key, lang ve value zorunludur' })
      await sql`
        INSERT INTO site_content (key, lang, value, updated_at) VALUES (${key}, ${lang}, ${value}, now())
        ON CONFLICT (key, lang) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
      `
      return res.status(200).json({ success: true })
    } catch (err) {
      console.error('PUT /api/content hata:', err)
      return res.status(500).json({ error: 'Kaydedilemedi — migration çalıştırıldı mı?' })
    }
  }

  res.setHeader('Allow', 'GET, PUT')
  return res.status(405).json({ error: 'Yöntem desteklenmiyor' })
}
