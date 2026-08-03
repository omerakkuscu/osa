import { Gem } from 'lucide-react'

/**
 * Vanguard "Limited Edition" rozeti — gerçek sınırlı üretim bir ürün olmadan
 * hiçbir karta uygulanmamalıdır (sahte "sınırlı sayıda üretildi" iddiası hem
 * yanıltıcı hem de tüketici hukuku açısından risklidir). Gerçek bir ürün +
 * gerçek adet bilgisi geldiğinde <VanguardEditionBadge limit={50} /> gibi kullanın.
 */
export function VanguardEditionBadge({ limit }: { limit?: number }) {
  return <span className="vanguard-edition-badge">
    <Gem size={11} /> {limit ? `LIMITED EDITION · ${limit}` : 'LIMITED EDITION'}
  </span>
}
