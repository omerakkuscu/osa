import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import { AnnouncementBar } from './AnnouncementBar'
import { Header } from './Header'
import { Footer } from './Footer'
import { CartDrawer } from './CartDrawer'
import { useCart } from '../CartContext'

export function Layout({ children, hideFooterTopPad = false }: { children: ReactNode; hideFooterTopPad?: boolean }) {
  const { toasts } = useCart()
  const { pathname } = useLocation()
  return <div className="min-h-screen bg-[#070708] text-white selection:bg-[#d7b56d] selection:text-black">
    <div className="toast-stack">{toasts.map(item => <div key={item.id} className="toast-item"><Check size={16} /> {item.text}</div>)}</div>
    <AnnouncementBar />
    <Header />
    <CartDrawer />
    <motion.main
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={hideFooterTopPad ? 'pt-[34px]' : 'pt-[114px]'}
    >
      {children}
    </motion.main>
    <Footer />
  </div>
}
