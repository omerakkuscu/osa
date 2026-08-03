import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { getDb } from './_lib/db.js'

type CartItem = { productId: number; quantity: number }
type ProductRow = { id: number; name: string; price_value: string | number; images: string[]; sold: boolean; stock: number }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Yöntem desteklenmiyor' })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return res.status(500).json({ error: 'Ödeme sistemi henüz yapılandırılmadı (STRIPE_SECRET_KEY eksik)' })
  const stripe = new Stripe(secretKey)

  try {
    const { items, customerEmail, shippingAddress } = req.body || {}
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Sepet boş' })

    const sql = getDb()
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    const origin = (req.headers.origin as string) || `https://${req.headers.host}`

    for (const item of items as CartItem[]) {
      const rows = await sql`SELECT * FROM products WHERE id = ${item.productId}`
      const product = rows[0] as ProductRow | undefined
      if (!product || product.sold) continue
      const requestedQty = Math.max(1, Number(item.quantity) || 1)
      const availableStock = typeof product.stock === 'number' ? product.stock : 1
      const safeQty = Math.min(requestedQty, availableStock)
      if (safeQty <= 0) continue
      const firstImage = Array.isArray(product.images) && product.images[0] ? `${origin}${product.images[0]}` : undefined
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: product.name, images: firstImage ? [firstImage] : [], metadata: { osaProductId: String(product.id) } },
          unit_amount: Math.round(Number(product.price_value) * 100),
        },
        quantity: safeQty,
      })
    }

    if (lineItems.length === 0) return res.status(400).json({ error: 'Geçerli/satın alınabilir ürün bulunamadı' })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // payment_method_types kasıtlı olarak belirtilmiyor: Stripe Checkout, Dashboard'da
      // (Settings → Payment methods) etkinleştirdiğiniz tüm yöntemleri (kart, Klarna,
      // PayPal, Sofort/giropay vb.) otomatik olarak gösterir.
      line_items: lineItems,
      customer_email: typeof customerEmail === 'string' ? customerEmail : undefined,
      shipping_address_collection: { allowed_countries: ['DE', 'AT', 'CH', 'TR', 'FR', 'NL', 'BE', 'LU', 'ES', 'IT'] },
      success_url: `${origin}/siparis-onay?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/odeme`,
      metadata: { shippingAddress: JSON.stringify(shippingAddress || {}) },
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('POST /api/checkout hata:', err)
    return res.status(500).json({ error: 'Ödeme oturumu oluşturulamadı' })
  }
}
