import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhyChoose from './components/WhyChoose'
import HowItWorks from './components/HowItWorks'
import FAQ from './components/FAQ'
import TaxForm from './components/TaxForm'
import Footer from './components/Footer'

const THEME_KEY = 'mas_theme'

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <WhyChoose />
      <HowItWorks />
      <FAQ />
      <TaxForm />
      <Footer />
    </>
  )
}
