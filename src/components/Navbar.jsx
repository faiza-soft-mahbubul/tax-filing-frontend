import { useEffect, useState } from 'react'
import useStore from '../store/useStore'
import logoImg from '/logo.png'

const navLinks = [
  { label: 'How It Works', href: '#how' },
  { label: 'Why Us', href: '#why' },
  { label: 'FAQ', href: '#faq' },
]

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3c0 0 0 0 0 0A7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function Navbar({ theme, onToggleTheme }) {
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useStore()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (e, href) => {
    e.preventDefault()
    closeMobileMenu()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}
      style={{
        backdropFilter: 'blur(20px)',
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--line)',
        boxShadow: scrolled ? '0 8px 24px rgba(0,0,0,0.14)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-8 flex items-center justify-between py-4">
        <a href="#" onClick={(e) => handleNav(e, '#')} className="flex items-center gap-3 no-underline">
          <div
            className="flex items-center justify-center rounded-xl p-1 flex-shrink-0"
            style={{ width: 42, height: 42, background: 'var(--surface-1)', border: '1px solid var(--line)' }}
          >
            <img src={logoImg} alt="Mas Formation" className="w-full h-full object-contain" />
          </div>
          <span className="font-heading font-bold text-xl" style={{ color: 'var(--text-0)' }}>
            Mas <span style={{ color: 'var(--accent-2)' }}>Formation</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleNav(e, l.href)}
              className="text-sm font-medium transition-colors duration-200 no-underline"
              style={{ color: 'var(--text-1)' }}
            >
              {l.label}
            </a>
          ))}

          <button
            type="button"
            onClick={onToggleTheme}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg transition-all"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--text-1)' }}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          <a href="#tax-form" onClick={(e) => handleNav(e, '#tax-form')} className="btn-primary text-sm px-5 py-2">
            Tax Filing
          </a>
        </div>

        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <span
            className={`block w-6 h-0.5 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
            style={{ background: 'var(--text-1)' }}
          />
          <span
            className={`block w-6 h-0.5 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}
            style={{ background: 'var(--text-1)' }}
          />
          <span
            className={`block w-6 h-0.5 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            style={{ background: 'var(--text-1)' }}
          />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-8 pb-6 flex flex-col gap-4 border-t" style={{ borderColor: 'var(--line)', background: 'var(--bg-1)' }}>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleNav(e, l.href)}
              className="font-medium py-1 no-underline"
              style={{ color: 'var(--text-1)' }}
            >
              {l.label}
            </a>
          ))}

          <button
            type="button"
            onClick={onToggleTheme}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg transition-all self-start"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--text-1)' }}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          <a href="#tax-form" onClick={(e) => handleNav(e, '#tax-form')} className="btn-primary text-sm self-start">
            Tax Filing
          </a>
        </div>
      )}
    </nav>
  )
}

