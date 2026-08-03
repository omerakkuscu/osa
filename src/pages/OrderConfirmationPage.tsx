import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Layout } from '../components/Layout'
import { useLanguage } from '../LanguageContext'
import { useCart } from '../CartContext'

export default function OrderConfirmationPage() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()

  useEffect(() => { document.title = t('order_confirmed_title') }, [t])
  // Ödeme tamamlandığında sepeti temizle (yalnızca gerçek bir Stripe oturum kimliği varsa)
  useEffect(() => { if (sessionId) clearCart() }, [sessionId, clearCart])

  return <Layout>
    <section className="carbon-bg relative flex min-h-[70vh] items-center py-16 md:py-28">
      <div className="section-wrap relative z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-lg text-center">
          <CheckCircle2 size={56} className="mx-auto mb-6 text-[#d7b56d]" />
          <h1 className="mb-4 text-3xl font-black italic md:text-4xl">{t('order_confirmed_title')}</h1>
          <p className="mb-2 text-white/60">{t('order_confirmed_body')}</p>
          {sessionId && <p className="mb-8 text-xs text-white/30">{t('order_ref')}: {sessionId}</p>}
          <Link to="/customs" className="outline-btn">{t('continue_shopping')}</Link>
        </motion.div>
      </div>
    </section>
  </Layout>
}
