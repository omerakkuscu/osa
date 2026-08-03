import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowRight, Check, Clock, Sparkles } from 'lucide-react'
import { Layout } from '../components/Layout'
import { useLanguage } from '../LanguageContext'

const placeholderItems = [
  { cat: 'giyim', img: '/images/fashion.jpg' },
  { cat: 'giyim', img: '/images/fashion.jpg' },
  { cat: 'kozmetik', img: '/images/cosmetics.jpg' },
  { cat: 'kozmetik', img: '/images/cosmetics.jpg' },
]

export default function VanguardPage() {
  const { t } = useLanguage()
  const { hash } = useLocation()
  const [filter, setFilter] = useState<'all' | 'giyim' | 'kozmetik'>('all')
  const [notified, setNotified] = useState(false)
  const filtered = filter === 'all' ? placeholderItems : placeholderItems.filter(i => i.cat === filter)

  useEffect(() => { document.title = t('page_vanguard_title') }, [t])

  // Header'daki hızlı kategori linklerinden gelindiğinde ilgili filtreyi uygula ve o bölüme kaydır
  useEffect(() => {
    if (hash === '#collection-giyim') setFilter('giyim')
    else if (hash === '#collection-kozmetik') setFilter('kozmetik')
    if (hash) {
      const el = document.getElementById('vanguard-shop')
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    }
  }, [hash])

  return <Layout>
    <section className="bg-[#12100c] py-16 text-[#f0ead9] md:py-28">
      <div className="section-wrap">
        <div className="brand-head border-white/10"><div><p className="eyebrow text-[#c9a876]">{t('vanguard_eyebrow')}</p><img src="/logos/vanguard.png" alt="Vanguard" className="vanguard-title-img" /></div><p className="hidden max-w-[230px] text-right text-xs leading-5 text-[#f0ead9]/50 md:block">{t('vanguard_tagline_1')}<br />{t('vanguard_tagline_2')}</p></div>

        <div className="editorial-grid mb-16">
          <article className="editorial-main group"><img src="/images/fashion.jpg" alt="Vanguard moda koleksiyonu" /><div className="editorial-copy"><p>{t('editorial_1_label')}</p><h3>{t('editorial_1_title')}</h3></div></article>
          <article className="editorial-side group"><img src="/images/cosmetics.jpg" alt="Vanguard kozmetik koleksiyonu" /><div className="editorial-copy"><p>{t('editorial_2_label')}</p><h3>{t('editorial_2_title')}</h3></div></article>
          <div className="editorial-quote"><Sparkles size={22} strokeWidth={1} /><p>{t('manifesto_quote_1')}<br />{t('manifesto_quote_2')}</p><span>{t('manifesto_label')}</span></div>
        </div>

        {/* Mağaza iskeleti — gerçek ürünler eklendiğinde bu kartlar otomatik satın alınabilir hale gelecek */}
        <div id="vanguard-shop" className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 pt-6 md:flex-row md:items-center md:justify-between">
          <div><p className="eyebrow text-[#c9a876]">SHOP</p><h3 className="text-2xl font-black italic">{t('cat_giyim_title')} & {t('cat_kozmetik_title')}</h3></div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(['all', 'giyim', 'kozmetik'] as const).map(c => <button key={c} onClick={() => setFilter(c)} className={`filter-btn filter-btn--gold ${filter === c ? 'active' : ''}`}>{c === 'all' ? t('filter_all') : t('cat_' + c + '_title')}</button>)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {filtered.map((item, i) => <div key={i} className="product-card product-card--soon">
            <div className="relative aspect-square overflow-hidden bg-[#1c1810]">
              <img src={item.img} alt="" className="h-full w-full object-cover opacity-30 grayscale" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
                <Clock size={20} className="text-[#c9a876]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9a876]">{t('coming_soon')}</span>
              </div>
            </div>
            <div className="p-4"><div className="h-4 w-3/4 rounded bg-white/10" /><div className="mt-2 h-3 w-1/3 rounded bg-white/10" /></div>
          </div>)}
        </div>

        <div className="mt-14 border border-white/10 bg-white/[0.03] p-8 text-center md:p-12">
          <p className="mb-2 text-lg font-bold">{t('coming_soon')}</p>
          <p className="mx-auto mb-6 max-w-md text-sm leading-6 text-[#f0ead9]/60">{t('vanguard_shop_intro')}</p>
          {notified ? <p className="flex items-center justify-center gap-2 text-sm text-[#c9a876]"><Check size={16} /> {t('footer_subscribed')}</p> : <form onSubmit={e => { e.preventDefault(); setNotified(true) }} className="mx-auto flex max-w-sm items-center gap-2">
            <input required type="email" placeholder={t('footer_email_placeholder')} className="w-full border border-white/15 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/30" />
            <button className="flex shrink-0 items-center gap-2 bg-[#c9a876] px-4 py-3 text-[10px] font-bold tracking-widest text-[#12100c] hover:bg-[#e2c491]">{t('notify_me')} <ArrowRight size={14} /></button>
          </form>}
        </div>
      </div>
    </section>
  </Layout>
}
