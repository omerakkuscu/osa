import { useEffect, useState } from 'react'
import { products as staticProducts, type Product, type VehicleCompat } from '../data'
import { useLanguage } from '../LanguageContext'

type ApiProduct = {
  id: number; name: string; category: string; price_value: string; is_new: boolean; sold: boolean
  images: string[]; source_url: string | null; description: string | null; added_at: string
  stock: number; compatibility: VehicleCompat[]; video_url: string | null
  airbag_included: boolean | null; stitching: string | null; vanguard_edition: boolean; vanguard_edition_limit: number | null
  translations: { lang: string; name: string; description: string | null }[]
}

function mapApiProduct(p: ApiProduct, lang: string): Product {
  const t = p.translations?.find((tr) => tr.lang === lang)
  return {
    id: p.id,
    name: t?.name || p.name,
    category: p.category as Product['category'],
    price: `${Number(p.price_value).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} €`,
    priceValue: Number(p.price_value),
    isNew: p.is_new,
    sold: p.sold,
    images: p.images,
    sourceUrl: p.source_url || '',
    addedAt: p.added_at,
    stock: typeof p.stock === 'number' ? p.stock : 1,
    compatibility: Array.isArray(p.compatibility) ? p.compatibility : [],
    videoUrl: p.video_url || undefined,
    airbagIncluded: p.airbag_included ?? undefined,
    stitching: p.stitching || undefined,
    vanguardEdition: p.vanguard_edition || false,
    vanguardEditionLimit: p.vanguard_edition_limit ?? undefined,
  }
}

/**
 * Ürünleri gerçek veritabanından çeker. API henüz hazır değilse (env var eksik,
 * bağlantı sorunu vb.) sessizce statik yedek veriye düşer — mağaza asla boş kalmaz.
 */
export function useProducts() {
  const { lang } = useLanguage()
  const [products, setProducts] = useState<Product[]>(staticProducts)
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch('/api/products')
      .then((r) => { if (!r.ok) throw new Error('API hatası'); return r.json() })
      .then((data) => {
        if (cancelled) return
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products.map((p: ApiProduct) => mapApiProduct(p, lang)))
          setIsLive(true)
        }
      })
      .catch(() => { if (!cancelled) setIsLive(false) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [lang])

  return { products, loading, isLive }
}
