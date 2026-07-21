import { useState, useEffect, type CSSProperties } from 'react'
import { ArrowDown, ArrowRight, ArrowLeft, Check, ChevronDown, ChevronRight, Disc3, Headphones, Instagram, Menu, Music2, Minus, Plus, ShoppingBag, Sparkles, Trash2, X, Youtube, Zap } from 'lucide-react'
import { useLanguage } from './LanguageContext'
import { languages } from './i18n'

// Gerçek ReaperHex kataloğu (Spotify verisi)
const tracks = [
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
type Product = {
  id: number; name: string; category: 'direksiyon'; price: string; priceValue: number
  isNew?: boolean; images: string[]; sourceUrl: string
}
const products: Product[] = [
  {
    id: 1,
    name: 'High-End Carbon Custom',
    category: 'direksiyon',
    price: '969,00 €',
    priceValue: 969,
    isNew: true,
    images: [
      '/images/products/direksiyon-main.jpg',
      '/images/products/direksiyon-2.jpg',
      '/images/products/direksiyon-3.jpg',
      '/images/products/direksiyon-4.jpg',
    ],
    sourceUrl: 'https://www.ebay.de/itm/377351917794',
  },
]

const navItems = [{ label: 'Productions', href: '#productions' }, { label: 'Customs', href: '#customs' }, { label: 'Vanguard', href: '#vanguard' }]
const filterCategories = ['all', ...Array.from(new Set(products.map(p => p.category)))] as const

function Logo({ size = 'nav' }: { size?: 'nav' | 'footer' }) {
  return <a href="#home" className={size === 'nav' ? 'logo-mark-img' : 'logo-mark-img logo-mark-img--footer'} aria-label="oSa ana sayfa">
    <img src="/logos/osa-main.png" alt="oSa" />
  </a>
}

type ToastItem = { id: number; text: string }

function App() {
  const { t, lang, setLang } = useLanguage()
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTrack, setActiveTrack] = useState(tracks[0])
  const [filter, setFilter] = useState<'all' | 'direksiyon'>('all')
  const [cart, setCart] = useState<Product[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [cartBump, setCartBump] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [subscribed, setSubscribed] = useState(false)

  const filteredProducts = filter === 'all' ? products : products.filter((p) => p.category === filter)
  const cartTotal = cart.reduce((sum, p) => sum + p.priceValue, 0)

  useEffect(() => {
    if (!toasts.length) return
    const timer = setTimeout(() => setToasts((arr) => arr.slice(1)), 2800)
    return () => clearTimeout(timer)
  }, [toasts])

  function addToCart(product: Product, quantity = 1) {
    setCart((items) => [...items, ...Array(quantity).fill(product)])
    setToasts((arr) => [...arr, { id: Date.now() + Math.random(), text: quantity > 1 ? t('toast_added_qty', { name: product.name, qty: quantity }) : t('toast_added', { name: product.name }) }])
    setCartBump(true)
    setTimeout(() => setCartBump(false), 400)
  }
  function removeFromCart(index: number) {
    setCart((items) => items.filter((_, i) => i !== index))
  }
  function openProduct(p: Product) {
    setSelectedProduct(p)
    const el = document.getElementById('customs')
    if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' })
  }

  return <main id="home" className="min-h-screen bg-[#070708] text-white selection:bg-[#d7b56d] selection:text-black">
    {/* Sepete ekleme bildirimleri */}
    <div className="toast-stack">{toasts.map(item => <div key={item.id} className="toast-item"><Check size={16}/> {item.text}</div>)}</div>

    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#070708]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10"><Logo /><nav className="hidden items-center gap-9 md:flex" aria-label="Ana navigasyon">{navItems.map(i=><a key={i.label} href={i.href} className="nav-link">{i.label}</a>)}</nav><div className="hidden items-center gap-5 md:flex"><div className="relative"><button onClick={()=>setLangMenuOpen(!langMenuOpen)} className="flex items-center gap-1.5 text-[10px] font-bold tracking-[.2em] text-white/60 hover:text-white" aria-label="Dil seç"><span>{languages.find(l=>l.code===lang)?.label.toUpperCase()}</span><ChevronDown size={12}/></button>{langMenuOpen&&<div className="lang-menu">{languages.map(l=><button key={l.code} onClick={()=>{setLang(l.code);setLangMenuOpen(false)}} className={`lang-menu-item ${l.code===lang?'active':''}`}>{l.label}</button>)}</div>}</div><a href="#ecosystem" className="outline-btn">{t('nav_explore')}</a></div><button className="md:hidden" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Menüyü aç">{menuOpen?<X/>:<Menu/>}</button></div>
      {menuOpen&&<div className="border-t border-white/10 bg-[#0b0b0d] px-6 py-8 md:hidden">{navItems.map(i=><a key={i.label} onClick={()=>setMenuOpen(false)} href={i.href} className="block border-b border-white/10 py-4 text-xl font-bold uppercase">{i.label}</a>)}<div className="mt-2 flex flex-wrap gap-2 border-t border-white/10 pt-6">{languages.map(l=><button key={l.code} onClick={()=>setLang(l.code)} className={`lang-chip ${l.code===lang?'active':''}`}>{l.label}</button>)}</div></div>}
    </header>

    <section className="hero-grid relative flex min-h-screen items-center overflow-hidden px-5 pb-16 pt-28 md:px-10"><div className="hero-glow"/><div className="relative z-10 mx-auto w-full max-w-[1440px]"><div className="mb-16 flex justify-center md:mb-20"><img src="/logos/osa-main.png" alt="oSa" className="hero-logo-img" /></div><div id="ecosystem" className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">{[
      {no:'01',name:'PRODUCTIONS',desc:t('world_music_desc'),href:'#productions',image:'/images/studio.jpg',color:'#8b5cf6'}, {no:'02',name:'CUSTOMS',desc:t('world_customs_desc'),href:'#customs',image:'/images/customs.jpg',color:'#ef2b2d'}, {no:'03',name:'VANGUARD',desc:t('world_vanguard_desc'),href:'#vanguard',image:'/images/fashion.jpg',color:'#cdbb9f'}
    ].map(c=><a key={c.name} href={c.href} className="world-card group" style={{'--accent':c.color,'--image':`url(${c.image})`} as CSSProperties}><div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8"><span className="font-mono text-[11px] tracking-widest text-white/40">{c.no} / oSa</span><div><p className="mb-2 text-xs tracking-[.2em] text-white/55">{c.desc}</p><div className="flex items-end justify-between gap-3"><h2 className="text-2xl font-black tracking-tight md:text-3xl">{c.name}</h2><span className="grid size-10 place-items-center rounded-full border border-white/30 transition group-hover:rotate-[-45deg] group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]"><ArrowRight size={17}/></span></div></div></div></a>)}</div></div><a href="#productions" className="scroll-cue"><ArrowDown size={16}/><span>SCROLL</span></a></section>

    <section id="productions" className="relative overflow-hidden bg-[#090810] py-24 md:py-36"><div className="purple-orb"/><div className="section-wrap relative z-10"><div className="brand-head"><div><p className="eyebrow text-violet-400">{t('productions_eyebrow')}</p><img src="/logos/osa-productions.png" alt="oSa Productions" className="brand-title-img" /></div><Music2 className="text-violet-400/70" size={40} strokeWidth={1}/></div>
      <div className="mb-20 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16"><div className="relative min-h-[500px] overflow-hidden bg-[#151020]"><img src="/images/studio.jpg" alt="oSa Productions stüdyo mikrofonu" className="h-full w-full object-cover opacity-70"/><div className="absolute inset-0 bg-gradient-to-t from-[#090810] via-transparent to-transparent"/><div className="absolute bottom-0 left-0 p-7 md:p-10"><span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[10px] tracking-[.2em] text-violet-300"><span className="size-1.5 animate-pulse rounded-full bg-violet-400"/> {t('now_playing')}</span><h3 className="text-4xl font-black md:text-6xl">{t('productions_headline')}</h3></div></div>
      <div className="flex flex-col justify-center"><p className="eyebrow text-violet-400">{t('artist_profile_label')}</p><h3 className="mb-6 text-3xl font-bold md:text-4xl">ReaperHex</h3><p className="mb-8 max-w-xl leading-7 text-white/55">{t('artist_bio')}</p><div className="mb-10 flex flex-wrap gap-3"><a href="https://open.spotify.com/intl-tr/artist/14PPh4Xe6G2vlGIINovFxC?si=vcWKCT94Qiu9XD1e61UVdA" target="_blank" rel="noopener noreferrer" className="platform-btn hover:border-[#1DB954] hover:text-[#1DB954]"><Disc3 size={18}/> Spotify</a><a href="https://music.apple.com/us/artist/reaperhex/1724962129" target="_blank" rel="noopener noreferrer" className="platform-btn hover:border-[#fa586a] hover:text-[#fa586a]"><Music2 size={18}/> Apple Music</a><a href="https://youtube.com/channel/UCdNRlEPWeClGwZc_mMmbh2Q?si=FTLx8SZMiSScB2HM" target="_blank" rel="noopener noreferrer" className="platform-btn hover:border-[#ff0033] hover:text-[#ff0033]"><Youtube size={18}/> YouTube Music</a></div>
      {/* Gerçek, çalışan Spotify önizleme oynatıcısı (resmi Spotify embed) */}
      <div id="player" className="spotify-embed-wrap"><iframe key={activeTrack.id} title={`Spotify önizleme — ${activeTrack.title}`} style={{ borderRadius: 12 }} src={`https://open.spotify.com/embed/track/${activeTrack.id}?utm_source=generator&theme=0`} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></div></div></div>
      <div className="mb-7 mt-16 flex items-end justify-between"><div><p className="eyebrow text-violet-400">{t('discography_label')}</p><h3 className="text-2xl font-bold">{t('discography_title')}</h3></div><a href="https://open.spotify.com/intl-tr/artist/14PPh4Xe6G2vlGIINovFxC" target="_blank" rel="noopener noreferrer" className="text-link">{t('spotify_open')} <ArrowRight size={14}/></a></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">{tracks.map(track=><button key={track.id} onClick={()=>setActiveTrack(track)} className={`album-card group text-left ${activeTrack.id===track.id?'album-card--active':''}`}><div className="album-art"><img src={track.cover} alt={track.title} className="h-full w-full object-cover"/><Disc3 className="absolute right-3 top-3 opacity-70 drop-shadow" size={16}/><div className="album-play-overlay"><Disc3 size={26}/></div></div><p className="mt-4 truncate font-bold">{track.title}</p><p className="mt-1 text-[10px] tracking-widest text-white/35">{track.type} · {track.year} · {track.duration}</p></button>)}</div>
    </div></section>

    <section id="customs" className="carbon-bg relative py-24 md:py-36"><div className="section-wrap relative z-10"><div className="brand-head border-red-500/30"><div><p className="eyebrow text-red-500">{t('customs_eyebrow')}</p><img src="/logos/osa-customs.png" alt="oSa Customs" className="brand-title-img" /></div><div className="flex items-center gap-3"><span className="hidden text-[10px] tracking-widest text-white/35 sm:block">{t('cart_label')}</span><button onClick={()=>setCartOpen(!cartOpen)} className={`relative grid size-12 place-items-center border border-white/15 hover:border-red-500 ${cartBump?'cart-bump':''}`} aria-label="Sepet"><ShoppingBag size={19}/>{cart.length>0&&<span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-red-600 text-[10px] font-bold">{cart.length}</span>}</button></div></div>

      {cartOpen&&<div className="cart-panel">
        {cart.length===0?<p className="py-6 text-center text-sm text-white/40">{t('cart_empty')}</p>:<>
          {cart.map((p,i)=><div key={i} className="cart-line"><img src={p.images[0]} alt={p.name}/><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{p.name}</p><p className="text-xs text-white/40">{p.price}</p></div><button onClick={()=>removeFromCart(i)} aria-label="Kaldır" className="text-white/40 hover:text-red-500"><Trash2 size={15}/></button></div>)}
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-sm"><span className="text-white/50">{t('cart_total')}</span><span className="font-bold">{cartTotal.toLocaleString('tr-TR',{minimumFractionDigits:2})} €</span></div>
        </>}
      </div>}

      {!selectedProduct?<>
      <div className="relative mb-14 min-h-[360px] overflow-hidden border border-white/10 md:min-h-[500px]"><img src="/images/customs.jpg" alt="oSa Customs performans jantı" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-transparent"/><div className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center p-7 md:p-14"><span className="mb-5 flex items-center gap-2 text-[10px] font-bold tracking-[.25em] text-red-500"><Zap size={14} fill="currentColor"/> {t('banner_tag')}</span><h3 className="mb-5 text-5xl font-black italic leading-[.9] md:text-7xl">{t('banner_headline_1')}<br/>{t('banner_headline_2')}<br/><span className="text-red-600">{t('banner_headline_3')}</span></h3><p className="max-w-sm text-sm leading-6 text-white/50">{t('banner_sub')}</p></div></div>
      <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between"><div><p className="eyebrow text-red-500">{t('shop_label')}</p><h3 className="text-2xl font-black italic">{t('shop_title')}</h3></div><div className="flex gap-2 overflow-x-auto pb-1">{filterCategories.map(c=><button key={c} onClick={()=>setFilter(c)} className={`filter-btn ${filter===c?'active':''}`}>{c==='all'?t('filter_all'):t('cat_'+c)}</button>)}</div></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">{filteredProducts.map(p=><article key={p.id} onClick={()=>openProduct(p)} className="product-card group cursor-pointer"><div className="relative aspect-square overflow-hidden bg-[#121214]"><img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110"/>{p.isNew&&<span className="absolute left-3 top-3 bg-red-600 px-2 py-1 text-[9px] font-bold uppercase tracking-widest">{t('val_durum_yeni')}</span>}<span className="absolute bottom-3 right-3 text-[9px] tracking-widest text-white/60">{t('cat_'+p.category)}</span><div className="product-card-hint">{t('hint_view')}</div></div><div className="p-4"><h4 className="min-h-10 text-sm font-bold md:text-base">{p.name}</h4><p className="mt-1 text-sm font-semibold text-red-500">{p.price}</p></div></article>)}</div>
      </>:<ProductDetail product={selectedProduct} onBack={()=>setSelectedProduct(null)} onAdd={addToCart}/>}
    </div></section>

    <section id="vanguard" className="bg-[#12100c] py-24 text-[#f0ead9] md:py-36"><div className="section-wrap"><div className="brand-head border-white/10"><div><p className="eyebrow text-[#c9a876]">{t('vanguard_eyebrow')}</p><img src="/logos/vanguard.png" alt="Vanguard" className="vanguard-title-img" /></div><p className="hidden max-w-[230px] text-right text-xs leading-5 text-[#f0ead9]/50 md:block">{t('vanguard_tagline_1')}<br/>{t('vanguard_tagline_2')}</p></div>
      <div className="editorial-grid mb-16"><article className="editorial-main group"><img src="/images/fashion.jpg" alt="Vanguard moda koleksiyonu"/><div className="editorial-copy"><p>{t('editorial_1_label')}</p><h3>{t('editorial_1_title')}</h3></div></article><article className="editorial-side group"><img src="/images/cosmetics.jpg" alt="Vanguard kozmetik koleksiyonu"/><div className="editorial-copy"><p>{t('editorial_2_label')}</p><h3>{t('editorial_2_title')}</h3></div></article><div className="editorial-quote"><Sparkles size={22} strokeWidth={1}/><p>{t('manifesto_quote_1')}<br/>{t('manifesto_quote_2')}</p><span>{t('manifesto_label')}</span></div></div>
      <div className="grid gap-px bg-white/10 md:grid-cols-2">{[{n:'01',title:t('cat_giyim_title'),desc:t('cat_giyim_desc'),img:'/images/fashion.jpg'},{n:'02',title:t('cat_kozmetik_title'),desc:t('cat_kozmetik_desc'),img:'/images/cosmetics.jpg'}].map(c=><a href="#collection" key={c.title} className="category-card group"><div><span>{c.n} / COLLECTION</span><h3>{c.title}</h3><p>{c.desc}</p></div><img src={c.img} alt={c.title}/><ArrowRight className="category-arrow"/></a>)}</div><div id="collection" className="mt-12 text-center"><a href="#vanguard" className="vanguard-cta">{t('view_collection')} <ArrowRight size={17}/></a></div>
    </div></section>

    <footer className="border-t border-white/10 bg-[#070708] px-5 pb-8 pt-20 md:px-10 md:pt-28"><div className="mx-auto max-w-[1440px]"><div className="grid gap-14 pb-20 md:grid-cols-[1.2fr_.8fr_1fr]"><div><Logo size="footer"/><p className="mt-6 max-w-xs text-sm leading-6 text-white/40">{t('footer_desc')}</p></div><div><p className="footer-label">{t('footer_brands_label')}</p>{navItems.map(i=><a className="footer-link" href={i.href} key={i.label}><ChevronRight size={13}/> oSa {i.label}</a>)}</div><div><p className="footer-label">{t('footer_newsletter_label')}</p><form onSubmit={e=>{e.preventDefault();setSubscribed(true)}} className="newsletter"><input required type="email" placeholder={t('footer_email_placeholder')} aria-label="E-posta adresi"/><button aria-label="Abone ol">{subscribed?<Check size={18}/>:<ArrowRight size={18}/>}</button></form>{subscribed&&<p className="mt-3 text-xs text-[#d7b56d]">{t('footer_subscribed')}</p>}</div></div><div className="flex flex-col gap-5 border-t border-white/10 pt-7 text-[10px] tracking-widest text-white/30 sm:flex-row sm:items-center sm:justify-between"><p>{t('footer_copyright')}</p><div className="flex gap-4"><a href="#home" aria-label="Instagram"><Instagram size={17}/></a><a href="#home" aria-label="TikTok" className="font-bold text-sm">Tk</a><a href="#home" aria-label="YouTube"><Youtube size={18}/></a><a href="#productions" aria-label="Müzik"><Headphones size={17}/></a></div></div></div></footer>
  </main>
}

function ProductDetail({ product, onBack, onAdd }: { product: Product; onBack: () => void; onAdd: (p: Product, quantity?: number) => void }) {
  const { t } = useLanguage()
  const [mainImage, setMainImage] = useState(product.images[0])
  const [qty, setQty] = useState(1)
  const specs: [string, string][] = [
    [t('spec_uretici'), 'oSa Customs'],
    [t('spec_urun_tipi'), t('val_urun_tipi')],
    [t('spec_uyumluluk'), t('val_uyumluluk')],
    [t('spec_ozellikler'), t('val_ozellikler')],
    [t('spec_durum'), t('val_durum_yeni')],
  ]
  return <div className="product-detail">
    <button onClick={onBack} className="text-link mb-8"><ArrowLeft size={14}/> {t('back_to_products')}</button>
    <div className="grid gap-10 md:grid-cols-2 md:gap-14">
      <div>
        <div className="mb-3 aspect-square overflow-hidden border border-white/10 bg-[#0c0c0e]"><img src={mainImage} alt={product.name} className="h-full w-full object-cover"/></div>
        <div className="grid grid-cols-4 gap-3">{product.images.map(img=><button key={img} onClick={()=>setMainImage(img)} className={`aspect-square overflow-hidden border ${mainImage===img?'border-red-500':'border-white/10'}`}><img src={img} alt="" className="h-full w-full object-cover"/></button>)}</div>
      </div>
      <div>
        {product.isNew&&<span className="mb-4 inline-block bg-red-600 px-2 py-1 text-[9px] font-bold uppercase tracking-widest">{t('val_durum_yeni')}</span>}
        <h3 className="mb-3 text-3xl font-black italic md:text-4xl">{product.name}</h3>
        <p className="mb-6 text-2xl font-bold text-red-500">{product.price}</p>
        <p className="mb-8 max-w-md leading-7 text-white/55">{t('product_desc')}</p>
        <div className="mb-8 divide-y divide-white/10 border-y border-white/10 text-sm">{specs.map(([k,v])=><div key={k} className="flex justify-between gap-6 py-3"><span className="text-white/40">{k}</span><span className="text-right text-white/80">{v}</span></div>)}</div>
        <div className="mb-6 flex items-center gap-4"><span className="text-xs tracking-widest text-white/40">{t('qty_label')}</span><div className="flex items-center border border-white/15"><button onClick={()=>setQty(q=>Math.max(1,q-1))} className="grid size-10 place-items-center hover:bg-white/10" aria-label="Azalt"><Minus size={14}/></button><span className="w-10 text-center font-bold">{qty}</span><button onClick={()=>setQty(q=>q+1)} className="grid size-10 place-items-center hover:bg-white/10" aria-label="Artır"><Plus size={14}/></button></div></div>
        <button onClick={()=>onAdd(product,qty)} className="add-btn add-btn--lg"><ShoppingBag size={16}/> {t('add_to_cart')}</button>
        <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-4 block text-center text-[10px] tracking-widest text-white/30 hover:text-white/60">{t('view_source')} ↗</a>
      </div>
    </div>
  </div>
}

export default App
