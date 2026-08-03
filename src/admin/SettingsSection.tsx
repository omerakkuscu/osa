import { useEffect, useState, type FormEvent } from 'react'
import { AlertCircle, Check, KeyRound, Wifi, WifiOff } from 'lucide-react'

type SystemStatus = { database: boolean; deepl: boolean; stripe: boolean; stripeWebhook: boolean; adminPasswordSource: string }

export function SettingsSection() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changing, setChanging] = useState(false)
  const [changeError, setChangeError] = useState<string | null>(null)
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    fetch('/api/system-status').then(r => r.json()).then(setStatus).catch(() => setStatus(null))
  }, [])

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault()
    setChangeError(null)
    if (newPassword.length < 8) return setChangeError('Şifre en az 8 karakter olmalı')
    if (newPassword !== confirmPassword) return setChangeError('Şifreler eşleşmiyor')
    setChanging(true)
    try {
      const res = await fetch('/api/admin/auth?action=change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ newPassword }) })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Değiştirilemedi') }
      setChanged(true)
      setNewPassword(''); setConfirmPassword('')
      setTimeout(() => setChanged(false), 3000)
    } catch (err) {
      setChangeError(err instanceof Error ? err.message : 'Değiştirilemedi')
    } finally {
      setChanging(false)
    }
  }

  const statusItems = status ? [
    { label: 'Veritabanı (Neon)', ok: status.database },
    { label: 'DeepL Çeviri', ok: status.deepl },
    { label: 'Stripe Ödeme', ok: status.stripe },
    { label: 'Stripe Webhook', ok: status.stripeWebhook },
  ] : []

  return <div>
    <div className="cc-header"><div><h1>Settings</h1><p>Şifre ve sistem durumu</p></div></div>

    <div className="cc-card mb-6">
      <p className="mb-4 flex items-center gap-2 text-sm font-bold"><Wifi size={15} className="text-[#d7b56d]" /> Sistem Durumu</p>
      {!status ? <p className="text-sm text-white/40">Yükleniyor…</p> : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {statusItems.map((s) => <div key={s.label} className="flex items-center justify-between border border-white/10 px-4 py-3 text-sm">
            <span>{s.label}</span>
            {s.ok ? <span className="flex items-center gap-1.5 text-emerald-400"><Check size={14} /> Aktif</span> : <span className="flex items-center gap-1.5 text-white/30"><WifiOff size={14} /> Yapılandırılmadı</span>}
          </div>)}
        </div>
      )}
      {status && !status.deepl && <p className="mt-4 flex items-center gap-2 text-xs text-amber-400"><AlertCircle size={13} /> DEEPL_API_KEY Vercel'de tanımlı değil — ürün çevirileri otomatik oluşturulmuyor.</p>}
      {status && !status.stripe && <p className="mt-2 flex items-center gap-2 text-xs text-amber-400"><AlertCircle size={13} /> STRIPE_SECRET_KEY tanımlı değil — ödeme alınamaz.</p>}
    </div>

    <div className="cc-card">
      <p className="mb-1 flex items-center gap-2 text-sm font-bold"><KeyRound size={15} className="text-[#d7b56d]" /> Admin Şifresini Değiştir</p>
      <p className="mb-5 text-xs text-white/40">Yeni şifre veritabanında güvenli şekilde (hash'lenmiş) saklanır ve Vercel'deki ADMIN_PASSWORD'ün üzerine geçer — env var'ı değiştirmenize gerek kalmaz.</p>
      <form onSubmit={handleChangePassword} className="max-w-sm">
        <div className="cc-field"><label className="cc-label">Yeni Şifre</label><input type="password" className="cc-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
        <div className="cc-field"><label className="cc-label">Yeni Şifre (Tekrar)</label><input type="password" className="cc-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
        {changeError && <p className="mb-3 text-sm text-red-400">{changeError}</p>}
        {changed && <p className="mb-3 flex items-center gap-2 text-sm text-emerald-400"><Check size={14} /> Şifre güncellendi</p>}
        <button type="submit" disabled={changing} className="cc-btn-primary">{changing ? 'Güncelleniyor…' : 'Şifreyi Güncelle'}</button>
      </form>
    </div>
  </div>
}
