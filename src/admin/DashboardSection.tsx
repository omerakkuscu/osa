import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Package, ShoppingCart, TrendingUp } from 'lucide-react'
import type { DashboardStats } from './types'

export function DashboardSection() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then(setStats)
      .catch(() => setError(true))
  }, [])

  const cards = stats ? [
    { label: 'Toplam Ürün', value: stats.totalProducts, icon: Package },
    { label: 'Düşük Stok', value: stats.lowStockCount, icon: AlertTriangle, warn: stats.lowStockCount > 0 },
    { label: 'Toplam Sipariş', value: stats.totalOrders, icon: ShoppingCart },
    { label: 'Toplam Ciro', value: `${stats.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} €`, icon: TrendingUp },
  ] : []

  return <div>
    <div className="cc-header">
      <div><h1>Dashboard</h1><p>oSa Command Center'a hoş geldiniz</p></div>
    </div>

    {error && <div className="cc-card mb-6 border-red-500/30 text-sm text-red-400">İstatistikler yüklenemedi — veritabanı bağlantısını ve migration'ların çalıştığını kontrol edin.</div>}

    <div className="cc-stat-grid">
      {cards.map((c, i) => <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }} className="cc-card">
        <div className="cc-stat-glow" />
        <div className="cc-stat-label"><c.icon size={13} className={c.warn ? 'text-red-400' : 'text-[#d7b56d]'} /> {c.label}</div>
        <div className={`cc-stat-value ${c.warn ? 'text-red-400' : ''}`}>{stats ? c.value : '—'}</div>
      </motion.div>)}
    </div>

    <div className="cc-card">
      <p className="mb-2 text-sm font-bold">Hızlı Bilgi</p>
      <p className="text-sm leading-6 text-white/50">Sol menüden oSa Customs (ürün/stok), oSa Productions (medya/galeri), oSa Vanguard (vitrin), Site Content (metin CMS) ve Settings (şifre/sistem durumu) bölümlerine geçebilirsiniz.</p>
    </div>
  </div>
}
