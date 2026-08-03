import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { Layout } from '../components/Layout'
import { useLanguage } from '../LanguageContext'

export default function WithdrawalPage() {
  const { t } = useLanguage()
  useEffect(() => { document.title = t('withdrawal_page_title') }, [t])

  return <Layout>
    <section className="carbon-bg relative py-16 md:py-28">
      <div className="section-wrap relative z-10 max-w-3xl">
        <Link to="/" className="text-link mb-8"><ArrowLeft size={14} /> {t('back_home')}</Link>
        <h1 className="mb-6 text-3xl font-black italic md:text-4xl">{t('withdrawal_page_title')}</h1>

        <div className="mb-8 flex gap-3 border border-[#d7b56d]/40 bg-[#d7b56d]/10 p-4 text-sm leading-6 text-[#f0ead9]">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#d7b56d]" />
          <p>{t('withdrawal_disclaimer')}</p>
        </div>
        <p className="mb-10 text-sm text-white/40">{t('withdrawal_lang_note')}</p>

        {/* Resmi Alman/AB "Muster-Widerrufsbelehrung" şablonu — köşeli parantez içindeki alanlar sizin gerçek işletme bilgilerinizle doldurulmalı */}
        <div className="legal-text">
          <h2>Widerrufsrecht</h2>
          <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
          <p>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.</p>
          <p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns</p>
          <p className="legal-placeholder">
            [Ihr vollständiger Name / Firmenname]<br />
            [Ihre vollständige Anschrift]<br />
            [Ihre E-Mail-Adresse]<br />
            [Ihre Telefonnummer — optional]
          </p>
          <p>mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.</p>
          <p>Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p>

          <h2>Folgen des Widerrufs</h2>
          <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.</p>
          <p>Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.</p>
          <p>Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.</p>
          <p>Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.</p>
          <p>Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.</p>

          <h2>Muster-Widerrufsformular</h2>
          <p>(Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück.)</p>
          <p className="legal-placeholder">
            An [Ihr vollständiger Name / Firmenname], [Ihre vollständige Anschrift], [Ihre E-Mail-Adresse]:<br /><br />
            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)<br />
            — Bestellt am (*)/erhalten am (*)<br />
            — Name des/der Verbraucher(s)<br />
            — Anschrift des/der Verbraucher(s)<br />
            — Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)<br />
            — Datum<br />
            (*) Unzutreffendes streichen.
          </p>
        </div>
      </div>
    </section>
  </Layout>
}
