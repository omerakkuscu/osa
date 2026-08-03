import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, Package, Pencil, Plus, Trash2, Video, X } from 'lucide-react'
import type { AdminProduct } from './types'

type Draft = {
  name: string; category: string; priceValue: string; stock: string; description: string
  images: string; sourceUrl: string; videoUrl: string; airbagIncluded: boolean; stitching: string
  vanguardEdition: boolean; vanguardEditionLimit: string
}

const emptyDraft: Draft = {
  name: '', category: 'direksiyon', priceValue: '', stock: '1', description: '',
  images: '', sourceUrl: '', videoUrl: '', airbagIncluded: false, stitching: '',
  vanguardEdition: false, vanguardEditionLimit: '',
}

function productToDraft(p: AdminProduct): Draft {
  return {
    name: p.name, category: p.category, priceValue: p.price_value, stock: String(p.stock), description: p.description || '',
    images: p.images.join('\n'), sourceUrl: p.source_url || '', videoUrl: p.video_url || '',
    airbagIncluded: !!p.airbag_included, stitching: p.stitching || '',
    vanguardEdition: p.vanguard_edition, vanguardEditionLimit: p.vanguard_edition_limit ? String(p.vanguard_edition_limit) : '',
  }
}

export function CustomsSection() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [modalProduct, setModalProduct] = useState<AdminProduct | 'new' | null>(null)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedFlash, setSavedFlash] = useState(false)

  function load() {
    setLoading(true)
    fetch('/api/products').then(r => r.json()).then(d => setProducts(d.products || [])).catch(() => setProducts([])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  function openEdit(p: AdminProduct) { setModalProduct(p); setDraft(productToDraft(p)); setError(null) }
  function openNew() { setModalProduct('new'); setDraft(emptyDraft); setError(null) }
  function closeModal() { setModalProduct(null) }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const body = {
      name: draft.name,
      category: draft.category,
      priceValue: Number(draft.priceValue),
      stock: Number(draft.stock) || 0,
      description: draft.description,
      images: draft.images.split('\n').map(s => s.trim()).filter(Boolean),
      sourceUrl: draft.sourceUrl,
      videoUrl: draft.videoUrl,
      airbagIncluded: draft.airbagIncluded,
      stitching: draft.stitching,
      vanguardEdition: draft.vanguardEdition,
      vanguardEditionLimit: draft.vanguardEditionLimit ? Number(draft.vanguardEditionLimit) : undefined,
    }
    try {
      const isNew = modalProduct === 'new'
      const res = await fetch(isNew ? '/api/products' : `/api/products?id=${(modalProduct as AdminProduct).id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Kaydedilemedi') }
      load()
      closeModal()
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kaydedilemedi')
    } finally {
      setSaving(false)
    }
  }

  async function toggleSold(p: AdminProduct) {
    await fetch(`/api/products?id=${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sold: !p.sold }) }).catch(() => {})
    load()
  }

  async function deleteProduct(id: number) {
    if (!confirm('Bu ürünü kalıcı olarak silmek istediğinize emin misiniz?')) return
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' }).catch(() => {})
    load()
  }

  return <div>
    <div className="cc-header">
      <div><h1>oSa Customs</h1><p>Ürünler, stok, fiyat ve teknik detaylar</p></div>
      <button onClick={openNew} className="cc-btn-primary"><Plus size={15} /> Yeni Ürün</button>
    </div>

    <AnimatePresence>{savedFlash && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400"><Check size={15} /> Kaydedildi</motion.div>}</AnimatePresence>

    <div className="cc-card !p-0">
      <div className="cc-table-head"><span>Görsel</span><span>Ürün</span><span>Fiyat</span><span>Stok</span><span>Durum</span><span></span></div>
      {loading ? <p className="p-6 text-sm text-white/40">Yükleniyor…</p> : products.length === 0 ? <p className="p-6 text-sm text-white/40">Henüz ürün yok.</p> : products.map((p) => {
        const lowStock = !p.sold && p.stock <= 3
        return <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cc-table-row">
          <img src={p.images?.[0]} alt={p.name} className="size-12 rounded-sm border border-white/10 object-cover" />
          <div className="min-w-0">
            <p className="truncate font-semibold">{p.name}</p>
            <p className="mt-0.5 flex items-center gap-2 text-[11px] text-white/35">{p.category}{p.video_url && <Video size={11} className="text-[#d7b56d]" />}{p.vanguard_edition && <span className="text-[#d7b56d]">★ Edition</span>}</p>
          </div>
          <span className="font-semibold text-[#d7b56d]">{Number(p.price_value).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} €</span>
          <span className={lowStock ? 'font-bold text-red-400' : ''}>{p.stock}</span>
          <div>
            {p.sold ? <span className="cc-badge cc-badge--sold">SATILDI</span> : lowStock ? <span className="cc-badge cc-badge--low"><AlertTriangle size={11} /> DÜŞÜK STOK</span> : <span className="cc-badge cc-badge--ok">STOKTA</span>}
          </div>
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => toggleSold(p)} className="cc-icon-btn" title={p.sold ? 'Satılık işaretle' : 'Satıldı işaretle'}><Package size={14} /></button>
            <button onClick={() => openEdit(p)} className="cc-icon-btn" title="Düzenle"><Pencil size={14} /></button>
            <button onClick={() => deleteProduct(p.id)} className="cc-icon-btn cc-icon-btn--danger" title="Sil"><Trash2 size={14} /></button>
          </div>
        </motion.div>
      })}
    </div>

    <AnimatePresence>
      {modalProduct && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="cc-modal-backdrop" onClick={closeModal}>
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} className="cc-modal" onClick={(e) => e.stopPropagation()}>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold">{modalProduct === 'new' ? 'Yeni Ürün' : 'Ürünü Düzenle'}</h3>
            <button onClick={closeModal} className="cc-icon-btn"><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="cc-field"><label className="cc-label">Ürün Adı *</label><input required className="cc-input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="cc-field"><label className="cc-label">Kategori *</label><input required className="cc-input" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></div>
              <div className="cc-field"><label className="cc-label">Fiyat (€) *</label><input required type="number" step="0.01" className="cc-input" value={draft.priceValue} onChange={(e) => setDraft({ ...draft, priceValue: e.target.value })} /></div>
            </div>
            <div className="cc-field"><label className="cc-label">Stok Adedi *</label><input required type="number" className="cc-input" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} /></div>
            <div className="cc-field"><label className="cc-label">Açıklama</label><textarea rows={3} className="cc-textarea" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
            <div className="cc-field"><label className="cc-label">Görsel yolları (her satıra bir tane)</label><textarea rows={3} className="cc-textarea" value={draft.images} onChange={(e) => setDraft({ ...draft, images: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="cc-field"><label className="cc-label">Kaynak link</label><input className="cc-input" value={draft.sourceUrl} onChange={(e) => setDraft({ ...draft, sourceUrl: e.target.value })} /></div>
              <div className="cc-field"><label className="cc-label">Montaj videosu (YouTube)</label><input className="cc-input" value={draft.videoUrl} onChange={(e) => setDraft({ ...draft, videoUrl: e.target.value })} /></div>
            </div>
            <div className="mb-4 flex items-center justify-between border border-white/10 px-4 py-3">
              <span className="text-sm">Airbag dahil mi?</span>
              <button type="button" onClick={() => setDraft({ ...draft, airbagIncluded: !draft.airbagIncluded })} className={`cc-toggle ${draft.airbagIncluded ? 'on' : ''}`}><span className="cc-toggle-knob" /></button>
            </div>
            <div className="cc-field"><label className="cc-label">Dikiş / Döşeme detayı</label><input className="cc-input" placeholder="örn. Kırmızı kontrast dikiş" value={draft.stitching} onChange={(e) => setDraft({ ...draft, stitching: e.target.value })} /></div>
            <div className="mb-4 flex items-center justify-between border border-white/10 px-4 py-3">
              <span className="text-sm">Vanguard Limited Edition rozeti</span>
              <button type="button" onClick={() => setDraft({ ...draft, vanguardEdition: !draft.vanguardEdition })} className={`cc-toggle ${draft.vanguardEdition ? 'on' : ''}`}><span className="cc-toggle-knob" /></button>
            </div>
            {draft.vanguardEdition && <div className="cc-field"><label className="cc-label">Sınırlı üretim adedi (opsiyonel)</label><input type="number" className="cc-input" value={draft.vanguardEditionLimit} onChange={(e) => setDraft({ ...draft, vanguardEditionLimit: e.target.value })} /></div>}

            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="cc-btn-primary">{saving ? 'Kaydediliyor…' : 'Kaydet'}</button>
              <button type="button" onClick={closeModal} className="cc-btn-ghost">İptal</button>
            </div>
          </form>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </div>
}
