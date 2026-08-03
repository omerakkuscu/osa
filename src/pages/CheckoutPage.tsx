import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { Layout } from '../components/Layout'
import { useLanguage } from '../LanguageContext'
import { useCurrency } from '../CurrencyContext'
import { useCart } from '../CartContext'
import { VisaBadge, MastercardBadge, PayPalBadge, KlarnaBadge, SofortBadge, DHLBadge } from '../components/PaymentIcons'

type PaymentMethod = 'card' | 'paypal' | 'klarna' | 'sofort'

export default function CheckoutPage() {
  const { t } = useLanguage()
  const { currency } = useCurrency()
  const { lines, cartCount, cartTotal } = useCart()
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [method, setMethod] = useState<PaymentMethod>('card')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { document.title = t('checkout_title') }, [t])
  useEffect(() => { if (lines.length === 0) navigate('/sepet') }, [lines.length, navigate])

  const paymentMethods: { id: PaymentMethod; label: string; badge: ReactNode }[] = [
    { id: 'card', label: 'Visa / Mastercard', badge: <span className="flex gap-1"><VisaBadge /><MastercardBadge /></span> },
    { id: 'paypal', label: 'PayPal', badge: <PayPalBadge /> },
    { id: 'klarna', label: 'Klarna', badge: <KlarnaBadge /> },
    { id: 'sofort', label: 'Sofortüberweisung', badge: <SofortBadge /> },
  ]

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (submitting || !formRef.current) return
    setError(null)
    const fd = new FormData(formRef.current)
    const email = String(fd.get('email') || '')
    const shippingAddress = {
      fullName: String(fd.get('fullName') || ''),
      email,
      phone: String(fd.get('phone') || ''),
      address: String(fd.get('address') || ''),
      city: String(fd.get('city') || ''),
      postalCode: String(fd.get('postalCode') || ''),
      country: String(fd.get('country') || ''),
      company: String(fd.get('company') || ''),
      notes: String(fd.get('notes') || ''),
      preferredPaymentMethod: method,
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
          customerEmail: email,
          shippingAddress,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'checkout_failed')
      window.location.href = data.url
    } catch (err) {
      console.error(err)
      setError(t('checkout_error'))
      setSubmitting(false)
    }
  }

  return <Layout>
    <section className="carbon-bg relative py-16 md:py-28">
      <div className="section-wrap relative z-10">
        <Link to="/sepet" className="text-link mb-8"><ArrowLeft size={14} /> {t('cart_page_title')}</Link>
        <div className="brand-head border-white/10"><div><p className="eyebrow text-[#d7b56d]">oSa</p><h2 className="text-3xl font-black italic md:text-5xl">{t('checkout_title')}</h2></div></div>

        <form ref={formRef} onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-10">
            <motion.fieldset initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="checkout-fieldset">
              <legend>{t('shipping_info')}</legend>
              <div className="mb-5 flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                <DHLBadge />
                <p className="text-xs leading-5 text-white/50">{t('dhl_shipping_note')}</p>
              </div>
              <div className="checkout-grid">
                <label className="checkout-field checkout-field--full"><span>{t('full_name')} *</span><input name="fullName" required type="text" /></label>
                <label className="checkout-field"><span>{t('email_label')} *</span><input name="email" required type="email" /></label>
                <label className="checkout-field"><span>{t('phone_label')}</span><input name="phone" type="tel" /></label>
                <label className="checkout-field checkout-field--full"><span>{t('address_label')} *</span><input name="address" required type="text" /></label>
                <label className="checkout-field"><span>{t('city_label')} *</span><input name="city" required type="text" /></label>
                <label className="checkout-field"><span>{t('postal_code_label')} *</span><input name="postalCode" required type="text" /></label>
                <label className="checkout-field"><span>{t('country_label')} *</span><input name="country" required type="text" defaultValue="Deutschland" /></label>
                <label className="checkout-field"><span>{t('company_optional')}</span><input name="company" type="text" /></label>
              </div>
            </motion.fieldset>

            <motion.fieldset initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }} className="checkout-fieldset">
              <legend>{t('billing_info')}</legend>
              <label className="checkbox-row"><input type="checkbox" checked={sameAsShipping} onChange={e => setSameAsShipping(e.target.checked)} /> {t('same_as_shipping')}</label>
              {!sameAsShipping && <div className="checkout-grid mt-4">
                <label className="checkout-field checkout-field--full"><span>{t('full_name')} *</span><input name="billingFullName" required type="text" /></label>
                <label className="checkout-field checkout-field--full"><span>{t('address_label')} *</span><input name="billingAddress" required type="text" /></label>
                <label className="checkout-field"><span>{t('city_label')} *</span><input name="billingCity" required type="text" /></label>
                <label className="checkout-field"><span>{t('postal_code_label')} *</span><input name="billingPostalCode" required type="text" /></label>
                <label className="checkout-field"><span>{t('country_label')} *</span><input name="billingCountry" required type="text" /></label>
                <label className="checkout-field"><span>{t('vat_id_optional')}</span><input name="vatId" type="text" /></label>
              </div>}
              <label className="checkout-field checkout-field--full mt-4"><span>{t('order_notes_optional')}</span><textarea name="notes" rows={3} /></label>
            </motion.fieldset>

            <motion.fieldset initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.16 }} className="checkout-fieldset">
              <legend>{t('payment_method')}</legend>
              <div className="payment-grid">
                {paymentMethods.map(pm => <button type="button" key={pm.id} onClick={() => setMethod(pm.id)} className={`payment-option ${method === pm.id ? 'active' : ''}`}>
                  {pm.badge} {pm.label}
                </button>)}
              </div>
              <p className="mt-4 text-xs leading-5 text-white/40">{t('payment_redirect_note')}</p>
            </motion.fieldset>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }} className="h-fit border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 text-lg font-bold">{t('order_summary')}</h3>
            <div className="mb-4 flex flex-col gap-3 border-b border-white/10 pb-4">
              {lines.map(l => <div key={l.product.id} className="flex items-center gap-3 text-sm">
                <img src={l.product.images[0]} alt={l.product.name} className="size-12 shrink-0 border border-white/10 object-cover" />
                <div className="min-w-0 flex-1"><p className="truncate">{l.product.name}</p><p className="text-xs text-white/40">{l.quantity} × {l.product.price}</p></div>
              </div>)}
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 text-sm"><span className="text-white/50">{t('subtotal')} ({t('items_count', { count: cartCount })})</span><span className="font-bold">{cartTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} €</span></div>
            {currency !== 'EUR' && <p className="mt-2 text-[10px] text-white/30">{t('checkout_always_eur')}</p>}
            {error && <p className="mt-4 flex items-center gap-2 text-xs text-red-400"><AlertCircle size={14} /> {error}</p>}
            <button type="submit" disabled={submitting} className="add-btn add-btn--lg mt-5 disabled:opacity-50">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> {t('redirecting')}</> : t('place_order')}
            </button>
            <p className="mt-4 text-center text-[10px] leading-4 text-white/30">{t('withdrawal_notice_short')} <Link to="/cayma-hakki" className="underline hover:text-white/60">{t('withdrawal_link_label')}</Link></p>
          </motion.div>
        </form>
      </div>
    </section>
  </Layout>
}
