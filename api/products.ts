import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from './_lib/db.js'
import { verifySessionToken, parseCookies, COOKIE_NAME } from './_lib/auth.js'
import { translateText } from './_lib/translate.js'

const LANGS = ['tr', 'de', 'en', 'fr', 'ru', 'zh', 'ar', 'es', 'ja']

// Vercel'in serverless fonksiyon limitini aşmamak için koleksiyon (GET/POST) ve
// tekil ürün (PUT/DELETE, ?id=) uç noktaları tek dosyada birleştirildi.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getDb()
  const hasId = req.query.id !== undefined

  // --- GET /api/products (herkese açık liste) ---
  if (req.method === 'GET' && !hasId) {
    try {
      const products = await sql`SELECT * FROM products ORDER BY created_at DESC`
      const translations = await sql`SELECT * FROM product_translations`
      const merged = products.map((p: Record<string, unknown>) => ({
        ...p,
        translations: translations.filter((t: Record<string, unknown>) => t.product_id === p.id),
      }))
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120')
      return res.status(200).json({ products: merged })
    } catch (err) {
      console.error('GET /api/products hata:', err)
      return res.status(500).json({ error: 'Ürünler yüklenemedi' })
    }
  }

  // --- POST /api/products (admin — yeni ürün) ---
  if (req.method === 'POST' && !hasId) {
    const cookies = parseCookies(req.headers.cookie)
    if (!verifySessionToken(cookies[COOKIE_NAME])) return res.status(401).json({ error: 'Yetkisiz' })

    try {
      const { name, category, priceValue, images, sourceUrl, description, stock, compatibility, videoUrl, airbagIncluded, stitching, vanguardEdition, vanguardEditionLimit } = req.body || {}
      if (!name || !category || typeof priceValue !== 'number') {
        return res.status(400).json({ error: 'name, category ve priceValue zorunludur' })
      }
      const [product] = await sql`
        INSERT INTO products (name, category, price_value, images, source_url, description, stock, compatibility, video_url, airbag_included, stitching, vanguard_edition, vanguard_edition_limit)
        VALUES (
          ${name}, ${category}, ${priceValue}, ${JSON.stringify(images || [])}::jsonb, ${sourceUrl || null}, ${description || null},
          ${typeof stock === 'number' ? stock : 1},
          ${JSON.stringify(compatibility || [])}::jsonb,
          ${videoUrl || null},
          ${typeof airbagIncluded === 'boolean' ? airbagIncluded : null},
          ${stitching || null},
          ${typeof vanguardEdition === 'boolean' ? vanguardEdition : false},
          ${typeof vanguardEditionLimit === 'number' ? vanguardEditionLimit : null}
        )
        RETURNING *
      `

      try {
        const nameT = await translateText(name, LANGS)
        const descT = description ? await translateText(description, LANGS) : {}
        for (const lang of LANGS) {
          await sql`
            INSERT INTO product_translations (product_id, lang, name, description)
            VALUES (${product.id}, ${lang}, ${nameT[lang] || name}, ${descT[lang] || description || null})
            ON CONFLICT (product_id, lang) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
          `
        }
      } catch (translateErr) {
        console.error('Çeviri hatası (ürün yine de oluşturuldu):', translateErr)
      }

      return res.status(201).json({ product })
    } catch (err) {
      console.error('POST /api/products hata:', err)
      return res.status(500).json({ error: 'Ürün oluşturulamadı' })
    }
  }

  // --- PUT/DELETE /api/products?id=X (admin — tekil ürün) ---
  if (hasId) {
    const cookies = parseCookies(req.headers.cookie)
    if (!verifySessionToken(cookies[COOKIE_NAME])) return res.status(401).json({ error: 'Yetkisiz' })

    const id = Number(req.query.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Geçersiz ürün ID' })

    if (req.method === 'PUT') {
      try {
        const [existing] = await sql`SELECT * FROM products WHERE id = ${id}`
        if (!existing) return res.status(404).json({ error: 'Ürün bulunamadı' })

        const body = req.body || {}
        const merged = {
          name: typeof body.name === 'string' ? body.name : existing.name,
          price_value: typeof body.priceValue === 'number' ? body.priceValue : existing.price_value,
          sold: typeof body.sold === 'boolean' ? body.sold : existing.sold,
          is_new: typeof body.isNew === 'boolean' ? body.isNew : existing.is_new,
          images: Array.isArray(body.images) ? JSON.stringify(body.images) : JSON.stringify(existing.images),
          description: typeof body.description === 'string' ? body.description : existing.description,
          stock: typeof body.stock === 'number' ? body.stock : existing.stock,
          compatibility: Array.isArray(body.compatibility) ? JSON.stringify(body.compatibility) : JSON.stringify(existing.compatibility),
          video_url: typeof body.videoUrl === 'string' ? body.videoUrl : existing.video_url,
          airbag_included: typeof body.airbagIncluded === 'boolean' ? body.airbagIncluded : existing.airbag_included,
          stitching: typeof body.stitching === 'string' ? body.stitching : existing.stitching,
          vanguard_edition: typeof body.vanguardEdition === 'boolean' ? body.vanguardEdition : existing.vanguard_edition,
          vanguard_edition_limit: typeof body.vanguardEditionLimit === 'number' ? body.vanguardEditionLimit : existing.vanguard_edition_limit,
        }

        const [product] = await sql`
          UPDATE products SET
            name = ${merged.name},
            price_value = ${merged.price_value},
            sold = ${merged.sold},
            is_new = ${merged.is_new},
            images = ${merged.images}::jsonb,
            description = ${merged.description},
            stock = ${merged.stock},
            compatibility = ${merged.compatibility}::jsonb,
            video_url = ${merged.video_url},
            airbag_included = ${merged.airbag_included},
            stitching = ${merged.stitching},
            vanguard_edition = ${merged.vanguard_edition},
            vanguard_edition_limit = ${merged.vanguard_edition_limit},
            updated_at = now()
          WHERE id = ${id}
          RETURNING *
        `

        if (body.name || body.description) {
          try {
            const nameT = await translateText(merged.name, LANGS)
            const descT = merged.description ? await translateText(merged.description, LANGS) : {}
            for (const lang of LANGS) {
              await sql`
                INSERT INTO product_translations (product_id, lang, name, description)
                VALUES (${id}, ${lang}, ${nameT[lang] || merged.name}, ${descT[lang] || merged.description || null})
                ON CONFLICT (product_id, lang) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
              `
            }
          } catch (translateErr) {
            console.error('Çeviri güncelleme hatası:', translateErr)
          }
        }

        return res.status(200).json({ product })
      } catch (err) {
        console.error('PUT /api/products?id hata:', err)
        return res.status(500).json({ error: 'Güncelleme başarısız' })
      }
    }

    if (req.method === 'DELETE') {
      try {
        await sql`DELETE FROM products WHERE id = ${id}`
        return res.status(200).json({ success: true })
      } catch (err) {
        console.error('DELETE /api/products?id hata:', err)
        return res.status(500).json({ error: 'Silme başarısız' })
      }
    }
  }

  res.setHeader('Allow', 'GET, POST, PUT, DELETE')
  return res.status(405).json({ error: 'Yöntem desteklenmiyor' })
}
