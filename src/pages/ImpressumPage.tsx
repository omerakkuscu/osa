import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { Layout } from '../components/Layout'
import { useLanguage } from '../LanguageContext'
import { useContentOverride } from '../ContentContext'

export default function ImpressumPage() {
  const { t, lang } = useLanguage()
  const override = useContentOverride('impressum_body', lang, '')
  useEffect(() => { document.title = t('impressum_title') }, [t])

  return <Layout>
    <section className="carbon-bg relative py-16 md:py-28">
      <div className="section-wrap relative z-10 max-w-3xl">
        <Link to="/" className="text-link mb-8"><ArrowLeft size={14} /> {t('back_home')}</Link>
        <h1 className="mb-6 text-3xl font-black italic md:text-4xl">{t('impressum_title')}</h1>

        {!override && <div className="mb-8 flex gap-3 border border-[#d7b56d]/40 bg-[#d7b56d]/10 p-4 text-sm leading-6 text-[#f0ead9]">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#d7b56d]" />
          <p>{t('legal_disclaimer')}</p>
        </div>}

        {override ? (
          <div className="legal-text">{override.split('\n\n').map((para, i) => <p key={i}>{para.split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}</p>)}</div>
        ) : (
        <div className="legal-text">
          <h2>Angaben gemäß § 5 TMG</h2>
          <p className="legal-placeholder">
            [Vollständiger Name / Firmenname]<br />
            [Straße und Hausnummer]<br />
            [Postleitzahl und Ort]<br />
            [Land]
          </p>

          <h2>Kontakt</h2>
          <p className="legal-placeholder">
            Telefon: [Ihre Telefonnummer]<br />
            E-Mail: [Ihre E-Mail-Adresse]
          </p>

          <h2>Umsatzsteuer-ID</h2>
          <p className="legal-placeholder">
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            [Ihre USt-IdNr., falls vorhanden — sonst diesen Abschnitt entfernen]
          </p>

          <h2>Handelsregister</h2>
          <p className="legal-placeholder">
            [Falls im Handelsregister eingetragen: Registergericht und Registernummer angeben — als Einzelunternehmer ohne Eintragung diesen Abschnitt entfernen]
          </p>

          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p className="legal-placeholder">[Name und Anschrift wie oben, falls abweichend]</p>

          <h2>EU-Streitschlichtung</h2>
          <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="underline">https://ec.europa.eu/consumers/odr/</a>. Unsere E-Mail-Adresse finden Sie oben.</p>

          <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
          <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. <span className="legal-placeholder-inline">[Falls doch: Name und Anschrift der zuständigen Schlichtungsstelle ergänzen]</span></p>
        </div>
        )}
      </div>
    </section>
  </Layout>
}
