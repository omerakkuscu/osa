import { type CSSProperties, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Layout } from '../components/Layout'
import { useLanguage } from '../LanguageContext'
import { useContentOverride } from '../ContentContext'

export default function Landing() {
  const { t, lang } = useLanguage()
  const heroSubtitle = useContentOverride('hero_subtitle', lang, '')
  useEffect(() => { document.title = 'oSa' }, [])
  const worlds = [
    { no: '01', name: 'PRODUCTIONS', desc: t('world_music_desc'), href: '/productions', image: '/images/studio.jpg', color: '#8b5cf6' },
    { no: '02', name: 'CUSTOMS', desc: t('world_customs_desc'), href: '/customs', image: '/images/customs.jpg', color: '#ef2b2d' },
    { no: '03', name: 'VANGUARD', desc: t('world_vanguard_desc'), href: '/vanguard', image: '/images/fashion.jpg', color: '#cdbb9f' },
  ]
  return <Layout hideFooterTopPad>
    <section className="hero-grid relative flex min-h-screen items-center overflow-hidden px-5 pb-16 pt-[7.5rem] md:px-10">
      <div className="hero-glow" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <div className="mb-6 flex justify-center"><img src="/logos/osa-main.png" alt="oSa" className="hero-logo-img" /></div>
        {heroSubtitle && <p className="mx-auto mb-16 max-w-lg text-center text-sm text-white/50 md:mb-20">{heroSubtitle}</p>}
        {!heroSubtitle && <div className="mb-16 md:mb-20" />}
        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
          {worlds.map(c => <Link key={c.name} to={c.href} className="world-card group" style={{ '--accent': c.color, '--image': `url(${c.image})` } as CSSProperties}>
            <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8">
              <span className="font-mono text-[11px] tracking-widest text-white/40">{c.no} / oSa</span>
              <div>
                <p className="mb-2 text-xs tracking-[.2em] text-white/55">{c.desc}</p>
                <div className="flex items-end justify-between gap-3">
                  <h2 className="text-2xl font-black tracking-tight md:text-3xl">{c.name}</h2>
                  <span className="grid size-10 place-items-center rounded-full border border-white/30 transition group-hover:rotate-[-45deg] group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]"><ArrowRight size={17} /></span>
                </div>
              </div>
            </div>
          </Link>)}
        </div>
      </div>
    </section>
  </Layout>
}
