import { useEffect, useState, type FormEvent } from 'react'
import { Plus, Trash2, Video } from 'lucide-react'
import type { AdminProduct, GalleryImage } from './types'

export function ProductionsSection() {
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [newUrl, setNewUrl] = useState('')
  const [newCaption, setNewCaption] = useState('')
  const [adding, setAdding] = useState(false)

  function loadGallery() {
    fetch('/api/gallery').then(r => r.json()).then(d => setGallery(d.images || [])).catch(() => setGallery([]))
  }
  useEffect(() => {
    loadGallery()
    fetch('/api/products').then(r => r.json()).then(d => setProducts(d.products || [])).catch(() => setProducts([]))
  }, [])

  async function addImage(e: FormEvent) {
    e.preventDefault()
    if (!newUrl.trim()) return
    setAdding(true)
    try {
      const res = await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: newUrl.trim(), caption: newCaption.trim() || undefined }) })
      if (!res.ok) throw new Error()
      setNewUrl(''); setNewCaption('')
      loadGallery()
    } catch { alert('Eklenemedi — migration çalıştırıldı mı?') } finally { setAdding(false) }
  }

  async function removeImage(id: number) {
    if (!confirm('Bu görseli galeriden kaldırmak istediğinize emin misiniz?')) return
    await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' }).catch(() => {})
    loadGallery()
  }

  return <div>
    <div className="cc-header"><div><h1>oSa Productions</h1><p>Araç galerisi ve ürün montaj videoları</p></div></div>

    <div className="cc-card mb-6">
      <p className="mb-4 text-sm font-bold">"Yollarda oSa" Galerisine Fotoğraf Ekle</p>
      <form onSubmit={addImage} className="mb-5 flex flex-wrap gap-3">
        <input className="cc-input flex-1" style={{ minWidth: 220 }} placeholder="Görsel URL'i (örn. /images/showcase-1.jpg)" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
        <input className="cc-input flex-1" style={{ minWidth: 160 }} placeholder="Açıklama (opsiyonel)" value={newCaption} onChange={(e) => setNewCaption(e.target.value)} />
        <button type="submit" disabled={adding} className="cc-btn-primary"><Plus size={14} /> Ekle</button>
      </form>
      {gallery.length === 0 ? <p className="text-sm text-white/40">Galeri boş — Productions sayfasında "yakında" durumu gösteriliyor.</p> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {gallery.map((g) => <div key={g.id} className="group relative aspect-square overflow-hidden border border-white/10">
            <img src={g.image_url} alt={g.caption || ''} className="h-full w-full object-cover" />
            <button onClick={() => removeImage(g.id)} className="absolute right-1 top-1 grid size-6 place-items-center bg-black/70 text-red-400 opacity-0 transition group-hover:opacity-100"><Trash2 size={12} /></button>
          </div>)}
        </div>
      )}
    </div>

    <div className="cc-card">
      <p className="mb-4 text-sm font-bold">Ürün Montaj/İnceleme Videoları</p>
      <div className="flex flex-col gap-3">
        {products.map((p) => <div key={p.id} className="flex items-center justify-between border-b border-white/10 pb-3 text-sm last:border-0">
          <span className="flex items-center gap-2"><Video size={14} className={p.video_url ? 'text-[#d7b56d]' : 'text-white/20'} /> {p.name}</span>
          {p.video_url ? <a href={p.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#d7b56d] underline">Videoyu Görüntüle ↗</a> : <span className="text-xs text-white/30">Video eklenmedi — oSa Customs'tan ekleyin</span>}
        </div>)}
      </div>
    </div>
  </div>
}
