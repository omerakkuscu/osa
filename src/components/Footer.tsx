import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, ChevronRight, Headphones, Instagram, Youtube } from 'lucide-react'
import { Logo } from './Logo'
import { navItems } from '../data'
import { useLanguage } from '../LanguageContext'
import { VisaBadge, MastercardBadge, PayPalBadge, KlarnaBadge, SofortBadge, DHLBadge } from './PaymentIcons'

export function Footer() {
  const { t } = useLanguage()
  const [subscribed, setSubscribed] = useState(false)
  return <footer className="border-t border-white/10 bg-[#070708] px-5 pb-8 pt-20 md:px-10 md:pt-28">
    <div className="mx-auto max-w-[1440px]">
      <div className="grid gap-14 pb-14 md:grid-cols-[1.2fr_.8fr_1fr]">
        <div><Logo size="footer" /><p className="mt-6 max-w-xs text-sm leading-6 text-white/40">{t('footer_desc')}</p></div>
        <div><p className="footer-label">{t('footer_brands_label')}</p>{navItems.map(i => <Link className="footer-link" to={i.href} key={i.key}><ChevronRight size={13} /> oSa {i.label}</Link>)}</div>
        <div>
          <p className="footer-label">{t('footer_newsletter_label')}</p>
          <form onSubmit={e => { e.preventDefault(); setSubscribed(true) }} className="newsletter">
            <input required type="email" placeholder={t('footer_email_placeholder')} aria-label="E-posta adresi" />
            <button aria-label="Abone ol">{subscribed ? <Check size={18} /> : <ArrowRight size={18} />}</button>
          </form>
          {subscribed && <p className="mt-3 text-xs text-[#d7b56d]">{t('footer_subscribed')}</p>}
        </div>
      </div>

      <div className="border-t border-white/10 py-8">
        <p className="footer-label">{t('accepted_payments_label')}</p>
        <div className="payment-badge-row">
          <VisaBadge /><MastercardBadge /><PayPalBadge /><KlarnaBadge /><SofortBadge />
          <span className="mx-1 h-5 w-px bg-white/15" />
          <DHLBadge />
        </div>
      </div>

      <div className="flex flex-col gap-5 border-t border-white/10 pt-7 text-[10px] tracking-widest text-white/30 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <p>{t('footer_copyright')}</p>
          <Link to="/cayma-hakki" className="hover:text-white/60">{t('withdrawal_link_label')}</Link>
          <Link to="/impressum" className="hover:text-white/60">{t('impressum_link')}</Link>
          <Link to="/datenschutz" className="hover:text-white/60">{t('datenschutz_link')}</Link>
        </div>
        <div className="flex gap-4">
          <a href="#home" aria-label="Instagram"><Instagram size={17} /></a>
          <a href="#home" aria-label="TikTok" className="font-bold text-sm">Tk</a>
          <a href="#home" aria-label="YouTube"><Youtube size={18} /></a>
          <Link to="/productions" aria-label="Müzik"><Headphones size={17} /></Link>
        </div>
      </div>
    </div>
  </footer>
}
