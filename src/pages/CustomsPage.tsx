import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, ShoppingBag, Zap } from 'lucide-react'
import { Layout } from '../components/Layout'
import { TiltCard } from '../components/TiltCard'
import { VehicleFinder } from '../components/VehicleFinder'
import { VanguardEditionBadge } from '../components/VanguardEditionBadge'
import { useLanguage } from '../LanguageContext'
import { useCurrency } from '../CurrencyContext'
import { useCart } from '../CartContext'
import { useProducts } from '../hooks/useProducts'

export default function CustomsPage() {
  const { t, lang } = useLanguage()
  const { formatPrice } = useCurrency()
  const { addToCart } = useCart()
  const { products } = useProducts()
  const [filter, setFilter] = useState<string>('all')
  const [vehicleMatchIds, setVehicleMatchIds] = useState<number[] | null>(null)
  const filterCategories = ['all', ...Array.from(new Set(products.map((p) => p.category)))]

  let filteredProducts = filter === 'all' ? products : products.filter((p) => p.category === filter)
  if (vehicleMatchIds !== null) filteredProducts = filteredProducts.filter((p) => vehicleMatchIds.includes(p.id))

  useEffect(() => { document.title = t('page_customs_title') }, [t])

  return <Layout>
    <section className="carbon-bg relative py-16 md:py-28">
      <div className="section-wrap relative z-10">
        <div className="brand-head border-red-500/30"><div><p className="eyebrow text-red-500">{t('customs_eyebrow')}</p><img src="/logos/osa-customs.png" alt="oSa Customs" className="brand-title-img" /></div></div>

        <div className="relative mb-14 min-h-[360px] overflow-hidden border border-white/10 md:min-h-[500px]">
          <motion.img initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} src="/images/customs.jpg" alt="oSa Customs performans jantı" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-transparent" />
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center p-7 md:p-14">
            <span className="mb-5 flex items-center gap-2 text-[10px] font-bold tracking-[.25em] text-red-500"><Zap size={14} fill="currentColor" /> {t('banner_tag')}</span>
            <h3 className="mb-5 text-5xl font-black italic leading-[.9] md:text-7xl">{t('banner_headline_1')}<br />{t('banner_headline_2')}<br /><span className="text-red-600">{t('banner_headline_3')}</span></h3>
            <p className="max-w-sm text-sm leading-6 text-white/50">{t('banner_sub')}</p>
          </motion.div>
        </div>

        <VehicleFinder products={products} onFilter={setVehicleMatchIds} />
        {vehicleMatchIds !== null && (
          <p className="-mt-8 mb-8 text-sm text-[#d7b56d]">
            {filteredProducts.length > 0 ? `✓ ${t('vehicle_finder_match')}` : t('vehicle_finder_no_match')}
          </p>
        )}

        <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div><p className="eyebrow text-red-500">{t('shop_label')}</p><h3 className="text-2xl font-black italic">{t('shop_title')}</h3></div>
          <div className="flex gap-2 overflow-x-auto pb-1">{filterCategories.map(c => <button key={c} onClick={() => setFilter(c)} className={`filter-btn ${filter === c ? 'active' : ''}`}>{c === 'all' ? t('filter_all') : t('cat_' + c)}</button>)}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {filteredProducts.map((p, i) => <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to={`/customs/${p.id}`} className="product-card group block cursor-pointer">
              <TiltCard maxTilt={6}>
                <div className="relative aspect-square overflow-hidden bg-[#121214]">
                  <img src={p.images[0]} alt={p.name} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0 ${p.sold ? 'opacity-40 grayscale' : ''}`} />
                  {p.images[1] && <img src={p.images[1]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
                  {p.sold ? <span className="absolute left-3 top-3 bg-white/20 px-2 py-1 text-[9px] font-bold uppercase tracking-widest backdrop-blur-sm">{t('sold_out')}</span> : p.isNew && <span className="absolute left-3 top-3 bg-red-600 px-2 py-1 text-[9px] font-bold uppercase tracking-widest">{t('val_durum_yeni')}</span>}
                  {p.vanguardEdition && <div className="absolute left-3 top-9"><VanguardEditionBadge limit={p.vanguardEditionLimit} /></div>}
                  <span className="absolute bottom-3 right-3 text-[9px] tracking-widest text-white/60">{t('cat_' + p.category)}</span>
                  <div className="product-card-hint">{t('hint_view')}</div>
                  {!p.sold && <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p, 1) }}
                    className="quick-add-btn"
                  ><ShoppingBag size={12} /> {t('quick_add')}</button>}
                </div>
              </TiltCard>
              <div className="p-4"><h4 className="min-h-10 text-sm font-bold md:text-base">{p.name}</h4><p className="mt-1 text-sm font-semibold text-red-500">{formatPrice(p.priceValue)}</p><p className="mt-1.5 flex items-center gap-1 text-[10px] text-white/30"><CalendarDays size={11} /> {new Date(p.addedAt).toLocaleDateString(lang, { year: 'numeric', month: 'short', day: 'numeric' })}</p></div>
            </Link>
          </motion.div>)}
        </div>
      </div>
    </section>
  </Layout>
}
