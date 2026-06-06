import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useLanguage } from '@/contexts/LanguageContext'
import { nav } from '@/lib/translations'

const navLinks = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'research', path: '/research' },
  { key: 'life', path: '/life' },
] as const

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { lang, toggleLang } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(247,245,242,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #E0DDD9' : '1px solid transparent',
      }}
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="font-inter text-sm font-semibold tracking-wider text-text-primary"
        >
          cg_OM_AI
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            const label = nav[link.key as keyof typeof nav][lang]
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative font-inter text-sm font-medium tracking-[0.04em] transition-colors duration-300 py-5"
                style={{
                  color: isActive ? '#2E5E4E' : '#6B6866',
                  borderBottom: isActive ? '2px solid #2E5E4E' : '2px solid transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="ml-2 px-3 py-1 rounded-full border border-[#2E5E4E] text-[#2E5E4E] text-sm font-medium
                       transition-all duration-300 hover:bg-[#2E5E4E] hover:text-white"
            aria-label="Toggle language"
          >
            {nav.toggleLang[lang]}
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-3">
          {/* Language Toggle (mobile) */}
          <button
            onClick={toggleLang}
            className="px-3 py-1 rounded-full border border-[#2E5E4E] text-[#2E5E4E] text-sm font-medium
                       transition-all duration-300 hover:bg-[#2E5E4E] hover:text-white"
            aria-label="Toggle language"
          >
            {nav.toggleLang[lang]}
          </button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="p-2 text-text-primary" aria-label="Open menu">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 bg-surface p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-border-custom">
                  <span className="font-inter text-sm font-semibold tracking-wider text-text-primary">
                    cg_OM_AI
                  </span>
                </div>
                <nav className="flex flex-col p-6 gap-2">
                  {navLinks.map((link, i) => {
                    const isActive = location.pathname === link.path
                    const label = nav[link.key as keyof typeof nav][lang]
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: i * 0.08,
                          duration: 0.4,
                          ease: easeOutExpo,
                        }}
                      >
                        <Link
                          to={link.path}
                          className="block py-3 px-4 rounded-lg font-inter text-lg font-medium transition-colors duration-200"
                          style={{
                            color: isActive ? '#2E5E4E' : '#1A1A1A',
                            backgroundColor: isActive ? '#E8F0ED' : 'transparent',
                          }}
                        >
                          {label}
                        </Link>
                      </motion.div>
                    )
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
