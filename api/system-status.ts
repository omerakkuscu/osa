import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifySessionToken, parseCookies, COOKIE_NAME } from './_lib/auth.js'
import { getDb } from './_lib/db.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cookies = parseCookies(req.headers.cookie)
  if (!verifySessionToken(cookies[COOKIE_NAME])) return res.status(401).json({ error: 'Yetkisiz' })

  let dbConnected = false
  try {
    const sql = getDb()
    await sql`SELECT 1`
    dbConnected = true
  } catch { /* bağlantı yok */ }

  return res.status(200).json({
    database: dbConnected,
    deepl: !!process.env.DEEPL_API_KEY,
    stripe: !!process.env.STRIPE_SECRET_KEY,
    stripeWebhook: !!process.env.STRIPE_WEBHOOK_SECRET,
    adminPasswordSource: process.env.ADMIN_PASSWORD ? 'env' : 'none',
  })
}
