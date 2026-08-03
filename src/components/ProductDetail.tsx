import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CalendarDays, Check, Lock, Minus, Package, PlayCircle, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { useLanguage } from '../LanguageContext'
import { useCurrency } from '../CurrencyContext'
import { useCart } from '../CartContext'
import type { Product } from '../data'

function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
      if (u.pathname.startsWith('/embed/')) return url
    }
    return null
  } catch { return null }
}

export function ProductDetail({ product, onBack }: { product: Product; onBack: () => void }) {
  const { t, lang } = useLanguage()
  const { formatPrice } = useCurrency()
  const { addToCart, lines } = useCart()
  const [mainImage, setMainImage] = useState(product.images[0])
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const inCartQty = lines.find((l) => l.product.id === product.id)?.quantity || 0
  const remainingStock = Math.max(0, product.stock - inCartQty)
  const isOutOfStock = product.sold || remainingStock <= 0

  const specs: [string, string][] = [
    [t('spec_uretici'), 'oSa Customs'],
    [t('spec_urun_tipi'), t('val_urun_tipi')],
    [t('spec_uyumluluk'), t('val_uyumluluk')],
    [t('spec_ozellikler'), t('val_ozellikler')],
    [t('spec_durum'), product.sold ? t('sold_out') : t('val_durum_yeni')],
  ]

  function handleAdd() {
    addToCart(product, Math.min(qty, remainingStock))
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1400)
  }

  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="product-detail">
    <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} onClick={onBack} className="text-link mb-8"><ArrowLeft size={14} /> {t('back_to_products')}</motion.button>
    <div className="grid gap-10 md:grid-cols-2 md:gap-14">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}>
        <div className="mb-3 aspect-square overflow-hidden border border-white/10 bg-[#0c0c0e]">
          <AnimatePresence mode="wait">
            <motion.img
              key={mainImage}
              src={mainImage}
              alt={product.name}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-4 gap-3">{product.images.map(img => <button key={img} onClick={() => setMainImage(img)} className={`gallery-thumb aspect-square overflow-hidden border ${mainImage === img ? 'border-red-500' : 'border-white/10'}`}><img src={img} alt="" className="h-full w-full object-cover" /></button>)}</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
        {product.sold ? <span className="mb-4 inline-block bg-white/20 px-2 py-1 text-[9px] font-bold uppercase tracking-widest">{t('sold_out')}</span> : product.isNew && <span className="mb-4 inline-block bg-red-600 px-2 py-1 text-[9px] font-bold uppercase tracking-widest">{t('val_durum_yeni')}</span>}
        <h3 className="mb-3 text-3xl font-black italic md:text-4xl">{product.name}</h3>
        <p className="mb-2 text-2xl font-bold text-red-500">{formatPrice(product.priceValue)}</p>

        {/* Stok durumu */}
        {!product.sold && (
          remainingStock <= 0 ? <p className="mb-4 text-sm font-semibold text-white/40">{t('out_of_stock_label')}</p>
          : remainingStock <= 3 ? <p className="mb-4 text-sm font-semibold text-amber-400">{t('low_stock_label', { count: remainingStock })}</p>
          : <p className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-emerald-400"><Check size={14} /> {t('in_stock_label')}</p>
        )}

        <p className="mb-6 flex items-center gap-1.5 text-xs text-white/35"><CalendarDays size={13} /> {t('added_on')}: {new Date(product.addedAt).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p className="mb-8 max-w-md leading-7 text-white/55">{t('product_desc')}</p>
        <div className="mb-8 divide-y divide-white/10 border-y border-white/10 text-sm">{specs.map(([k, v]) => <div key={k} className="flex justify-between gap-6 py-3"><span className="text-white/40">{k}</span><span className="text-right text-white/80">{v}</span></div>)}</div>

        {isOutOfStock ? <button disabled className="add-btn add-btn--lg add-btn--disabled">{product.sold ? t('sold_out') : t('out_of_stock_label')}</button> : <>
          <div className="mb-6 flex items-center gap-4"><span className="text-xs tracking-widest text-white/40">{t('qty_label')}</span><div className="flex items-center border border-white/15"><button onClick={() => setQty(q => Math.max(1, q - 1))} className="grid size-10 place-items-center hover:bg-white/10" aria-label="Azalt"><Minus size={14} /></button><span className="w-10 text-center font-bold">{qty}</span><button onClick={() => setQty(q => Math.min(remainingStock, q + 1))} className="grid size-10 place-items-center hover:bg-white/10 disabled:opacity-30" disabled={qty >= remainingStock} aria-label="Artır"><Plus size={14} /></button></div></div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleAdd} className="add-btn add-btn--lg overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {justAdded
                ? <motion.span key="added" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.22 }} className="flex items-center gap-2">✓ {t('added_confirm')}</motion.span>
                : <motion.span key="add" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.22 }} className="flex items-center gap-2"><ShoppingBag size={16} /> {t('add_to_cart')}</motion.span>}
            </AnimatePresence>
          </motion.button>
        </>}

        {/* Güven rozetleri */}
        <div className="mt-5 grid grid-cols-1 gap-2.5 border-t border-white/10 pt-5 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-xs text-white/50"><ShieldCheck size={16} className="shrink-0 text-[#d7b56d]" /> {t('trust_oem')}</div>
          <div className="flex items-center gap-2 text-xs text-white/50"><Truck size={16} className="shrink-0 text-[#d7b56d]" /> {t('trust_shipping')}</div>
          <div className="flex items-center gap-2 text-xs text-white/50"><Lock size={16} className="shrink-0 text-[#d7b56d]" /> {t('trust_secure')}</div>
        </div>

        <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-5 block text-center text-[10px] tracking-widest text-white/30 hover:text-white/60">{t('view_source')} ↗</a>

        {/* Paket içeriği */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40"><Package size={14} /> {t('box_contents_title')}</p>
          <ul className="flex flex-col gap-1.5 text-sm text-white/60">
            <li>• {t('val_urun_tipi')}</li>
            <li>• {t('val_ozellikler')}</li>
          </ul>
        </div>

        {/* Araç uyumluluğu */}
        {product.compatibility.length > 0 && <div className="mt-6 border-t border-white/10 pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">{t('vehicle_finder_title')}</p>
          <div className="flex flex-wrap gap-2">{product.compatibility.map((c) => <span key={c.brand + c.model} className="border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/60">{c.brand} {c.model} <span className="text-white/30">· {c.years}</span></span>)}</div>
        </div>}
      </motion.div>
    </div>
    {product.videoUrl && <div className="mt-16 border-t border-white/10 pt-12">
      <p className="mb-5 flex items-center gap-2 text-lg font-bold"><PlayCircle size={20} className="text-[#d7b56d]" /> {t('video_showcase_title')}</p>
      <div className="aspect-video w-full max-w-3xl overflow-hidden border border-white/10 bg-black">
        {toYouTubeEmbed(product.videoUrl) ? (
          <iframe className="h-full w-full" src={toYouTubeEmbed(product.videoUrl)!} title="Montaj Videosu" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <a href={product.videoUrl} target="_blank" rel="noopener noreferrer" className="flex h-full items-center justify-center text-sm text-white/50 hover:text-white">↗ {t('video_showcase_title')}</a>
        )}
      </div>
    </div>}
  </motion.div>
}
