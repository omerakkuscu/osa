// Ödeme/kargo rozetleri: marka renkleriyle sade, tanınabilir rozetler.
// Not: Bunlar markaların resmi logo dosyalarının birebir kopyası değil, stilize edilmiş
// metin/monogram rozetleridir — her e-ticaret sitesinde görülen "kabul edilen ödeme
// yöntemleri" gösterimiyle aynı mantıkta, marka karışıklığı yaratmadan tanınırlık sağlar.

export function VisaBadge({ className = '' }: { className?: string }) {
  return <span className={`payment-badge ${className}`} style={{ background: '#fff' }}>
    <span style={{ color: '#1A1F71', fontFamily: 'Georgia, serif', fontWeight: 800, fontStyle: 'italic', fontSize: '.8em', letterSpacing: '-.02em' }}>VISA</span>
  </span>
}

export function MastercardBadge({ className = '' }: { className?: string }) {
  return <span className={`payment-badge ${className}`} style={{ background: '#fff' }}>
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ width: '1em', height: '1em', borderRadius: '50%', background: '#EB001B' }} />
      <span style={{ width: '1em', height: '1em', borderRadius: '50%', background: '#F79E1B', marginLeft: '-.4em', mixBlendMode: 'multiply' }} />
    </span>
  </span>
}

export function PayPalBadge({ className = '' }: { className?: string }) {
  return <span className={`payment-badge ${className}`} style={{ background: '#fff' }}>
    <span style={{ fontFamily: 'Georgia, serif', fontWeight: 800, fontStyle: 'italic', fontSize: '.72em' }}>
      <span style={{ color: '#003087' }}>Pay</span><span style={{ color: '#009cde' }}>Pal</span>
    </span>
  </span>
}

export function KlarnaBadge({ className = '' }: { className?: string }) {
  return <span className={`payment-badge ${className}`} style={{ background: '#FFB3C7' }}>
    <span style={{ color: '#0B051D', fontWeight: 800, fontSize: '.78em', letterSpacing: '-.01em' }}>Klarna</span>
  </span>
}

export function SofortBadge({ className = '' }: { className?: string }) {
  return <span className={`payment-badge ${className}`} style={{ background: '#EF809F' }}>
    <span style={{ color: '#fff', fontWeight: 800, fontSize: '.62em', letterSpacing: '-.01em' }}>SOFORT</span>
  </span>
}

export function DHLBadge({ className = '' }: { className?: string }) {
  return <span className={`payment-badge ${className}`} style={{ background: '#FFCC00' }}>
    <span style={{ color: '#D40511', fontWeight: 900, fontSize: '.85em', fontStyle: 'italic', letterSpacing: '-.02em' }}>DHL</span>
  </span>
}
