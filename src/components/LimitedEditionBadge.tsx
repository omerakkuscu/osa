import { Gem } from 'lucide-react'
import { useLanguage } from '../LanguageContext'

export function LimitedEditionBadge({ className = '' }: { className?: string }) {
  const { t } = useLanguage()
  return <span className={`limited-edition-badge ${className}`}><Gem size={11} /> {t('limited_edition_label')}</span>
}
