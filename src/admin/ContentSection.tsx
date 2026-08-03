import { useEffect, useState } from 'react'
import { Check, Save } from 'lucide-react'
import { LANGS, LANG_LABELS } from './types'

type ContentMap = Record<string, Record<string, string>>

function useSavableField(contentMap: ContentMap, key: string, lang: string) {
  const [value, setValue] = useState(contentMap[key]?.[lang] || '')
  useEffect(() => { setValue(contentMap[key]?.[lang] || '') }, [contentMap, key, lang])
  return [value, setValue] as const
}

export function ContentSection() {
  const [contentMap, setContentMap] = useState<ContentMap>({})
  const [loading, setLoading] = useState(true)
  const [activeLang, setActiveLang] = useState<string>('tr')
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [savedKey, setSavedKey] = useState<string | null>(null)

  function load() {
    setLoading(true)
    fetch('/api/content').then(r => r.json()).then(d => setContentMap(d.content || {})).catch(() => setContentMap({})).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const [announcement, setAnnouncement] = useSavableField(contentMap, 'announcement_bar_text', activeLang)
  const [heroSubtitle, setHeroSubtitle] = useSavableField(contentMap, 'hero_subtitle', activeLang)
  const [impressumBody, setImpressumBody] = useSavableField(contentMap, 'impressum_body', 'de')
  const [controllerInfo, setControllerInfo] = useSavableField(contentMap, 'datenschutz_controller_info', 'de')
  const [contactEmail, setContactEmail] = useSavableField(contentMap, 'datenschutz_contact_email', 'de')

  async function saveField(key: string, lang: string, value: string) {
    setSavingKey(key)
    try {
      const res = await fetch('/api/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, lang, value }) })
      if (!res.ok) throw new Error()
      setSavedKey(key)
      setTimeout(() => setSavedKey((k) => k === key ? null : k), 2000)
      load()
    } catch { alert('Kaydedilemedi — migration çalıştırıldı mı?') } finally { setSavingKey(null) }
  }

  function SaveBtn({ fieldKey, lang, value }: { fieldKey: string; lang: string; value: string }) {
    return <button onClick={() => saveField(fieldKey, lang, value)} disabled={savingKey === fieldKey} className="cc-btn-primary mt-3">
      {savedKey === fieldKey ? <><Check size={14} /> Kaydedildi</> : <><Save size={14} /> {savingKey === fieldKey ? 'Kaydediliyor…' : 'Kaydet'}</>}
    </button>
  }

  return <div>
    <div className="cc-header"><div><h1>Site Content</h1><p>Duyuru çubuğu, ana sayfa ve yasal sayfa metinleri</p></div></div>
    {loading && <p className="mb-4 text-sm text-white/40">Yükleniyor…</p>}

    <div className="cc-card mb-6">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-bold">Duyuru Çubuğu & Ana Sayfa (dile göre)</p>
        <select className="cc-select w-auto" value={activeLang} onChange={(e) => setActiveLang(e.target.value)}>
          {LANGS.map((l) => <option key={l} value={l}>{LANG_LABELS[l]}</option>)}
        </select>
      </div>
      <div className="cc-field">
        <label className="cc-label">Duyuru Çubuğu Metni</label>
        <input className="cc-input" value={announcement} onChange={(e) => setAnnouncement(e.target.value)} />
        <SaveBtn fieldKey="announcement_bar_text" lang={activeLang} value={announcement} />
      </div>
      <div className="cc-field mt-6">
        <label className="cc-label">Ana Sayfa Alt Başlığı (opsiyonel — boş bırakılırsa gösterilmez)</label>
        <input className="cc-input" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
        <SaveBtn fieldKey="hero_subtitle" lang={activeLang} value={heroSubtitle} />
      </div>
    </div>

    <div className="cc-card mb-6">
      <p className="mb-1 text-sm font-bold">Impressum Metni</p>
      <p className="mb-4 text-xs text-white/40">Buraya gerçek işletme bilgilerinizi (isim, adres, e-posta vb.) girdiğinizde, sitedeki placeholder şablonun yerine otomatik olarak bu metin gösterilir. Almanya hukukuna göre Almanca girilmesi önerilir.</p>
      <textarea rows={8} className="cc-textarea" placeholder={'Örn:\nMax Mustermann\nMusterstraße 1\n12345 Musterstadt\nDeutschland\n\nE-Mail: kontakt@osa-hub.de'} value={impressumBody} onChange={(e) => setImpressumBody(e.target.value)} />
      <SaveBtn fieldKey="impressum_body" lang="de" value={impressumBody} />
    </div>

    <div className="cc-card">
      <p className="mb-4 text-sm font-bold">Datenschutzerklärung — Sorumlu Kişi Bilgisi</p>
      <div className="cc-field">
        <label className="cc-label">İsim / Adres</label>
        <textarea rows={4} className="cc-textarea" value={controllerInfo} onChange={(e) => setControllerInfo(e.target.value)} />
        <SaveBtn fieldKey="datenschutz_controller_info" lang="de" value={controllerInfo} />
      </div>
      <div className="cc-field mt-6">
        <label className="cc-label">Veri Koruma İletişim E-postası</label>
        <input className="cc-input" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
        <SaveBtn fieldKey="datenschutz_contact_email" lang="de" value={contactEmail} />
      </div>
    </div>
  </div>
}
