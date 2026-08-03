import { Link } from 'react-router-dom'

export function Logo({ size = 'nav' }: { size?: 'nav' | 'footer' }) {
  return <Link to="/" className={size === 'nav' ? 'logo-mark-img' : 'logo-mark-img logo-mark-img--footer'} aria-label="oSa ana sayfa">
    <img src="/logos/osa-main.png" alt="oSa" />
  </Link>
}
