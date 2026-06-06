import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { BookOpen, Code2, Users, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Lang } from '@/contexts/LanguageContext'
import { about } from '@/lib/translations'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* ─── Section Header ─── */
function SectionHeader({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  return (
    <motion.div ref={ref} className="mb-12 md:mb-16">
      <div className="flex items-center gap-3 mb-4">
        <motion.span className="block h-[1px] bg-[#2E5E4E]" initial={{ width: 0 }} animate={isInView ? { width: 24 } : {}} transition={{ duration: 0.4, ease: easeOutExpo }} />
        <span className="font-inter text-xs font-medium tracking-[0.04em] uppercase text-[#2E5E4E]">{eyebrow}</span>
      </div>
      <motion.h2 className="font-noto-serif text-2xl md:text-3xl lg:text-4xl font-medium text-[#1A1A1A]" initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}>
        {heading}
      </motion.h2>
    </motion.div>
  )
}

/* ─── Timeline Item — Rich Design ─── */
function TimelineItem({ year, title, subtitle, isCurrent, index }: { year: string; title: string; subtitle?: string; isCurrent?: boolean; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <motion.div ref={ref} className="relative pl-10 pb-12 last:pb-0 group" initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.1, ease: easeOutExpo }}>
      {/* Animated vertical line */}
      <motion.div className="absolute left-[9px] top-5 bottom-0 w-[2px] bg-[#E0DDD9] origin-top" initial={{ scaleY: 0 }} animate={isInView ? { scaleY: 1 } : {}} transition={{ duration: 0.5, delay: index * 0.1 + 0.2, ease: easeOutExpo }} />
      {/* Rich node circle */}
      <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-[2.5px] flex items-center justify-center transition-all duration-300 group-hover:scale-125 ${isCurrent ? 'bg-[#2E5E4E] border-[#2E5E4E] shadow-[0_0_0_4px_rgba(46,94,78,0.15)]' : 'bg-white border-[#D5D1CC] group-hover:border-[#2E5E4E]'}`}>
        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      {/* Year badge */}
      <span className={`inline-block font-jetbrains-mono text-[11px] tracking-wider px-2 py-0.5 rounded-full mb-2 ${isCurrent ? 'bg-[#E8F0ED] text-[#2E5E4E] font-semibold' : 'text-[#A8A4A0]'}`}>{year}</span>
      {/* Content */}
      <h4 className="font-inter text-base font-semibold text-[#1A1A1A] group-hover:text-[#2E5E4E] transition-colors">{title}</h4>
      {subtitle && <p className="font-inter text-sm text-[#6B6866] mt-1">{subtitle}</p>}
    </motion.div>
  )
}

/* ─── Education & Career Timeline ─── */
function TimelineSection() {
  const { lang } = useLanguage()
  const l = lang as Lang
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const education = [
    { year: '2022', title: l === 'zh' ? '东京大学 · 工学博士' : 'University of Tokyo · Ph.D.', subtitle: l === 'zh' ? '尖端跨学科工程' : 'Advanced Interdisciplinary Studies' },
    { year: '2019', title: l === 'zh' ? '武汉理工大学 · 工学硕士' : 'Wuhan University of Technology · M.Eng.', subtitle: l === 'zh' ? '工业工程' : 'Industrial Engineering' },
    { year: '2015', title: l === 'zh' ? '武汉理工大学 · 工学学士' : 'Wuhan University of Technology · B.Eng.', subtitle: l === 'zh' ? '工业工程' : 'Industrial Engineering' },
  ]

  const career = [
    { year: '2026.02–', title: l === 'zh' ? '中国石油大学（华东）· 特任副教授' : 'China University of Petroleum (East China) · Tenured Associate Professor', subtitle: l === 'zh' ? '硕士生导师' : 'Master Supervisor', isCurrent: true },
    { year: '2022.10–2026.01', title: l === 'zh' ? '东京大学（先端科学技术研究中心）· 特任助理教授' : 'University of Tokyo (RCAST) · Project Assistant Professor' },
    { year: '2025.11', title: l === 'zh' ? '慕尼黑工业大学（管理学院）· 访问学者' : 'Technical University of Munich (School of Management) · Visiting Scholar' },
    { year: '2024.09–2024.12', title: l === 'zh' ? '埃克塞特大学（商学院）· 访问学者' : 'University of Exeter Business School · Visiting Scholar' },
    { year: '2024.02–2024.03', title: l === 'zh' ? '埃克塞特大学（商学院）、利物浦大学（管理学院）· 访问学者' : 'Exeter Business School, Liverpool Management School · Visiting Scholar' },
  ]

  return (
    <section ref={ref} className="py-24 md:py-36 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <SectionHeader eyebrow={l === 'zh' ? '教育与工作' : 'EDUCATION & CAREER'} heading={l === 'zh' ? '教育与工作经历' : 'Education & Career'} />
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: easeOutExpo }}>
            <h3 className="font-inter text-sm font-semibold tracking-[0.06em] uppercase text-[#A8A4A0] mb-8">{(about.educationTitle as Record<Lang,string>)[l]}</h3>
            {education.map((item, i) => <TimelineItem key={i} {...item} index={i} />)}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15, ease: easeOutExpo }}>
            <h3 className="font-inter text-sm font-semibold tracking-[0.06em] uppercase text-[#A8A4A0] mb-8">{(about.careerTitle as Record<Lang,string>)[l]}</h3>
            {career.map((item, i) => <TimelineItem key={i} {...item} index={i} />)}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── Skills ─── */
function SkillsSection() {
  const { lang } = useLanguage()
  const l = lang as Lang
  const skills = [
    { title: about.skill1Title, items: about.skill1Items, icon: BookOpen },
    { title: about.skill2Title, items: about.skill2Items, icon: Code2 },
    { title: about.skill3Title, items: about.skill3Items, icon: Users },
  ]

  return (
    <section className="py-24 md:py-36 bg-[#F7F5F2]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <SectionHeader eyebrow={(about.skillsEyebrow as Record<Lang,string>)[l]} heading={(about.skillsHeading as Record<Lang,string>)[l]} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: i * 0.1, ease: easeOutExpo }} className="p-6 rounded-xl border border-[#E0DDD9] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#2E5E4E] hover:shadow-lg" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-[#E8F0ED] text-[#2E5E4E]"><Icon size={20} /></div>
                <h3 className="font-inter text-base font-semibold text-[#1A1A1A] mb-3">{(s.title as Record<Lang,string>)[l]}</h3>
                <div className="flex flex-wrap gap-2">
                  {(s.items as Record<Lang,string[]>)[l].map((item: string) => <span key={item} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F7F5F2] text-[#6B6866]">{item}</span>)}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Language Skills ─── */
function LanguageSection() {
  const { lang } = useLanguage()
  const l = lang as Lang

  return (
    <section className="py-24 md:py-36 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <SectionHeader eyebrow={(about.languageEyebrow as Record<Lang, string>)[l]} heading={(about.languageHeading as Record<Lang, string>)[l]} />
        <div className="grid sm:grid-cols-3 gap-5">
          {about.languageItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: easeOutExpo }}
              className="p-5 rounded-xl border border-[#E0DDD9] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <Globe size={18} style={{ color: item.textColor }} />
                <span className="font-inter text-sm font-semibold text-[#1A1A1A]">
                  {(item.lang as Record<Lang, string>)[l]}
                </span>
                <span
                  className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ backgroundColor: item.bgColor, color: item.textColor }}
                >
                  {(item.badge as Record<Lang, string>)[l]}
                </span>
              </div>
              <p className="font-inter text-sm text-[#6B6866] leading-relaxed">
                {(item.level as Record<Lang, string>)[l]}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── About Page: Education/Career + Skills + Languages ─── */
export default function About() {
  return (
    <main>
      <TimelineSection />
      <SkillsSection />
      <LanguageSection />
    </main>
  )
}
