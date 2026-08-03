import { useLanguage } from '../LanguageContext'
import { useContentOverride } from '../ContentContext'

export function AnnouncementBar() {
  const { t, lang } = useLanguage()
  const text = useContentOverride('announcement_bar_text', lang, t('announcement_bar_text'))
  return <div className="announcement-bar">
    <div className="announcement-track">
      <span>{text}</span>
      <span aria-hidden="true">{text}</span>
    </div>
  </div>
}
