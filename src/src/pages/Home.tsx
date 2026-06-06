import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, MapPin } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Lang } from '@/contexts/LanguageContext'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* ─── Canvas Animation ─── */
function GradientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = ['#2E5E4E', '#4A8A7A', '#7AB8A8', '#C8822B']
    // Lines distributed in upper and lower bands only, leaving center clear for text
    const lines = Array.from({ length: 12 }, (_, i) => {
      // Split lines into upper band (0-35%) and lower band (65-100%)
      const inUpper = i < 6
      const bandStart = inUpper ? 0.02 : 0.68
      const bandRange = inUpper ? 0.33 : 0.30
      return {
        y: bandStart + Math.random() * bandRange,
        amplitude: 12 + Math.random() * 20,
        frequency: 0.3 + Math.random() * 1.0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0003 + Math.random() * 0.0008,
        stops: Array.from({ length: 4 }, () => Math.random()),
        width: 1.5 + Math.random() * 2.5,
      }
    })

    let animId: number
    const draw = (time: number) => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      lines.forEach((line) => {
        ctx.beginPath()
        const gradient = ctx.createLinearGradient(0, 0, w, 0)
        line.stops.forEach((stop, j) => {
          gradient.addColorStop((stop + time * line.speed * 0.3) % 1, colors[j % colors.length] + (j % 2 === 0 ? 'B0' : '80'))
        })
        ctx.strokeStyle = gradient
        ctx.lineWidth = line.width
        ctx.lineCap = 'round'
        for (let x = 0; x <= w; x += 4) {
          const normX = x / w
          const wave = Math.sin(normX * line.frequency * Math.PI * 2 + line.phase + time * line.speed) * line.amplitude
          const my = mouseRef.current ? mouseRef.current.y / h : -10
          const dy = (line.y - my) * h
          const mouseDisp = Math.abs(dy) < 120 ? Math.exp(-(dy * dy) / 8000) * 18 * Math.sign(dy) : 0
          const y = line.y * h + wave + mouseDisp
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
      })
      animId = requestAnimationFrame(draw)
    }
    animId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
  }, [])
  const onLeave = useCallback(() => { mouseRef.current = null }, [])

  return <canvas ref={canvasRef} onMouseMove={onMove} onMouseLeave={onLeave} className="absolute inset-0 w-full h-full" />
}

