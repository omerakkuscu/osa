import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createSessionToken, verifySessionToken, verifyLoginPassword, parseCookies, hashPassword, COOKIE_NAME } from '../_lib/auth.js'
import { getDb } from '../_lib/db.js'

// Vercel'in serverless fonksiyon limitini aşmamak için login/logout/session/change-password
// tek dosyada birleştirildi: /api/admin/auth?action=login|logout|session|change-password

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = String(req.query.action || '')

  if (action === 'session') {
    const cookies = parseCookies(req.headers.cookie)
    const authenticated = verifySessionToken(cookies[COOKIE_NAME])
    return res.status(200).json({ authenticated })
  }

  if (action === 'logout') {
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`)
    return res.status(200).json({ success: true })
  }

  if (action === 'login') {
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Yöntem desteklenmiyor' }) }
    const { password } = req.body || {}
    if (typeof password !== 'string' || !password) return res.status(400).json({ error: 'Şifre gerekli' })

    let dbHash: string | null = null
    try {
      const sql = getDb()
      const rows = await sql`SELECT admin_password_hash FROM site_settings WHERE id = 1`
      dbHash = rows[0]?.admin_password_hash || null
    } catch (err) {
      console.error('site_settings okunamadı, ADMIN_PASSWORD env var kullanılacak:', err)
    }

    if (!verifyLoginPassword(password, dbHash)) return res.status(401).json({ error: 'Şifre yanlış' })

    const token = createSessionToken()
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`)
    return res.status(200).json({ success: true })
  }

  if (action === 'change-password') {
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Yöntem desteklenmiyor' }) }
    const cookies = parseCookies(req.headers.cookie)
    if (!verifySessionToken(cookies[COOKIE_NAME])) return res.status(401).json({ error: 'Yetkisiz' })

    const { newPassword } = req.body || {}
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ error: 'Yeni şifre en az 8 karakter olmalı' })
    }

    try {
      const sql = getDb()
      const hash = hashPassword(newPassword)
      await sql`
        INSERT INTO site_settings (id, admin_password_hash, updated_at) VALUES (1, ${hash}, now())
        ON CONFLICT (id) DO UPDATE SET admin_password_hash = EXCLUDED.admin_password_hash, updated_at = now()
      `
      return res.status(200).json({ success: true })
    } catch (err) {
      console.error('change-password hata:', err)
      return res.status(500).json({ error: 'Şifre güncellenemedi — site_settings tablosu için migration çalıştırıldı mı?' })
    }
  }

  return res.status(400).json({ error: 'Geçersiz action parametresi' })
}
