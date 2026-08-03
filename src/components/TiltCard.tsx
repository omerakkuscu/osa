import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Fare konumunu takip ederek hafif bir 3D eğim (tilt) ve parlama (glare) efekti veren kart sarmalayıcı.
 * Dokunmatik cihazlarda (mouse yok) devre dışı kalır — sadece hover destekleyen cihazlarda çalışır.
 */
export function TiltCard({ children, className = '', maxTilt = 10 }: { children: ReactNode; className?: string; maxTilt?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const springX = useSpring(x, { stiffness: 220, damping: 22 })
  const springY = useSpring(y, { stiffness: 220, damping: 22 })
  const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt])
  const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt])
  const glareX = useTransform(springX, [0, 1], ['0%', '100%'])
  const glareY = useTransform(springY, [0, 1], ['0%', '100%'])

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }
  function handleLeave() {
    x.set(0.5)
    y.set(0.5)
  }

  return <motion.div
    ref={ref}
    onMouseMove={handleMove}
    onMouseLeave={handleLeave}
    style={{ rotateX, rotateY, transformPerspective: 900 }}
    className={`tilt-card ${className}`}
  >
    <div className="tilt-card-inner">
      {children}
      <motion.div className="tilt-glare" style={{ background: `radial-gradient(circle at ${glareX} ${glareY}, #ffffff22, transparent 60%)` }} />
    </div>
  </motion.div>
}
