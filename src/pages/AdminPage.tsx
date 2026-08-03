import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, FileText, Lock, LogOut, Menu, Settings as SettingsIcon, ShoppingBag, Sparkles, Video, X } from 'lucide-react'
import { DashboardSection } from '../admin/DashboardSection'
import { CustomsSection } from '../admin/CustomsSection'
import { ProductionsSection } from '../admin/ProductionsSection'
import { VanguardSection } from '../admin/VanguardSection'
import { ContentSection } from '../admin/ContentSection'
import { SettingsSection } from '../admin/SettingsSection'

type SectionKey = 'dashboard' | 'customs' | 'productions' | 'vanguard' | 'content' | 'settings'

const NAV_ITEMS: { key: SectionKey; label: string; icon: typeof BarChart3 }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { key: 'customs', label: 'oSa Customs', icon: ShoppingBag },
  { key: 'productions', label: 'oSa Productions', icon: Video },
  { key: 'vanguard', label: 'oSa Vanguard', icon: Sparkles },
  { key: 'content', label: 'Site Content', icon: FileText },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
]

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [section, setSection] = useState<SectionKey>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { document.title = 'oSa Command Center' }, [])

  useEffect(() => {
    fetch('/api/admin/auth?action=session')
      .then((r) => r.json())
      .then((data) => setAuthenticated(!!data.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setAuthChecked(true))
  }, [])

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError(null)
    try {
      const res = await fetch('/api/admin/auth?action=login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Giriş başarısız') }
      setAuthenticated(true)
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Giriş başarısız')
    } finally {
      setLoggingIn(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth?action=logout', { method: 'POST' }).catch(() => {})
    setAuthenticated(false)
    setPassword('')
  }

  if (!authChecked) {
    return <div className="grid min-h-screen place-items-center bg-[#070708] text-white/40">Yükleniyor…</div>
  }

  if (!authenticated) {
    return <div className="grid min-h-screen place-items-center bg-[#070708] px-5">
      <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} onSubmit={handleLogin} className="w-full max-w-sm border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
        <div className="mb-2 flex items-center gap-3"><img src="/logos/osa-main.png" alt="oSa" className="h-8" /></div>
        <p className="mb-6 flex items-center gap-2 text-sm text-white/40"><Lock size={14} /> Command Center</p>
        <label className="cc-field block"><span className="cc-label">Şifre</span><input autoFocus type="password" className="cc-input" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {loginError && <p className="mb-4 text-sm text-red-400">{loginError}</p>}
        <button type="submit" disabled={loggingIn} className="cc-btn-primary w-full justify-center">{loggingIn ? '…' : 'Giriş Yap'}</button>
      </motion.form>
    </div>
  }

  const ActiveSection = {
    dashboard: DashboardSection,
    customs: CustomsSection,
    productions: ProductionsSection,
    vanguard: VanguardSection,
    content: ContentSection,
    settings: SettingsSection,
  }[section]

  return <div className="cc-shell text-white">
    <button className="fixed left-4 top-4 z-[110] grid size-10 place-items-center border border-white/15 bg-black/60 md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <X size={18} /> : <Menu size={18} />}</button>

    <aside className={`cc-sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="cc-logo"><img src="/logos/osa-main.png" alt="oSa" /><span>COMMAND CENTER</span></div>
      <nav className="cc-nav">
        {NAV_ITEMS.map((item) => (
          <button key={item.key} onClick={() => { setSection(item.key); setSidebarOpen(false) }} className={`cc-nav-item ${section === item.key ? 'active' : ''}`}>
            {section === item.key && <motion.span layoutId="cc-nav-pill" className="cc-nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            <span><item.icon size={16} /> {item.label}</span>
          </button>
        ))}
      </nav>
      <div className="cc-sidebar-footer">
        <button onClick={handleLogout} className="cc-logout-btn"><LogOut size={15} /> Çıkış Yap</button>
      </div>
    </aside>

    <main className="cc-main">
      <AnimatePresence mode="wait">
        <motion.div key={section} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
          <ActiveSection />
        </motion.div>
      </AnimatePresence>
    </main>
  </div>
}
