// Gerçek ReaperHex kataloğu (Spotify verisi)
export const tracks = [
  { id: '5W1wo0sQk3JHAK9Tq7wV1N', title: 'Derin Tapınakçılar', type: 'SINGLE', year: 2026, duration: '3:56', cover: 'https://i.scdn.co/image/ab67616d0000b273bc769c47f6ed8054ae600ee1' },
  { id: '44nlTCANqiUEKtsPcfNpoF', title: 'Su.', type: 'EP', year: 2025, duration: '2:18', cover: 'https://i.scdn.co/image/ab67616d0000b2734607b030fda07c5378223eae' },
  { id: '4ZMXLuv6GVbVEtro4dpVBZ', title: 'Patriot Agent', type: 'EP', year: 2024, duration: '2:01', cover: 'https://i.scdn.co/image/ab67616d0000b2737b154caf8408299d5658ce90' },
  { id: '2IXeq9DZXdk9wUZgLpMXHx', title: 'Law of Silence', type: 'EP', year: 2024, duration: '3:18', cover: 'https://i.scdn.co/image/ab67616d0000b27343eadb1b17997beb1bcb709f' },
  { id: '4jSfsbS5QOFZaDInaMa7jb', title: 'Havar Geylani (Ultra Remix)', type: 'SINGLE', year: 2024, duration: '2:38', cover: 'https://i.scdn.co/image/ab67616d0000b27345e5e4afc4acf3b057d1d35f' },
  { id: '01qfMN11dnfLwAy0BriI08', title: '2030', type: 'EP', year: 2024, duration: '3:04', cover: 'https://i.scdn.co/image/ab67616d0000b27370608cb55b4a14dee6fe9481' },
  { id: '3vBFvM6dBrzK7P40lvbFvj', title: 'Psalm 117 (Slowed & Reverb)', type: 'SINGLE', year: 2024, duration: '6:09', cover: 'https://i.scdn.co/image/ab67616d0000b27347484d4b17261757d506eca9' },
  { id: '51sWCzXizJbvIwNqnxCh6p', title: 'Ey Dost (Slowed & Reverb)', type: 'SINGLE', year: 2025, duration: '13:43', cover: 'https://i.scdn.co/image/ab67616d0000b273d3e7f517175a4c91aff0af60' },
  { id: '0CqJvvcjeYnxHAAfXZoHHV', title: 'Realised Dreams', type: 'EP', year: 2024, duration: '2:02', cover: 'https://i.scdn.co/image/ab67616d0000b2733ec455682fadfdf54dab709c' },
  { id: '3kRnW7GiciHPVKpdBZu8FI', title: 'Blinking Stars', type: 'EP', year: 2024, duration: '3:51', cover: 'https://i.scdn.co/image/ab67616d0000b2739cafd35367a5a82927144177' },
  { id: '38uv27FDLqpWK3Hnprt0sT', title: 'Asit Yağmuru', type: 'ALBUM', year: 2025, duration: '3:40', cover: 'https://i.scdn.co/image/ab67616d0000b273d07e12d2b25617d0c392f33d' },
]

// Gerçek oSa Customs ürünü (eBay ilanından) — metinler dil sistemi üzerinden çevrilir
export type VehicleCompat = { brand: string; model: string; years: string }
export type Product = {
  id: number; name: string; category: 'direksiyon'; price: string; priceValue: number
  isNew?: boolean; sold?: boolean; images: string[]; sourceUrl: string; addedAt: string
  stock: number; compatibility: VehicleCompat[]; videoUrl?: string
  airbagIncluded?: boolean; stitching?: string; vanguardEdition?: boolean; vanguardEditionLimit?: number
}
const products: Product[] = [
  {
    id: 1,
    name: 'High-End Carbon Custom',
    category: 'direksiyon',
    price: '969,00 €',
    priceValue: 969,
    isNew: true,
    addedAt: '2026-08-02',
    // NOT: Gerçek stok adedini bilmiyorum, güvenli varsayılan olarak 1 girdim (özel/nadir bir parça olduğu için).
    // Admin panelinden veya bana söyleyerek gerçek adede güncelleyin.
    stock: 1,
    airbagIncluded: true,
    compatibility: [
      { brand: 'Audi', model: 'A4', years: '2007–2016 (B8 / B8.5)' },
      { brand: 'Audi', model: 'S4', years: '2007–2016 (B8 / B8.5)' },
      { brand: 'Audi', model: 'RS4', years: '2007–2016 (B8 / B8.5)' },
      { brand: 'Audi', model: 'A5', years: '2007–2016 (B8 / B8.5)' },
      { brand: 'Audi', model: 'S5', years: '2007–2016 (B8 / B8.5)' },
      { brand: 'Audi', model: 'RS5', years: '2007–2016 (B8 / B8.5)' },
      { brand: 'Audi', model: 'Q5', years: '2007–2016' },
    ],
    images: [
      '/images/products/direksiyon-main.jpg',
      '/images/products/direksiyon-2.jpg',
      '/images/products/direksiyon-3.jpg',
      '/images/products/direksiyon-4.jpg',
    ],
    sourceUrl: 'https://www.ebay.de/itm/377351917794',
  },
]
export { products }

export const navItems = [
  { key: 'productions', label: 'Productions', href: '/productions' },
  { key: 'customs', label: 'Customs', href: '/customs' },
  { key: 'vanguard', label: 'Vanguard', href: '/vanguard' },
]

export const filterCategories = ['all', ...Array.from(new Set(products.map(p => p.category)))] as const
