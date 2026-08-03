import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Camera, Disc3, Music2, Youtube } from 'lucide-react'
import { Layout } from '../components/Layout'
import { TiltCard } from '../components/TiltCard'
import { useLanguage } from '../LanguageContext'
import { tracks } from '../data'

export default function ProductionsPage() {
  const { t } = useLanguage()
  const [activeTrack, setActiveTrack] = useState(tracks[0])
  const [gallery, setGallery] = useState<{ id: number; image_url: string; caption: string | null }[]>([])

  useEffect(() => { document.title = t('page_productions_title') }, [t])
  useEffect(() => {
    fetch('/api/gallery').then(r => r.json()).then(data => setGallery(data.images || [])).catch(() => setGallery([]))
  }, [])

  return <Layout>
    <section className="relative overflow-hidden bg-[#090810] py-16 md:py-28">
      <div className="purple-orb" />
      <div className="section-wrap relative z-10">
        <div className="brand-head"><div><p className="eyebrow text-violet-400">{t('productions_eyebrow')}</p><img src="/logos/osa-productions.png" alt="oSa Productions" className="brand-title-img" /></div><Music2 className="text-violet-400/70" size={40} strokeWidth={1} /></div>

        <div className="mb-20 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="relative min-h-[500px] overflow-hidden bg-[#151020]">
            <img src="/images/studio.jpg" alt="oSa Productions stüdyo mikrofonu" className="h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090810] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-7 md:p-10">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[10px] tracking-[.2em] text-violet-300"><span className="size-1.5 animate-pulse rounded-full bg-violet-400" /> {t('now_playing')}</span>
              <h3 className="text-4xl font-black md:text-6xl">{t('productions_headline')}</h3>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="eyebrow text-violet-400">{t('artist_profile_label')}</p>
            <h3 className="mb-6 text-3xl font-bold md:text-4xl">ReaperHex</h3>
            <p className="mb-8 max-w-xl leading-7 text-white/55">{t('artist_bio')}</p>
            <div className="mb-10 flex flex-wrap gap-3">
              <a href="https://open.spotify.com/intl-tr/artist/14PPh4Xe6G2vlGIINovFxC?si=vcWKCT94Qiu9XD1e61UVdA" target="_blank" rel="noopener noreferrer" className="platform-btn hover:border-[#1DB954] hover:text-[#1DB954]"><Disc3 size={18} /> Spotify</a>
              <a href="https://music.apple.com/us/artist/reaperhex/1724962129" target="_blank" rel="noopener noreferrer" className="platform-btn hover:border-[#fa586a] hover:text-[#fa586a]"><Music2 size={18} /> Apple Music</a>
              <a href="https://youtube.com/channel/UCdNRlEPWeClGwZc_mMmbh2Q?si=FTLx8SZMiSScB2HM" target="_blank" rel="noopener noreferrer" className="platform-btn hover:border-[#ff0033] hover:text-[#ff0033]"><Youtube size={18} /> YouTube Music</a>
            </div>
            {/* Gerçek, çalışan Spotify önizleme oynatıcısı (resmi Spotify embed) */}
            <div id="player" className="spotify-embed-wrap">
              <iframe key={activeTrack.id} title={`Spotify önizleme — ${activeTrack.title}`} style={{ borderRadius: 12 }} src={`https://open.spotify.com/embed/track/${activeTrack.id}?utm_source=generator&theme=0`} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
          </div>
        </div>

        <div className="mb-7 mt-16 flex items-end justify-between">
          <div><p className="eyebrow text-violet-400">{t('discography_label')}</p><h3 className="text-2xl font-bold">{t('discography_title')}</h3></div>
          <a href="https://open.spotify.com/intl-tr/artist/14PPh4Xe6G2vlGIINovFxC" target="_blank" rel="noopener noreferrer" className="text-link">{t('spotify_open')} <ArrowRight size={14} /></a>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          {tracks.map((track, i) => <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <button onClick={() => { setActiveTrack(track); document.getElementById('player')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }} className={`album-card group block w-full text-left ${activeTrack.id === track.id ? 'album-card--active' : ''}`}>
              <TiltCard maxTilt={7}>
                <div className="album-art"><img src={track.cover} alt={track.title} className="h-full w-full object-cover" /><Disc3 className="absolute right-3 top-3 opacity-70 drop-shadow" size={16} /><div className="album-play-overlay"><Disc3 size={26} /></div></div>
              </TiltCard>
              <p className="mt-4 truncate font-bold">{track.title}</p>
              <p className="mt-1 text-[10px] tracking-widest text-white/35">{track.type} · {track.year} · {track.duration}</p>
            </button>
          </motion.div>)}
        </div>

        {/* oSa Customs parçalarının kullanıldığı araçlar — gerçek fotoğraflar eklendiğinde burası dolacak */}
        <div className="mb-7 mt-20 flex items-end justify-between">
          <div><p className="eyebrow text-violet-400">SHOWCASE</p><h3 className="text-2xl font-bold">{t('showcase_title')}</h3></div>
        </div>
        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {gallery.map((g, i) => <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="aspect-square overflow-hidden border border-white/10">
              <img src={g.image_url} alt={g.caption || ''} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
            </motion.div>)}
          </div>
        ) : (
          <div className="showcase-empty">
            <Camera size={28} className="text-white/20" />
            <p className="mt-3 text-sm text-white/40">{t('showcase_coming_soon')}</p>
          </div>
        )}
      </div>
    </section>
  </Layout>
}
