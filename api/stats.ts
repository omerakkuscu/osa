import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from './_lib/db.js'
import { verifySessionToken, parseCookies, COOKIE_NAME } from './_lib/auth.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cookies = parseCookies(req.headers.cookie)
  if (!verifySessionToken(cookies[COOKIE_NAME])) return res.status(401).json({ error: 'Yetkisiz' })

  try {
    const sql = getDb()
    const [productStats] = await sql`
      SELECT
        COUNT(*)::int AS total_products,
        COUNT(*) FILTER (WHERE sold = false AND stock <= 3)::int AS low_stock_count,
        COUNT(*) FILTER (WHERE sold = true)::int AS sold_count
      FROM products
    `
    let orderStats = { total_orders: 0, total_revenue: 0 }
    try {
      const [rows] = await sql`SELECT COUNT(*)::int AS total_orders, COALESCE(SUM(total_amount), 0)::float AS total_revenue FROM orders WHERE status = 'paid'`
      orderStats = rows as typeof orderStats
    } catch { /* orders tablosu yoksa sıfır dön */ }

    return res.status(200).json({
      totalProducts: productStats.total_products,
      lowStockCount: productStats.low_stock_count,
      soldCount: productStats.sold_count,
      totalOrders: orderStats.total_orders,
      totalRevenue: orderStats.total_revenue,
    })
  } catch (err) {
    console.error('GET /api/stats hata:', err)
    return res.status(500).json({ error: 'İstatistikler yüklenemedi' })
  }
}
