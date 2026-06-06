import { Link } from 'react-router'
import { Mail, MapPin } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { footer, nav } from '@/lib/translations'

export default function Footer() {
  const { lang } = useLanguage()

  const quickLinks = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'research', path: '/research' },
    { key: 'life', path: '/life' },
  ] as const

  return (
    <footer className="bg-text-primary text-text-muted">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Left — Name & Brand */}
          <div className="space-y-4">
            <h3 className="font-noto-serif text-xl font-semibold text-white">
              {footer.name[lang]}
            </h3>
            <p className="text-sm leading-relaxed">
              {footer.title[lang]}
            </p>
            <p className="text-sm leading-relaxed">
              {footer.affiliation[lang]}
            </p>
            <div className="font-jetbrains-mono text-xs tracking-[0.1em] pt-2 text-accent-teal">
              cg_OM_AI
            </div>
          </div>

          {/* Center — Quick Nav */}
          <div className="space-y-4">
            <h4 className="font-inter text-sm font-semibold tracking-[0.04em] uppercase text-white">
              {footer.navTitle[lang]}
            </h4>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm transition-colors duration-200 hover:text-white"
                >
                  {nav[link.key][lang]}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right — Contact */}
          <div className="space-y-4">
            <h4 className="font-inter text-sm font-semibold tracking-[0.04em] uppercase text-white">
              {footer.contactTitle[lang]}
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:cuigeng@upc.edu.cn"
                className="flex items-center gap-2 text-sm transition-colors duration-200 hover:text-white"
              >
                <Mail size={14} />
                cuigeng@upc.edu.cn
              </a>
              <a
                href="mailto:gengc25@hotmail.com"
                className="flex items-center gap-2 text-sm transition-colors duration-200 hover:text-white"
              >
                <Mail size={14} />
                gengc25@hotmail.com
              </a>
              <div className="flex items-start gap-2 text-sm pt-1">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>{footer.address[lang]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {footer.copyright[lang]}
          </p>
          <p className="text-xs text-text-muted">
            {footer.tagline[lang]}
          </p>
        </div>
      </div>
    </footer>
  )
}
