import { useMemo, useState } from 'react'
import { Car, RotateCcw } from 'lucide-react'
import { useLanguage } from '../LanguageContext'
import type { Product } from '../data'

export function VehicleFinder({ products, onFilter }: { products: Product[]; onFilter: (matchingIds: number[] | null) => void }) {
  const { t } = useLanguage()
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')

  const brands = useMemo(() => Array.from(new Set(products.flatMap((p) => p.compatibility.map((c) => c.brand)))).sort(), [products])
  const models = useMemo(() => Array.from(new Set(products.flatMap((p) => p.compatibility.filter((c) => c.brand === brand).map((c) => c.model)))).sort(), [products, brand])
  const years = useMemo(() => Array.from(new Set(products.flatMap((p) => p.compatibility.filter((c) => c.brand === brand && c.model === model).map((c) => c.years)))), [products, brand, model])

  function apply() {
    if (!brand) { onFilter(null); return }
    const matches = products
      .filter((p) => p.compatibility.some((c) => c.brand === brand && (!model || c.model === model) && (!year || c.years === year)))
      .map((p) => p.id)
    onFilter(matches)
  }

  function reset() {
    setBrand(''); setModel(''); setYear('')
    onFilter(null)
  }

  return <div className="vehicle-finder">
    <p className="vehicle-finder-title"><Car size={16} /> {t('vehicle_finder_title')}</p>
    <div className="vehicle-finder-grid">
      <select value={brand} onChange={(e) => { setBrand(e.target.value); setModel(''); setYear('') }} className="vehicle-finder-select">
        <option value="">{t('vehicle_finder_brand')}</option>
        {brands.map((b) => <option key={b} value={b}>{b}</option>)}
      </select>
      <select value={model} onChange={(e) => { setModel(e.target.value); setYear('') }} disabled={!brand} className="vehicle-finder-select">
        <option value="">{t('vehicle_finder_model')}</option>
        {models.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={year} onChange={(e) => setYear(e.target.value)} disabled={!model} className="vehicle-finder-select">
        <option value="">{t('vehicle_finder_year')}</option>
        {years.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
      <button onClick={apply} disabled={!brand} className="vehicle-finder-cta">{t('vehicle_finder_cta')}</button>
      {brand && <button onClick={reset} className="vehicle-finder-reset" aria-label={t('vehicle_finder_reset')}><RotateCcw size={15} /></button>}
    </div>
  </div>
}
