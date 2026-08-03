export type AdminProduct = {
  id: number; name: string; category: string; price_value: string; is_new: boolean; sold: boolean
  images: string[]; source_url: string | null; description: string | null; added_at: string
  stock: number; compatibility: { brand: string; model: string; years: string }[]; video_url: string | null
  airbag_included: boolean | null; stitching: string | null; vanguard_edition: boolean; vanguard_edition_limit: number | null
}

export type GalleryImage = { id: number; image_url: string; caption: string | null; sort_order: number }

export type DashboardStats = {
  totalProducts: number; lowStockCount: number; soldCount: number
  totalOrders: number; totalRevenue: number
}

export const LANGS = ['tr', 'de', 'en', 'fr', 'ru', 'zh', 'ar', 'es', 'ja'] as const
export const LANG_LABELS: Record<string, string> = {
  tr: 'Türkçe', de: 'Deutsch', en: 'English', fr: 'Français', ru: 'Русский', zh: '中文', ar: 'العربية', es: 'Español', ja: '日本語',
}
