import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Minus, Plus, Share2, ShoppingBag, Trash2 } from 'lucide-react'
import { Layout } from '../components/Layout'
import { useLanguage } from '../LanguageContext'
import { useCurrency } from '../CurrencyContext'
import { useCart } from '../CartContext'

export default function CartPage() {
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()
  const { lines, removeFromCart, setQuantity, cartCount, cartTotal } = useCart()
  const [copiedId, setCopiedId] = useState<number | null>(null)

  useEffect(() => { document.title = t('cart_page_title') }, [t])

  async function shareProduct(productId: number) {
    const url = `${window.location.origin}/customs/${productId}`
    try {
      if (navigator.share) {
        await navigator.share({ url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopiedId(productId)
        setTimeout(() => setCopiedId(null), 2000)
      }
    } catch { /* kullanıcı paylaşımı iptal etti */ }
  }

  return <Layout>
    <section className="carbon-bg relative min-h-[70vh] py-16 md:py-28">
      <div className="section-wrap relative z-10">
        <div className="brand-head border-white/10"><div><p className="eyebrow text-[#d7b56d]">oSa</p><h2 className="text-3xl font-black italic md:text-5xl">{t('cart_page_title')}</h2></div></div>

        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
            <ShoppingBag size={40} className="text-white/20" />
            <p className="text-white/50">{t('cart_page_empty')}</p>
            <Link to="/customs" className="outline-btn">{t('continue_shopping')}</Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-4">
              {lines.map((l, i) => <motion.div
                key={l.product.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="cart-row"
              >
                <Link to={`/customs/${l.product.id}`} className="cart-row-img"><img src={l.product.images[0]} alt={l.product.name} /></Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/customs/${l.product.id}`} className="block truncate font-bold hover:text-[#d7b56d]">{l.product.name}</Link>
                  <p className="mt-1 text-xs text-white/40">{formatPrice(l.product.priceValue)} {t('cat_' + l.product.category)}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <div className="flex items-center border border-white/15">
                      <button onClick={() => setQuantity(l.product.id, l.quantity - 1)} className="grid size-9 place-items-center hover:bg-white/10" aria-label="Azalt"><Minus size={13} /></button>
                      <span className="w-9 text-center text-sm font-bold">{l.quantity}</span>
                      <button onClick={() => setQuantity(l.product.id, l.quantity + 1)} className="grid size-9 place-items-center hover:bg-white/10" aria-label="Artır"><Plus size={13} /></button>
                    </div>
                    <button onClick={() => shareProduct(l.product.id)} className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white">
                      {copiedId === l.product.id ? <><Check size={13} className="text-[#d7b56d]" /> {t('link_copied')}</> : <><Share2 size={13} /> {t('share_product')}</>}
                    </button>
                    <button onClick={() => removeFromCart(l.product.id)} className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-red-500"><Trash2 size={13} /> {t('remove_item')}</button>
                  </div>
                </div>
                <p className="shrink-0 text-lg font-bold text-[#d7b56d]">{formatPrice(l.product.priceValue * l.quantity)}</p>
              </motion.div>)}
              <Link to="/customs" className="text-link mt-2"><ArrowLeft size={14} /> {t('continue_shopping')}</Link>
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="h-fit border border-white/10 bg-white/[0.03] p-6">
              <h3 className="mb-4 text-lg font-bold">{t('order_summary')}</h3>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 text-sm">
                <span className="text-white/50">{t('subtotal')} ({t('items_count', { count: cartCount })})</span>
                <span className="font-bold">{formatPrice(cartTotal)}</span>
              </div>
              <Link to="/odeme" className="add-btn add-btn--lg mt-5">{t('proceed_checkout')}</Link>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  </Layout>
}
