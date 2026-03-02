import { useEffect, useState } from 'react'
import useStore from '../store/useStore'
import logoImg from '/logo.png'

const navLinks = [
  { label: 'How It Works', href: '#how' },
  { label: 'Why Us', href: '#why' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}
      style={{
        backdropFilter: 'blur(20px)',
        background: 'rgba(255,255,255,0.95)',
        borderBottom: '1px solid rgba(0,186,186,0.2)',
        boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.04)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-8 flex items-center justify-between py-4">
        {/* Logo */}
        <a href="#" onClick={(e) => handleNav(e, '#')} className="flex items-center gap-3 no-underline">
          <div
            className="flex items-center justify-center rounded-xl p-1 flex-shrink-0"
            style={{ width: 42, height: 42, background: '#fff', boxShadow: '0 1px 6px rgba(0,186,186,0.12)' }}
          >
            <img src={logoImg} alt="Mas Formation" className="w-full h-full object-contain" />
          </div>
          <span className="font-heading font-bold text-gray-900 text-xl">
            Mas <span className="text-teal">Formation</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleNav(e, l.href)}
              className="text-gray-600 hover:text-teal text-sm font-medium transition-colors duration-200 no-underline"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#tax-form"
            onClick={(e) => handleNav(e, '#tax-form')}
            className="btn-primary text-sm px-5 py-2"
          >
            Tax Filing →
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-8 pb-6 flex flex-col gap-4 border-t border-teal-200 bg-white">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleNav(e, l.href)}
              className="text-gray-600 hover:text-teal font-medium py-1 no-underline"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#tax-form"
            onClick={(e) => handleNav(e, '#tax-form')}
            className="btn-primary text-sm self-start"
          >
            Tax Filing →
          </a>
        </div>
      )}
    </nav>
  )
}
