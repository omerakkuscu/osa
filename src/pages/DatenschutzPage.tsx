import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { Layout } from '../components/Layout'
import { useLanguage } from '../LanguageContext'
import { useContentOverride } from '../ContentContext'

export default function DatenschutzPage() {
  const { t, lang } = useLanguage()
  const controllerInfo = useContentOverride('datenschutz_controller_info', lang, '')
  const contactEmail = useContentOverride('datenschutz_contact_email', lang, '')
  useEffect(() => { document.title = t('datenschutz_title') }, [t])

  return <Layout>
    <section className="carbon-bg relative py-16 md:py-28">
      <div className="section-wrap relative z-10 max-w-3xl">
        <Link to="/" className="text-link mb-8"><ArrowLeft size={14} /> {t('back_home')}</Link>
        <h1 className="mb-6 text-3xl font-black italic md:text-4xl">{t('datenschutz_title')}</h1>

        <div className="mb-8 flex gap-3 border border-[#d7b56d]/40 bg-[#d7b56d]/10 p-4 text-sm leading-6 text-[#f0ead9]">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#d7b56d]" />
          <p>{t('datenschutz_disclaimer')}</p>
        </div>

        <div className="legal-text">
          <h2>1. Verantwortlicher</h2>
          {controllerInfo ? (
            <p>{controllerInfo.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</p>
          ) : (
          <p className="legal-placeholder">
            [Vollständiger Name / Firmenname]<br />
            [Straße und Hausnummer]<br />
            [Postleitzahl und Ort]<br />
            E-Mail: [Ihre E-Mail-Adresse]
          </p>
          )}

          <h2>2. Hosting</h2>
          <p>Diese Website wird bei Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet. Beim Aufruf der Website erhebt Vercel automatisch sogenannte Server-Logfiles (u. a. IP-Adresse, Zeitpunkt des Zugriffs, aufgerufene Seite, verwendeter Browser). Weitere Informationen: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">Vercel Privacy Policy</a>.</p>

          <h2>3. Lokale Speicherung im Browser (localStorage)</h2>
          <p>Diese Website speichert bestimmte Daten technisch notwendig lokal in Ihrem Browser (nicht auf unseren Servern): Ihr Warenkorb-Inhalt, Ihre Spracheinstellung und von Ihnen verfasste Produktbewertungen. Diese Daten verlassen Ihr Gerät nicht automatisch und werden nicht an uns übertragen, es sei denn, Sie schließen einen Kauf ab oder senden eine Bewertung aktiv ab.</p>

          <h2>4. Google Fonts</h2>
          <p>Diese Website bindet Schriftarten ("Google Fonts") extern über Server von Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA) ein. Beim Aufruf einer Seite lädt Ihr Browser die benötigten Fonts von Google-Servern, wodurch Ihre IP-Adresse an Google übertragen wird. <span className="legal-placeholder-inline">[Hinweis: Wir empfehlen, die Schriftarten stattdessen selbst zu hosten, um diese Datenübertragung vollständig zu vermeiden — sprechen Sie uns an, wir können das technisch umsetzen.]</span></p>

          <h2>5. Spotify-Einbettungen</h2>
          <p>Auf unserer "Productions"-Seite binden wir Musik-Player von Spotify AB (Regeringsgatan 19, 111 53 Stockholm, Schweden) ein. Beim Laden dieser Seite kann Spotify Cookies setzen und Daten über Ihre Interaktion erheben. Weitere Informationen: <a href="https://www.spotify.com/de/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline">Spotify Datenschutzrichtlinie</a>.</p>

          <h2>6. Zahlungsdienstleister</h2>
          <p>Zur Zahlungsabwicklung nutzen wir die Dienste von Stripe (Stripe Payments Europe, Ltd., Irland) und/oder PayPal (PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxemburg). Bei Auswahl dieser Zahlungsart werden Ihre Zahlungsdaten direkt an den jeweiligen Anbieter übermittelt und dort gemäß dessen eigener Datenschutzerklärung verarbeitet.</p>

          <h2>7. Bestelldaten</h2>
          <p>Zur Abwicklung Ihrer Bestellung erheben wir Name, Lieferadresse, E-Mail-Adresse und ggf. Telefonnummer. Diese Verarbeitung erfolgt zur Vertragserfüllung gemäß Art. 6 Abs. 1 lit. b DSGVO und wird nur für die Dauer der gesetzlichen Aufbewahrungspflichten gespeichert.</p>

          <h2>8. Produktbewertungen</h2>
          <p>Wenn Sie eine Produktbewertung abgeben, werden der von Ihnen angegebene Name, Ihre Bewertung und Ihr Kommentar öffentlich auf der Produktseite angezeigt. Die Angabe erfolgt freiwillig.</p>

          <h2>9. Ihre Rechte</h2>
          <p>Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten (Art. 15–21 DSGVO). Zudem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.</p>

          <h2>10. Kontakt für Datenschutzanfragen</h2>
          {contactEmail ? <p>{contactEmail}</p> : <p className="legal-placeholder">[Ihre E-Mail-Adresse für Datenschutzanfragen]</p>}
        </div>
      </div>
    </section>
  </Layout>
}
