import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { navItems } from '../data'

const BRAND_ACCENTS: Record<string, string> = {
  productions: '#8b5cf6',
  customs: '#ef2b2d',
  vanguard: '#c9a876',
}

export function BrandSwitcher() {
  const { pathname } = useLocation()

  return <nav className="brand-switcher" aria-label="Marka geçişi">
    {navItems.map((i) => {
      const active = pathname.startsWith(i.href)
      return <NavLink key={i.key} to={i.href} className="brand-switcher-item">
        {active && <motion.span layoutId="brand-switcher-pill" className="brand-switcher-pill" style={{ background: `${BRAND_ACCENTS[i.key]}22`, borderColor: `${BRAND_ACCENTS[i.key]}80` }} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
        <span className="brand-switcher-label" style={{ color: active ? BRAND_ACCENTS[i.key] : undefined }}>{i.label}</span>
      </NavLink>
    })}
  </nav>
}
