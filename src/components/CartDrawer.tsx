import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useLanguage } from '../LanguageContext'
import { useCurrency } from '../CurrencyContext'
import { useCart } from '../CartContext'
import { VisaBadge, MastercardBadge, PayPalBadge, KlarnaBadge } from './PaymentIcons'

const FREE_SHIPPING_THRESHOLD = 150 // EUR — duyuru çubuğundaki "150€ üzeri ücretsiz kargo" ile tutarlı

export function CartDrawer() {
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()
  const { lines, cartOpen, setCartOpen, removeFromCart, setQuantity, cartCount, cartTotal } = useCart()

  const progress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100)
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal)

  return <AnimatePresence>
    {cartOpen && <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setCartOpen(false)}
        className="cart-drawer-backdrop"
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="cart-drawer"
        role="dialog" aria-label={t('cart_page_title')}
      >
        <div className="cart-drawer-header">
          <h3>{t('cart_page_title')} {cartCount > 0 && `(${cartCount})`}</h3>
          <button onClick={() => setCartOpen(false)} aria-label="Kapat"><X size={20} /></button>
        </div>

        {lines.length > 0 && <div className="cart-drawer-shipping">
          {remaining > 0
            ? <p>{t('free_shipping_progress', { amount: formatPrice(remaining) })}</p>
            : <p className="cart-drawer-shipping-done">{t('free_shipping_reached')}</p>}
          <div className="cart-drawer-progress-track"><motion.div className="cart-drawer-progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} /></div>
        </div>}

        <div className="cart-drawer-lines">
          {lines.length === 0 ? (
            <div className="cart-drawer-empty">
              <ShoppingBag size={36} className="text-white/20" />
              <p>{t('cart_page_empty')}</p>
              <button onClick={() => setCartOpen(false)} className="outline-btn">{t('continue_shopping')}</button>
            </div>
          ) : lines.map((l) => <div key={l.product.id} className="cart-drawer-line">
            <img src={l.product.images[0]} alt={l.product.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{l.product.name}</p>
              <p className="mt-0.5 text-xs text-white/40">{formatPrice(l.product.priceValue)}</p>
              <div className="mt-2 flex items-center border border-white/15 w-fit">
                <button onClick={() => setQuantity(l.product.id, l.quantity - 1)} className="grid size-7 place-items-center hover:bg-white/10" aria-label="Azalt"><Minus size={11} /></button>
                <span className="w-7 text-center text-xs font-bold">{l.quantity}</span>
                <button onClick={() => setQuantity(l.product.id, l.quantity + 1)} className="grid size-7 place-items-center hover:bg-white/10" aria-label="Artır"><Plus size={11} /></button>
              </div>
            </div>
            <button onClick={() => removeFromCart(l.product.id)} className="text-white/30 hover:text-red-500" aria-label={t('remove_item')}><Trash2 size={15} /></button>
          </div>)}
        </div>

        {lines.length > 0 && <div className="cart-drawer-footer">
          <div className="mb-3 flex items-center justify-between text-sm"><span className="text-white/50">{t('subtotal')}</span><span className="text-lg font-bold text-[#d7b56d]">{formatPrice(cartTotal)}</span></div>
          <Link to="/odeme" onClick={() => setCartOpen(false)} className="add-btn add-btn--lg">{t('proceed_checkout')}</Link>
          <Link to="/sepet" onClick={() => setCartOpen(false)} className="mt-2 block text-center text-xs text-white/40 underline hover:text-white/70">{t('go_to_cart')}</Link>
          <div className="mt-4 flex justify-center gap-1.5"><VisaBadge /><MastercardBadge /><PayPalBadge /><KlarnaBadge /></div>
        </div>}
      </motion.div>
    </>}
  </AnimatePresence>
}
