import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { getDb } from './_lib/db.js'

// Stripe imza doğrulaması ham (raw) gövde gerektirir — Vercel'in otomatik JSON parse'ını kapatıyoruz.
export const config = { api: { bodyParser: false } }

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secretKey || !webhookSecret) return res.status(500).json({ error: 'Stripe yapılandırması eksik' })
  const stripe = new Stripe(secretKey)

  const signature = req.headers['stripe-signature']
  let event: Stripe.Event
  try {
    const rawBody = await readRawBody(req)
    event = stripe.webhooks.constructEvent(rawBody, signature as string, webhookSecret)
  } catch (err) {
    console.error('Webhook imza doğrulaması başarısız:', err)
    return res.status(400).send('Webhook signature verification failed')
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] })
      const shippingAddress = session.metadata?.shippingAddress ? JSON.parse(session.metadata.shippingAddress) : {}
      const sql = getDb()
      await sql`
        INSERT INTO orders (stripe_session_id, customer_name, customer_email, shipping_address, items, total_amount, currency, payment_method, status)
        VALUES (
          ${session.id},
          ${session.customer_details?.name || ''},
          ${session.customer_details?.email || ''},
          ${JSON.stringify(shippingAddress)}::jsonb,
          ${JSON.stringify(lineItems.data.map((li) => ({ description: li.description, quantity: li.quantity, amount: li.amount_total })))}::jsonb,
          ${(session.amount_total || 0) / 100},
          ${session.currency || 'eur'},
          ${session.payment_method_types?.[0] || null},
          'paid'
        )
        ON CONFLICT (stripe_session_id) DO NOTHING
      `

      // Stoğu satın alınan adet kadar düş (0'ın altına inmez)
      for (const li of lineItems.data) {
        const product = li.price?.product
        const osaProductId = typeof product === 'object' && product && 'metadata' in product ? (product as Stripe.Product).metadata?.osaProductId : undefined
        if (!osaProductId) continue
        const qty = li.quantity || 1
        await sql`UPDATE products SET stock = GREATEST(0, stock - ${qty}), updated_at = now() WHERE id = ${Number(osaProductId)}`
      }
    } catch (err) {
      console.error('Sipariş veritabanına kaydedilemedi:', err)
      // Stripe'a yine de 200 dönüyoruz — aksi halde Stripe olayı tekrar tekrar dener;
      // hata zaten log'lara düşüyor, gerekirse elle Stripe panelinden kontrol edilebilir.
    }
  }

  return res.status(200).json({ received: true })
}
