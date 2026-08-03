import { useEffect, useState } from 'react'
import { Gem } from 'lucide-react'
import type { AdminProduct } from './types'

export function VanguardSection() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [saving, setSaving] = useState<number | null>(null)

  function load() {
    fetch('/api/products').then(r => r.json()).then(d => setProducts(d.products || [])).catch(() => setProducts([]))
  }
  useEffect(() => { load() }, [])

  async function toggleEdition(p: AdminProduct) {
    setSaving(p.id)
    await fetch(`/api/products?id=${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vanguardEdition: !p.vanguard_edition }) }).catch(() => {})
    load()
    setSaving(null)
  }

  return <div>
    <div className="cc-header"><div><h1>oSa Vanguard</h1><p>Vitrin ve sınırlı üretim rozetleri</p></div></div>

    <div className="cc-card mb-6 border-[#d7b56d]/25">
      <p className="text-sm leading-6 text-white/60">
        Vanguard mağazasında henüz gerçek bir ürün bulunmuyor (Giyim/Kozmetik bölümü "Çok Yakında" durumunda). Gerçek Vanguard ürünleri eklendiğinde burada listelenecek ve "Limited Edition" rozetini tek tıkla açıp kapatabileceksiniz.
        Şimdilik oSa Customs ürünlerinden birine bu rozeti deneme amaçlı uygulayabilirsiniz — ama <strong>gerçekten sınırlı üretim değilse önerilmez</strong> (yanıltıcı olur).
      </p>
    </div>

    <div className="cc-card !p-0">
      <div className="cc-table-head" style={{ gridTemplateColumns: '64px 1.4fr .8fr auto' }}><span>Görsel</span><span>Ürün</span><span>Marka</span><span>Limited Edition</span></div>
      {products.map((p) => <div key={p.id} className="cc-table-row" style={{ gridTemplateColumns: '64px 1.4fr .8fr auto' }}>
        <img src={p.images?.[0]} alt={p.name} className="size-12 rounded-sm border border-white/10 object-cover" />
        <p className="truncate font-semibold">{p.name}</p>
        <span className="text-xs text-white/40">oSa Customs</span>
        <button disabled={saving === p.id} onClick={() => toggleEdition(p)} className={`cc-toggle ${p.vanguard_edition ? 'on' : ''}`}><span className="cc-toggle-knob" /></button>
      </div>)}
    </div>

    {products.some(p => p.vanguard_edition) && <div className="mt-4 flex items-center gap-2 text-xs text-[#d7b56d]"><Gem size={13} /> Rozet aktif olan ürünler sitede "LIMITED EDITION" etiketiyle gösteriliyor.</div>}
  </div>
}