/* ─── Hero ─── */
function HeroSection() {
  const { lang } = useLanguage()
  const l = lang as Lang

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }
  const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutExpo } } }

  return (
    <section className="relative min-h-[100dvh] flex items-center bg-[#F7F5F2] overflow-hidden">
      <GradientCanvas />
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12 pt-20">
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Left: text */}
          <motion.div variants={container} initial="hidden" animate="visible" className="lg:col-span-3">
            <motion.h1 variants={item} className="font-noto-serif text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-[#1A1A1A] mb-4">
              {l === 'zh' ? '崔耕' : 'Geng Cui'}
            </motion.h1>
            <motion.p variants={item} className="font-inter text-[clamp(1rem,2vw,1.25rem)] text-[#6B6866] mb-2">
              {l === 'zh' ? '特任副教授、硕士生导师' : 'Tenured Associate Professor, Master Supervisor'}
            </motion.p>
            <motion.p variants={item} className="font-inter text-base text-[#A8A4A0] mb-8">
              {l === 'zh' ? '中国石油大学（华东）· 经济管理学院·信息管理系' : 'School of Economics and Management, China University of Petroleum (East China)'}
            </motion.p>
            <motion.div variants={item} className="flex flex-wrap gap-2 mb-10">
              {(l === 'zh' ? ['供应链与库存管理', '智能决策与优化', '人工智能赋能的运营管理'] : ['Supply Chain & Inventory', 'Intelligent Optimization', 'AI-Enabled Operations']).map((kw, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-[#E8F0ED] text-[#2E5E4E]">{kw}</span>
              ))}
            </motion.div>
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 text-sm text-[#6B6866]">
              <a href="mailto:gengc25@hotmail.com" className="flex items-center gap-2 hover:text-[#2E5E4E] transition-colors"><Mail size={16} /> gengc25@hotmail.com</a>
              <a href="mailto:cuigeng@upc.edu.cn" className="flex items-center gap-2 hover:text-[#2E5E4E] transition-colors"><Mail size={16} /> cuigeng@upc.edu.cn</a>
              <span className="flex items-center gap-2"><MapPin size={16} /> {l === 'zh' ? '文理楼 535' : 'Wenli Building 535'}</span>
            </motion.div>
            <motion.div variants={item} className="flex gap-4 mt-8">
              <Link to="/research" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-[#2E5E4E] text-white hover:bg-[#234A3C] transition-colors">
                {l === 'zh' ? '查看科研' : 'Research'}
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border border-[#E0DDD9] text-[#6B6866] hover:border-[#2E5E4E] hover:text-[#2E5E4E] transition-colors">
                {l === 'zh' ? '关于我' : 'About'}
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: photo (desktop only) */}
          <motion.div
            className="lg:col-span-2 hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: easeOutExpo }}
          >
            <div className="rounded-2xl overflow-hidden shadow-xl w-full max-w-md">
              <img src="/Loch Ness.jpg" alt="Loch Ness" className="w-full h-auto object-cover" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── Research Statement ─── */
function ResearchStatementSection() {
  const { lang } = useLanguage()
  const l = lang as Lang

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: easeOutExpo }} className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="block h-[1px] w-6 bg-[#2E5E4E]" />
            <span className="font-inter text-xs font-medium tracking-[0.08em] uppercase text-[#2E5E4E]">{l === 'zh' ? '研究简介' : 'Research'}</span>
          </div>
          <p className="font-inter text-lg leading-[1.8] text-[#6B6866]">
            {l === 'zh'
              ? '我的研究聚焦于供应链管理、库存优化与人工智能赋能的运营决策，致力于将运筹学优化方法与机器学习技术深度融合，为企业供应链管理提供科学决策支持。目前感兴趣的研究方向包括：供应链协调与库存优化、需求预测与牛鞭效应缓解、以及人工智能在供应链中断管理中的创新应用。'
              : 'My research focuses on supply chain management, inventory optimization, and AI-enabled operational decision-making. I am dedicated to integrating operations research methods with machine learning techniques to provide scientific decision support for enterprise supply chain management. My current research interests include supply chain coordination and inventory optimization, demand forecasting and bullwhip effect mitigation, and innovative applications of AI in supply chain disruption management.'
            }
          </p>
          <Link to="/research" className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-[#2E5E4E] hover:gap-3 transition-all">
            {l === 'zh' ? '查看论文与项目' : 'View Publications & Projects'} <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Contact CTA ─── */
function ContactCTASection() {
  const { lang } = useLanguage()
  const l = lang as Lang

  return (
    <section className="py-24 lg:py-32 bg-[#F7F5F2]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: easeOutExpo }} className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="block h-[1px] w-6 bg-[#2E5E4E]" />
            <span className="font-inter text-xs font-medium tracking-[0.08em] uppercase text-[#2E5E4E]">{l === 'zh' ? '联系' : 'CONTACT'}</span>
          </div>
          <h2 className="font-noto-serif text-2xl md:text-3xl font-medium text-[#1A1A1A] mb-4">
            {l === 'zh' ? '期待交流' : 'Get in Touch'}
          </h2>
          <p className="font-inter text-base text-[#6B6866] leading-relaxed mb-8">
            {l === 'zh'
              ? '如果您对供应链管理、运营优化或人工智能应用感兴趣，欢迎随时联系。'
              : 'If you are interested in supply chain management, operations optimization, or AI applications, feel free to reach out.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:gengc25@hotmail.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-[#2E5E4E] text-white hover:bg-[#234A3C] transition-colors">
              <Mail size={16} /> gengc25@hotmail.com
            </a>
            <a href="mailto:cuigeng@upc.edu.cn" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border border-[#E0DDD9] text-[#6B6866] hover:border-[#2E5E4E] hover:text-[#2E5E4E] transition-colors">
              <Mail size={16} /> cuigeng@upc.edu.cn
            </a>
          </div>
          <p className="font-inter text-sm text-[#A8A4A0] mt-6 flex items-center gap-2">
            <MapPin size={14} /> {l === 'zh' ? '山东省青岛市黄岛区长江西路66号 中国石油大学（华东）文理楼535' : 'Room 535, Wenli Building, China University of Petroleum (East China), No.66 Changjiang West Road, Qingdao, Shandong'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Home Page: Hero + Research Statement + Contact CTA ─── */
export default function Home() {
  return (
    <>
      <HeroSection />
      <ResearchStatementSection />
      <ContactCTASection />
    </>
  )
}
