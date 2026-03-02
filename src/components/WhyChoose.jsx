import { useEffect, useRef } from 'react'

const features = [
  { icon: '⚡', title: 'Lightning Fast Processing', desc: 'Get your LLC formed in as little as 24 hours. EIN registration completed within 3–5 business days. We know time is money.' },
  { icon: '🔒', title: '100% Legal Compliance', desc: 'All filings follow IRS and state regulations precisely. We maintain your registered agent, annual reports, and compliance calendar.' },
  { icon: '🌍', title: 'Non-US Resident Friendly', desc: "You don't need to be in the USA. We handle everything remotely — perfect for Bangladesh-based entrepreneurs expanding globally." },
  { icon: '💼', title: 'All-in-One Service', desc: 'LLC formation, EIN, Operating Agreement, business banking setup, registered agent — one partner for your entire US presence.' },
  { icon: '💬', title: 'Dedicated Support', desc: 'Real experts available via WhatsApp, phone, and email. No bots — just dedicated professionals who understand your needs.' },
  { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden fees. Know exactly what you\'re paying before you start. Flexible payment options available.' },
]

export default function WhyChoose() {
  const cardsRef = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.15 })

    cardsRef.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="why" className="py-24" style={{ background: 'linear-gradient(180deg,#f8fffe 0%,#eef9f9 100%)' }}>
      <div className="section-inner">
        <div className="section-label">Why Choose Us</div>
        <h2 className="section-title">The <span>Smart Choice</span> for<br />US Tax Filing</h2>
        <p className="section-sub">We've helped thousands of international entrepreneurs establish and maintain their US business presence — fast, legally, and stress-free.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {features.map((f, i) => (
            <div
              key={f.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className="reveal bg-white rounded-2xl p-8 border border-gray-100 cursor-default relative overflow-hidden group transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              {/* Top hover bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal to-teal-light scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                style={{ background: 'rgba(0,186,186,0.08)', border: '1px solid rgba(0,186,186,0.15)' }}>
                {f.icon}
              </div>
              <h3 className="font-heading font-bold text-gray-900 text-lg mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
