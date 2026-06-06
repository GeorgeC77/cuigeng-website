import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Lang } from '@/contexts/LanguageContext'
import { life } from '@/lib/translations'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* ─── Simplified continent paths ─── */
const CONTINENTS = [
  { d: 'M60,50 L120,35 L200,30 L280,45 L330,80 L300,150 L260,190 L180,200 L100,180 L50,130 L35,90 Z' },
  { d: 'M230,210 L280,205 L310,240 L315,320 L290,400 L250,420 L215,380 L200,310 L205,250 Z' },
  { d: 'M430,60 L470,48 L510,55 L530,85 L520,110 L485,120 L450,115 L435,100 Z' },
  { d: 'M440,145 L495,140 L525,175 L535,240 L520,310 L475,340 L435,290 L425,220 L430,175 Z' },
  { d: 'M535,50 L600,38 L720,42 L820,65 L860,110 L840,160 L780,195 L700,205 L630,185 L570,150 L540,100 Z' },
  { d: 'M730,290 L810,285 L840,320 L825,360 L765,370 L730,340 Z' },
]

/* ─── Photo Lightbox ─── */
function PhotoLightbox({
  photos,
  index,
  visible,
  onClose,
}: {
  photos: string[]
  index: number
  visible: boolean
  onClose: () => void
}) {
  const [currentIdx, setCurrentIdx] = useState(index)
  const [scale, setScale] = useState(1)

  if (!visible) return null

  const currentPhoto = photos[currentIdx]

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-white text-3xl z-10 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
        onClick={onClose}
      >
        ×
      </button>

      {/* Prev/Next */}
      {photos.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setCurrentIdx((currentIdx - 1 + photos.length) % photos.length); setScale(1) }}
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setCurrentIdx((currentIdx + 1) % photos.length); setScale(1) }}
          >
            ›
          </button>
          <span className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {currentIdx + 1} / {photos.length}
          </span>
        </>
      )}

      {/* Photo container with zoom */}
      <div
        className="flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentPhoto}
          alt=""
          className="rounded-lg cursor-zoom-in transition-transform duration-200"
          style={{
            maxWidth: '85vw',
            maxHeight: '75vh',
            objectFit: 'contain',
            transform: `scale(${scale})`,
          }}
          onClick={() => setScale(scale === 1 ? 2 : scale === 2 ? 3 : 1)}
        />
        {/* Zoom controls */}
        <div className="flex items-center gap-3">
          <button
            className="px-3 py-1 rounded-full bg-white/20 text-white text-sm hover:bg-white/30 transition-colors"
            onClick={() => setScale(Math.max(0.5, scale - 0.5))}
          >
            −
          </button>
          <span className="text-white/80 text-sm font-mono">{Math.round(scale * 100)}%</span>
          <button
            className="px-3 py-1 rounded-full bg-white/20 text-white text-sm hover:bg-white/30 transition-colors"
            onClick={() => setScale(Math.min(4, scale + 0.5))}
          >
            +
          </button>
          <button
            className="px-3 py-1 rounded-full bg-white/20 text-white text-sm hover:bg-white/30 transition-colors ml-2"
            onClick={() => setScale(1)}
          >
            重置
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ─── Map Marker with persistent tooltip ─── */
function MapMarker({ loc, index }: { loc: typeof life.locations[0]; index: number }) {
  const [active, setActive] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const { lang } = useLanguage()
  const l = lang as Lang
  const markerRef = useRef<HTMLDivElement>(null)

  // Shared hover handlers for marker + bridge + tooltip
  const onEnter = useCallback(() => setActive(true), [])
  const onLeave = useCallback(() => setActive(false), [])

  const openPhoto = useCallback((idx: number) => {
    setLightboxIdx(idx)
    setLightboxOpen(true)
  }, [])

  return (
    <>
      {/* 1. The marker dot */}
      <div
        ref={markerRef}
        className="absolute z-30"
        style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%, -50%)' }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {loc.current && (
          <span
            className="absolute rounded-full"
            style={{
              width: 28,
              height: 28,
              left: '50%',
              top: '50%',
              marginLeft: -14,
              marginTop: -14,
              border: '2px solid #2E5E4E',
              animation: 'pulse-ring 3s ease-out infinite',
            }}
          />
        )}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.06, ease: easeOutExpo }}
          className="relative rounded-full border-2 border-white cursor-pointer"
          style={{
            width: loc.current ? 14 : 10,
            height: loc.current ? 14 : 10,
            backgroundColor: loc.current ? '#2E5E4E' : '#3C7A6E',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        />
      </div>

      {/* 2. Invisible bridge from marker to tooltip (keeps hover alive) */}
      {active && (
        <div
          className="absolute z-40"
          style={{
            left: `${loc.x}%`,
            top: `${loc.y - 12}%`,
            width: 60,
            height: 120,
            transform: 'translate(-50%, 0)',
            background: 'transparent',
          }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        />
      )}

      {/* 3. The tooltip (also hoverable) */}
      {active && (
        <div
          className="absolute z-50 p-3 rounded-xl"
          style={{
            left: `${loc.x}%`,
            bottom: `calc(${100 - loc.y}% + 24px)`,
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(26,26,26,0.96)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            minWidth: loc.photos && loc.photos.length > 0 ? 280 : 180,
          }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {loc.photos && loc.photos.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2 justify-center">
              {loc.photos.map((photo: string, pi: number) => (
                <div
                  key={pi}
                  className="rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                  style={{ width: 80, height: 80, flexShrink: 0 }}
                  onClick={() => openPhoto(pi)}
                  title="点击查看大图"
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          <div className="px-1 text-center">
            <p className="text-white text-sm font-medium whitespace-nowrap">
              {typeof loc.flag === 'string' ? loc.flag.split('').join('\u200C') : loc.flag} {(loc.city as Record<Lang, string>)[l]} · {(loc.country as Record<Lang, string>)[l]}
            </p>
            <p className="text-[#A8A4A0] text-[10px] mt-0.5 whitespace-nowrap">
              {(loc.note as Record<Lang, string>)[l]}
            </p>
          </div>
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: -6,
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(26,26,26,0.96)',
            }}
          />
        </div>
      )}

      {/* 4. Photo Lightbox */}
      <PhotoLightbox
        photos={loc.photos || []}
        index={lightboxIdx}
        visible={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      <style>{`@keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }`}</style>
    </>
  )
}

/* ─── Life Page ─── */
export default function Life() {
  const { lang } = useLanguage()
  const l = lang as Lang

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F7F5F2' }}>
      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: easeOutExpo }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.span className="block h-[1px] bg-[#2E5E4E]" initial={{ width: 0 }} whileInView={{ width: 24 }} viewport={{ once: true }} transition={{ duration: 0.4, ease: easeOutExpo }} />
              <span className="font-inter text-xs font-medium tracking-[0.04em] uppercase text-[#2E5E4E]">{l === 'zh' ? '生活' : 'LIFE'}</span>
              <motion.span className="block h-[1px] bg-[#2E5E4E]" initial={{ width: 0 }} whileInView={{ width: 24 }} viewport={{ once: true }} transition={{ duration: 0.4, ease: easeOutExpo }} />
            </div>
            <h1 className="font-noto-serif text-3xl md:text-4xl lg:text-5xl font-medium text-[#1A1A1A] tracking-tight">{l === 'zh' ? '生活' : 'Life'}</h1>
            <p className="font-inter text-[#6B6866] mt-4 max-w-xl mx-auto">{l === 'zh' ? '学术之外，记录旅途与日常。' : 'Beyond academia—travel, photography, and everyday moments.'}</p>
          </motion.div>
        </div>
      </section>

      {/* Map */}
      <section className="px-6 lg:px-12 pb-24">
        <div className="max-w-[1280px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: easeOutExpo }} className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <motion.span className="block h-[1px] bg-[#2E5E4E]" initial={{ width: 0 }} whileInView={{ width: 24 }} viewport={{ once: true }} transition={{ duration: 0.4, ease: easeOutExpo }} />
              <span className="font-inter text-xs font-medium tracking-[0.04em] uppercase text-[#2E5E4E]">{l === 'zh' ? '足迹' : 'FOOTPRINT'}</span>
            </div>
            <h2 className="font-noto-serif text-2xl md:text-3xl lg:text-4xl font-medium text-[#1A1A1A]">{l === 'zh' ? '学术旅途中的城市记忆' : 'Cities Along the Journey'}</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="relative w-full rounded-xl bg-[#EDEAE6]"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <div className="relative" style={{ paddingBottom: '55%' }}>
              <svg viewBox="0 0 1000 550" className="absolute inset-0 w-full h-full" style={{ borderRadius: 12 }}>
                {CONTINENTS.map((c, i) => <path key={i} d={c.d} fill="#D5D1CC" stroke="none" opacity={0.5} />)}
              </svg>
              <div className="absolute inset-0">
                {life.locations.map((loc, i) => <MapMarker key={i} loc={loc} index={i} />)}
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2E5E4E]" />
              <span className="text-sm text-[#6B6866]">{l === 'zh' ? '现任职' : 'Current'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#3C7A6E]" />
              <span className="text-sm text-[#6B6866]">{l === 'zh' ? '过往足迹' : 'Visited'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-12">
            {life.locations.map((loc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: easeOutExpo }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all duration-300"
                style={{
                  borderColor: loc.current ? '#2E5E4E' : '#E0DDD9',
                  backgroundColor: loc.current ? '#E8F0ED' : '#FFFFFF',
                }}
              >
                <span className="text-sm font-jetbrains-mono font-semibold text-[#6B6866]">
                  {typeof loc.flag === 'string' ? loc.flag.split('').join('\u200C') : loc.flag}
                </span>
                <div className="min-w-0">
                  <p className="font-inter text-sm font-medium text-[#1A1A1A] truncate">{(loc.city as Record<Lang, string>)[l]}</p>
                  <p className="font-inter text-[10px] text-[#A8A4A0] truncate">{(loc.note as Record<Lang, string>)[l]}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
