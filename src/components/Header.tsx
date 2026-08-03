import { useState } from 'react'
import { NavLink, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, Menu, ShoppingBag, X } from 'lucide-react'
import { Logo } from './Logo'
import { navItems } from '../data'
import { useLanguage } from '../LanguageContext'
import { useCurrency } from '../CurrencyContext'
import { languages } from '../i18n'
import { useCart } from '../CartContext'

export function Header() {
  const { t, lang, setLang } = useLanguage()
  const { currency, setCurrency } = useCurrency()
  const { cartOpen, cartBump, setCartOpen, cartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [vanguardMenuOpen, setVanguardMenuOpen] = useState(false)
  const { pathname } = useLocation()

  return <header className="fixed inset-x-0 top-[34px] z-50 border-b border-white/10 bg-[#070708]/80 backdrop-blur-xl">
    <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10">
      <Logo />
      <nav className="brand-switcher hidden items-center md:flex" aria-label="Marka seçici">
        {navItems.map(i => {
          const isActive = pathname === i.href || pathname.startsWith(i.href + '/')
          return <div key={i.key} className="relative" onMouseEnter={() => i.key === 'vanguard' && setVanguardMenuOpen(true)} onMouseLeave={() => i.key === 'vanguard' && setVanguardMenuOpen(false)}>
            <NavLink to={i.href} className="brand-switcher-item">
              {isActive && <motion.span layoutId="brand-pill" className="brand-switcher-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span className="relative z-10 flex items-center gap-1">{i.label}{i.key === 'vanguard' && <ChevronDown size={11} />}</span>
            </NavLink>
            {i.key === 'vanguard' && vanguardMenuOpen && <div className="brand-switcher-submenu">
              <Link to="/vanguard#collection-giyim" className="brand-switcher-submenu-item">{t('cat_giyim_title')}</Link>
              <Link to="/vanguard#collection-kozmetik" className="brand-switcher-submenu-item">{t('cat_kozmetik_title')}</Link>
            </div>}
          </div>
        })}
      </nav>
      <div className="hidden items-center gap-4 md:flex">
        <div className="flex items-center border border-white/15 text-[10px] font-bold tracking-widest">
          <button onClick={() => setCurrency('EUR')} className={`px-2 py-1 ${currency === 'EUR' ? 'bg-[#d7b56d] text-black' : 'text-white/50 hover:text-white'}`}>€</button>
          <button onClick={() => setCurrency('USD')} className={`px-2 py-1 ${currency === 'USD' ? 'bg-[#d7b56d] text-black' : 'text-white/50 hover:text-white'}`}>$</button>
        </div>
        <div className="relative">
          <button onClick={() => setLangMenuOpen(!langMenuOpen)} className="flex items-center gap-1.5 text-[10px] font-bold tracking-[.2em] text-white/60 hover:text-white" aria-label="Dil seç">
            <span>{languages.find(l => l.code === lang)?.label.toUpperCase()}</span><ChevronDown size={12} />
          </button>
          {langMenuOpen && <div className="lang-menu">{languages.map(l => <button key={l.code} onClick={() => { setLang(l.code); setLangMenuOpen(false) }} className={`lang-menu-item ${l.code === lang ? 'active' : ''}`}>{l.label}</button>)}</div>}
        </div>
        <button onClick={() => setCartOpen(!cartOpen)} className={`relative grid size-11 place-items-center border border-white/15 hover:border-[#d7b56d] ${cartBump ? 'cart-bump' : ''}`} aria-label="Sepet">
          <ShoppingBag size={18} />
          {cartCount > 0 && <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-[#d7b56d] text-[10px] font-bold text-black">{cartCount}</span>}
        </button>
      </div>
      <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menüyü aç">{menuOpen ? <X /> : <Menu />}</button>
    </div>
    {menuOpen && <div className="border-t border-white/10 bg-[#0b0b0d] px-6 py-8 md:hidden">
      {navItems.map(i => <NavLink key={i.key} onClick={() => setMenuOpen(false)} to={i.href} className="block border-b border-white/10 py-4 text-xl font-bold uppercase">{i.label}</NavLink>)}
      <button onClick={() => { setMenuOpen(false); setCartOpen(true) }} className="mt-4 flex items-center gap-2 py-2 text-sm font-bold text-white/70"><ShoppingBag size={16} /> {t('cart_label')} {cartCount > 0 && `(${cartCount})`}</button>
      <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-6">
        <button onClick={() => setCurrency('EUR')} className={`border px-3 py-1.5 text-xs font-bold ${currency === 'EUR' ? 'border-[#d7b56d] text-[#d7b56d]' : 'border-white/20 text-white/50'}`}>EUR €</button>
        <button onClick={() => setCurrency('USD')} className={`border px-3 py-1.5 text-xs font-bold ${currency === 'USD' ? 'border-[#d7b56d] text-[#d7b56d]' : 'border-white/20 text-white/50'}`}>USD $</button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-6">{languages.map(l => <button key={l.code} onClick={() => setLang(l.code)} className={`lang-chip ${l.code === lang ? 'active' : ''}`}>{l.label}</button>)}</div>
    </div>}
  </header>
}
