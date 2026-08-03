import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from './_lib/db.js'
import { verifySessionToken, parseCookies, COOKIE_NAME } from './_lib/auth.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getDb()

  if (req.method === 'GET') {
    try {
      const images = await sql`SELECT * FROM gallery_images ORDER BY sort_order ASC, created_at DESC`
      return res.status(200).json({ images })
    } catch (err) {
      console.error('GET /api/gallery hata:', err)
      return res.status(200).json({ images: [] })
    }
  }

  const cookies = parseCookies(req.headers.cookie)
  if (!verifySessionToken(cookies[COOKIE_NAME])) return res.status(401).json({ error: 'Yetkisiz' })

  if (req.method === 'POST') {
    try {
      const { imageUrl, caption } = req.body || {}
      if (!imageUrl) return res.status(400).json({ error: 'imageUrl zorunludur' })
      const [image] = await sql`INSERT INTO gallery_images (image_url, caption) VALUES (${imageUrl}, ${caption || null}) RETURNING *`
      return res.status(201).json({ image })
    } catch (err) {
      console.error('POST /api/gallery hata:', err)
      return res.status(500).json({ error: 'Eklenemedi — migration çalıştırıldı mı?' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = Number(req.query.id)
      if (!Number.isFinite(id)) return res.status(400).json({ error: 'Geçersiz ID' })
      await sql`DELETE FROM gallery_images WHERE id = ${id}`
      return res.status(200).json({ success: true })
    } catch (err) {
      console.error('DELETE /api/gallery hata:', err)
      return res.status(500).json({ error: 'Silinemedi' })
    }
  }

  res.setHeader('Allow', 'GET, POST, DELETE')
  return res.status(405).json({ error: 'Yöntem desteklenmiyor' })
}
