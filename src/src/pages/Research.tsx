import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useLanguage } from '@/contexts/LanguageContext'

/* ──────────────────────────────────────────────
   Animation helpers
   ────────────────────────────────────────────── */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo, delay: i * 0.08 },
  }),
}

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
}

/* ──────────────────────────────────────────────
   Section Header
   ────────────────────────────────────────────── */
function SectionHeader({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <div className="mb-12 lg:mb-16">
      <motion.div
        className="flex items-center gap-3 mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          className="inline-block h-[1px]"
          style={{ backgroundColor: '#2E5E4E' }}
          initial={{ width: 0 }}
          whileInView={{ width: 24 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, ease: easeOutExpo }}
        />
        <span
          className="font-jetbrains-mono text-xs font-medium tracking-[0.04em] uppercase"
          style={{ color: '#2E5E4E' }}
        >
          {eyebrow}
        </span>
      </motion.div>

      <motion.h2
        className="font-noto-serif text-3xl lg:text-4xl font-medium tracking-tight"
        style={{ color: '#1A1A1A', lineHeight: 1.2 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeIn}
      >
        {heading}
      </motion.h2>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Project Card
   ────────────────────────────────────────────── */
interface ProjectData {
  title: string       // English/default title
  titleZh?: string    // Chinese title (optional)
  desc?: string       // English/default description
  descZh?: string     // Chinese description (optional)
  period: string
  role: { zh: string; en: string }
  status: { zh: string; en: string }
}

function ProjectCard({ project, index }: { project: ProjectData; index: number }) {
  const { lang } = useLanguage()
  const isZh = lang === 'zh'

  const statusLabel = isZh ? project.status.zh : project.status.en
  const roleLabel = isZh ? project.role.zh : project.role.en
  const titleText = isZh && project.titleZh ? project.titleZh : project.title
  const descText = isZh && project.descZh ? project.descZh : project.desc

  const isActive = project.status.en === 'Ongoing' || project.status.en === 'Active'

  return (
    <motion.div
      className="flex overflow-hidden rounded-md"
      style={{ border: '1px solid #E0DDD9', backgroundColor: '#FFFFFF' }}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
    >
      {/* Left accent bar */}
      <div
        className="w-1 rounded-l-md flex-shrink-0"
        style={{ backgroundColor: '#2E5E4E' }}
      />

      {/* Card body */}
      <div className="flex-1 py-6 px-8">
        {/* Top row: Title + Status badge */}
        <div className="flex flex-wrap items-center gap-3">
          <h3
            className="text-base font-semibold"
            style={{ color: '#1A1A1A' }}
          >
            {titleText}
          </h3>
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
            style={
              isActive
                ? { backgroundColor: '#E8F0ED', color: '#2E5E4E' }
                : { backgroundColor: '#EDEAE6', color: '#A8A4A0' }
            }
          >
            {statusLabel}
          </span>
        </div>

        {/* Second row: Period + Role tag */}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <span
            className="font-jetbrains-mono text-xs"
            style={{ color: '#A8A4A0' }}
          >
            {project.period}
          </span>
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
            style={{ backgroundColor: '#F7F5F2', color: '#6B6866', border: '1px solid #E0DDD9' }}
          >
            {roleLabel}
          </span>
        </div>

        {/* Third row: Description */}
        {descText && (
          <p
            className="mt-3 text-sm italic"
            style={{ color: '#6B6866' }}
          >
            {descText}
          </p>
        )}
      </div>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────
   Author formatting helper
   ────────────────────────────────────────────── */
const formatAuthors = (text: string, corrAuthor?: string) => {
  // Mark corresponding author with * directly (no brackets)
  let processed = text
  if (corrAuthor) {
    processed = processed.replace(corrAuthor, `${corrAuthor}*`)
  }
  const parts = processed.split(/(Geng Cui|Cui Geng)/g)
  return parts.map((part, i) => {
    if (part === 'Geng Cui' || part === 'Cui Geng') {
      return <span key={i} className="font-bold underline">{part}</span>
    }
    if (part === '*') {
      return <span key={i} className="text-[#2E5E4E] font-medium">*</span>
    }
    return <span key={i}>{part}</span>
  })
}

/* ──────────────────────────────────────────────
   Paper Item
   ────────────────────────────────────────────── */
function PaperItem({
  index,
  authors,
  title,
  journal,
  year,
  corrAuthor,
}: {
  index: number
  authors: string
  title: string
  journal: string
  year?: string
  corrAuthor?: string  // name of corresponding author to mark with *
}) {
  // Format authors: bold+underline "Geng Cui"/"Cui Geng" and mark corresponding author
  const formattedAuthors = formatAuthors(authors, corrAuthor)

  return (
    <motion.div
      className="flex gap-4 py-4"
      style={{ borderBottom: '1px solid #F0EDEA' }}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      custom={index}
    >
      <span className="font-jetbrains-mono text-sm text-[#A8A4A0] w-8 flex-shrink-0">
        {String(index).padStart(2, '0')}
      </span>
      <div>
        <p className="text-xs text-[#6B6866] mb-1">
          {formattedAuthors}
        </p>
        <p className="text-sm font-medium text-[#1A1A1A] italic mb-1">&ldquo;{title}&rdquo;</p>
        <p className="text-xs italic" style={{ color: '#2E5E4E' }}>
          {journal}
          {year && ` (${year})`}
        </p>
      </div>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────
   Data — Projects
   ────────────────────────────────────────────── */
function getProjects(_lang: 'zh' | 'en'): ProjectData[] {
  return [
    {
      title: 'JSPS Grant-in-Aid for Early-Career Scientists (WAKATE) Grant Number 25K17791',
      desc: 'Building supply chain resilience: artificial intelligence in proactive and reactive disruption management',
      period: '2025–2026',
      role: { zh: '主持', en: 'PI' },
      status: { zh: '已终止', en: 'Terminated' },
    },
    {
      title: 'Inventory Management Optimization Project with Mitsubishi Food Co., Ltd.',
      titleZh: '东京大学-三菱食品株式会社库存管理优化项目',
      desc: '',
      period: '2025–2026',
      role: { zh: '主持', en: 'PI' },
      status: { zh: '已完成', en: 'Completed' },
    },
    {
      title: 'UTEC Young Researchers\' Challenge Support Program',
      desc: 'Modelling and optimization of supply chain systems using stylized models',
      period: '2023–2024',
      role: { zh: '主持', en: 'PI' },
      status: { zh: '已完成', en: 'Completed' },
    },
    {
      title: 'China University of Petroleum (East China) Independent Innovation Research Program',
      titleZh: '中国石油大学（华东）自主创新科研计划项目',
      desc: '',
      period: '2026–2029',
      role: { zh: '主持', en: 'PI' },
      status: { zh: '进行中', en: 'Ongoing' },
    },
  ]
}

/* ──────────────────────────────────────────────
   Data — Papers (EXACT text as specified)
   ────────────────────────────────────────────── */
interface PaperData {
  index: number
  authors: string
  title: string
  journal: string
  year?: string
  corrAuthor?: string
}

const publishedPapers: PaperData[] = [
  {
    index: 1,
    authors: 'Geng Cui, Stephen M. Disney, Naoto Imura, and Katsuhiro Nishinari',
    corrAuthor: 'Stephen M. Disney',
    title: 'Coordinating supply chains with order smoothing and cooperative game theory',
    journal: 'International Journal of Production Economics',
    year: '2026',
  },
  {
    index: 2,
    authors: 'Geng Cui*, Naoto Imura, and Katsuhiro Nishinari',
    title: 'Should firms invest in demand forecasting? Benefits of improving forecasting accuracy on order smoothing, dual-sourcing and multi-stage supply chain problems',
    journal: 'International Journal of Production Research',
    year: '2025',
  },
  {
    index: 3,
    authors: 'Geng Cui*, Naoto Imura, Katsuhiro Nishinari, and Takahiro Ezaki',
    title: 'The effect of local forecasting improvements on supply chain performance',
    journal: 'European Journal of Industrial Engineering',
    year: '2026',
  },
  {
    index: 4,
    authors: 'Geng Cui*, Naoto Imura, Katsuhiro Nishinari, and Takahiro Ezaki',
    title: 'On Order Smoothing Interpolating the Order-Up-To and Constant Order Policies',
    journal: 'Omega',
    year: '2025',
  },
  {
    index: 5,
    authors: 'Geng Cui*, Daichi Yanagisawa, and Katsuhiro Nishinari',
    title: 'Learning from experimental data to simulate pedestrian dynamics',
    journal: 'Physica A: Statistical Mechanics and its Applications',
    year: '2023',
  },
  {
    index: 6,
    authors: 'Geng Cui*, Daichi Yanagisawa, and Katsuhiro Nishinari',
    title: 'Incorporating genetic algorithm to optimise initial condition of pedestrian evacuation based on agent aggressiveness',
    journal: 'Physica A: Statistical Mechanics and its Applications',
    year: '2021',
  },
  {
    index: 7,
    authors: 'Geng Cui*, Daichi Yanagisawa, and Nishinari Katsuhiro',
    title: 'A Data Driven Approach to Simulate Pedestrian Competitiveness Using the Social Force Model',
    journal: 'Collective Dynamics',
    year: '2021',
  },
  {
    index: 8,
    authors: 'Cunrong Li, Bhaba R. Sarker, Geng Cui, Xiaolong Chen, Wanli Luo',
    title: 'An optimal procurement policy for multiple consumable accessories with different lifespan distributions',
    journal: 'Computers & Industrial Engineering',
    year: '2019',
  },
]

const underReviewPapers = [
  {
    index: 9,
    authors: 'Geng Cui, Stephen M. Disney, Naoto Imura, and Katsuhiro Nishinari',
    title: 'Supply chain dynamics under the proportional order-up-to replenishment policy: the role of lead time',
    journal: '3nd Round Minor Revision in European Journal of Operational Research',
    corrAuthor: 'Stephen M. Disney',
  },
]

const conferencePapers = [
  {
    index: 1,
    authors: 'Geng Cui, Naoto Imura, and Katsuhiro Nishinari',
    title: 'Deep reinforcement learning reproduces order smoothing in an interactive two-stage supply chain',
    venue: 'In 2025 INFORMS International Conference, July 20–23, 2025 in Singapore',
  },
  {
    index: 2,
    authors: 'Geng Cui, Stephen M. Disney, Naoto Imura, and Katsuhiro Nishinari',
    title: 'Shapley Value-Based Profit Allocation for Collaborative Bullwhip Effect Mitigation',
    venue: 'In 2024 INFORMS Annual Meeting, October 20-23, 2024 in Seattle, WA, USA (Accepted but did not attend due to scheduling conflicts)',
  },
  {
    index: 3,
    authors: 'Akihito Nagahama, Kensuke Tanaka, Claudio Feliciani, Geng Cui, and Takahiro Wada',
    title: 'Effects of Urban Landscape and Soundscape on Driving Behavior',
    venue: 'In 2022 IEEE Conference on Cognitive and Computational Aspects of Situation Management (Cog SIMA), pp. 84-88. IEEE, 2022',
  },
  {
    index: 4,
    authors: 'Geng Cui, Daichi Yanagisawa, and Katsuhiro Nishinari',
    title: 'A Data Driven Approach to Simulate Pedestrian Competitiveness Using the Social Force Model',
    venue: '2020 Pedestrian and Evacuation Dynamics Conference, University of Melbourne, 2020',
  },
  {
    index: 5,
    authors: 'Geng Cui, Daichi Yanagisawa, and Katsuhiro Nishinari',
    title: 'The effect of inflow rate and conflict around the exit on evacuation efficiency',
    venue: 'The Mathematical Society of Traffic Flow, Nagoya University, 2020',
  },
]

/* ──────────────────────────────────────────────
   Conference Item
   ────────────────────────────────────────────── */
function ConferenceItem({
  index,
  authors,
  title,
  venue,
}: {
  index: number
  authors: string
  title: string
  venue: string
}) {
  return (
    <motion.div
      className="flex gap-4 py-4"
      style={{ borderBottom: '1px solid #F0EDEA' }}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      custom={index}
    >
      <span className="font-jetbrains-mono text-sm text-[#A8A4A0] w-8 flex-shrink-0">
        {String(index).padStart(2, '0')}
      </span>
      <div>
        <p className="text-xs text-[#6B6866] mb-1">{formatAuthors(authors)}</p>
        <p className="text-sm font-medium text-[#1A1A1A] italic mb-1">&ldquo;{title}&rdquo;</p>
        <p className="text-xs italic" style={{ color: '#2E5E4E' }}>{venue}</p>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════ */
export default function Research() {
  const { lang } = useLanguage()

  const labels = {
    section1Eyebrow: lang === 'zh' ? '科研项目' : 'RESEARCH PROJECTS',
    section1Heading: lang === 'zh' ? '科研项目' : 'Research Projects',
    section2Eyebrow: lang === 'zh' ? '发表论文' : 'PUBLICATIONS',
    section2Heading: lang === 'zh' ? '发表论文' : 'Publications',
    tabJournal: lang === 'zh' ? '期刊论文' : 'Journal Papers',
    tabWorking: lang === 'zh' ? '在审论文' : 'Under Review',
    tabConference: lang === 'zh' ? '会议论文' : 'Conference Papers',
    tabService: lang === 'zh' ? '审稿服务' : 'Peer Review',
    reviewServiceText: 'IEEE Transactions on Intelligent Transportation Systems、Physica A、Omega等期刊匿名审稿人。',
    reviewServiceTextEn:
      'Anonymous reviewer for IEEE Transactions on Intelligent Transportation Systems, Physica A, Omega, and other journals.',
  }

  const projects = getProjects(lang)

  return (
    <div>
      {/* ═══════ Section 1: Projects ═══════ */}
      <section style={{ backgroundColor: '#F7F5F2', padding: '6rem 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <SectionHeader
            eyebrow={labels.section1Eyebrow}
            heading={labels.section1Heading}
          />

          <div className="flex flex-col gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={i} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Section 2: Research Directions ═══════ */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '6rem 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <SectionHeader
            eyebrow={lang === 'zh' ? '研究方向' : 'RESEARCH DIRECTIONS'}
            heading={lang === 'zh' ? '研究方向' : 'Research Directions'}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Direction 1: DRL in SCM */}
            <motion.div
              className="rounded-lg overflow-hidden"
              style={{ border: '1px solid #E0DDD9', backgroundColor: '#F7F5F2' }}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              custom={0}
            >
              <div className="overflow-hidden" style={{ height: '280px' }}>
                <img
                  src="/research/Research_direction1.png"
                  alt={
                    lang === 'zh'
                      ? '深度强化学习驱动的供应链管理'
                      : 'Deep Reinforcement Learning in Supply Chain Management'
                  }
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#1A1A1A' }}>
                  {lang === 'zh'
                    ? '深度强化学习驱动的供应链管理'
                    : 'Deep Reinforcement Learning in Supply Chain Management'}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B6866' }}>
                  {lang === 'zh'
                    ? '探索深度强化学习如何优化供应链中的序贯决策，涵盖库存控制、订单平滑与中断管理。利用多智能体强化学习捕捉供应链各层级间的策略交互，构建主动式与反应式中断应对机制。'
                    : 'Investigating how deep reinforcement learning can optimize sequential decision-making in supply chains, including inventory control, order smoothing, and disruption management. Using multi-agent RL to capture strategic interactions across supply chain echelons and design both proactive and reactive disruption countermeasures.'}
                </p>
              </div>
            </motion.div>

            {/* Direction 2: Coordination & Bullwhip Effect */}
            <motion.div
              className="rounded-lg overflow-hidden"
              style={{ border: '1px solid #E0DDD9', backgroundColor: '#F7F5F2' }}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              custom={1}
            >
              <div className="overflow-hidden" style={{ height: '280px' }}>
                <img
                  src="/research/Research_direction2.png"
                  alt={
                    lang === 'zh'
                      ? '供应链协调与牛鞭效应抑制'
                      : 'Supply Chain Coordination & Bullwhip Effect Mitigation'
                  }
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#1A1A1A' }}>
                  {lang === 'zh'
                    ? '供应链协调与牛鞭效应抑制'
                    : 'Supply Chain Coordination & Bullwhip Effect Mitigation'}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B6866' }}>
                  {lang === 'zh'
                    ? '通过系统动力学与控制理论研究供应链动态特性与协调机制。运用合作博弈论（Shapley值）设计公平的利润分配方案，缓解多级供应链网络中的牛鞭效应，实现协同共赢。'
                    : 'Studying supply chain dynamics and coordination mechanisms through system dynamics and control theory. Applying cooperative game theory (Shapley value) to design fair profit allocation schemes and mitigate the bullwhip effect across multi-echelon supply networks for collaborative win-win outcomes.'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ Section 3: Publications ═══════ */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '6rem 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <SectionHeader
            eyebrow={labels.section2Eyebrow}
            heading={labels.section2Heading}
          />

          <Tabs defaultValue="journal">
            <TabsList className="flex w-full h-auto p-0 bg-transparent rounded-none gap-0 overflow-x-auto border-b" style={{ borderColor: '#F0EDEA' }}>
              <TabsTrigger
                value="journal"
                className="relative flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-none border-0 border-b-2 bg-transparent font-inter text-sm font-medium whitespace-nowrap transition-colors duration-200 data-[state=active]:shadow-none data-[state=active]:border-[#2E5E4E] data-[state=active]:text-[#1A1A1A] text-[#A8A4A0] border-transparent"
              >
                {labels.tabJournal}
              </TabsTrigger>
              <TabsTrigger
                value="working"
                className="relative flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-none border-0 border-b-2 bg-transparent font-inter text-sm font-medium whitespace-nowrap transition-colors duration-200 data-[state=active]:shadow-none data-[state=active]:border-[#2E5E4E] data-[state=active]:text-[#1A1A1A] text-[#A8A4A0] border-transparent"
              >
                {labels.tabWorking}
              </TabsTrigger>
              <TabsTrigger
                value="conference"
                className="relative flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-none border-0 border-b-2 bg-transparent font-inter text-sm font-medium whitespace-nowrap transition-colors duration-200 data-[state=active]:shadow-none data-[state=active]:border-[#2E5E4E] data-[state=active]:text-[#1A1A1A] text-[#A8A4A0] border-transparent"
              >
                {labels.tabConference}
              </TabsTrigger>
              <TabsTrigger
                value="service"
                className="relative flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-none border-0 border-b-2 bg-transparent font-inter text-sm font-medium whitespace-nowrap transition-colors duration-200 data-[state=active]:shadow-none data-[state=active]:border-[#2E5E4E] data-[state=active]:text-[#1A1A1A] text-[#A8A4A0] border-transparent"
              >
                {labels.tabService}
              </TabsTrigger>
            </TabsList>

            {/* Tab 1 — Journal Papers */}
            <TabsContent value="journal" className="mt-6">
              {publishedPapers.map((paper) => (
                <PaperItem
                  key={paper.index}
                  index={paper.index}
                  authors={paper.authors}
                  corrAuthor={paper.corrAuthor}
                  title={paper.title}
                  journal={paper.journal}
                  year={paper.year}
                />
              ))}
            </TabsContent>

            {/* Tab 2 — Under Review */}
            <TabsContent value="working" className="mt-6">
              {underReviewPapers.map((paper) => (
                <PaperItem
                  key={paper.index}
                  index={paper.index}
                  authors={paper.authors}
                  title={paper.title}
                  journal={paper.journal}
                  corrAuthor={(paper as any).corrAuthor}
                />
              ))}
            </TabsContent>

            {/* Tab 3 — Conference Papers */}
            <TabsContent value="conference" className="mt-6">
              {conferencePapers.map((paper) => (
                <ConferenceItem
                  key={paper.index}
                  index={paper.index}
                  authors={paper.authors}
                  title={paper.title}
                  venue={paper.venue}
                />
              ))}
            </TabsContent>

            {/* Tab 4 — Review Service */}
            <TabsContent value="service" className="mt-6">
              <p className="text-sm leading-relaxed" style={{ color: '#6B6866' }}>
                {lang === 'zh' ? labels.reviewServiceText : labels.reviewServiceTextEn}
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
