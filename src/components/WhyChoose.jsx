import { useEffect, useRef } from 'react'

const features = [
  {
    icon: 'FAST',
    title: 'Lightning Fast Processing',
    desc: 'Get your LLC formed in as little as 24 hours. EIN registration completes quickly with status updates.',
  },
  {
    icon: 'SAFE',
    title: '100% Legal Compliance',
    desc: 'All filings follow IRS and state regulations precisely with a compliance-first process.',
  },
  {
    icon: 'GLOBAL',
    title: 'Non-US Resident Friendly',
    desc: 'You can complete everything remotely with guided support at every step.',
  },
  {
    icon: 'ONE',
    title: 'All-in-One Service',
    desc: 'LLC formation, EIN, operating agreement, and filing support from one team.',
  },
  {
    icon: 'HELP',
    title: 'Dedicated Support',
    desc: 'Real humans available on WhatsApp, phone, and email when you need help.',
  },
  {
    icon: 'CLEAR',
    title: 'Transparent Pricing',
    desc: 'Clear scope and pricing before you start. No hidden charges.',
  },
]

export default function WhyChoose() {
  const cardsRef = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.15 }
    )

    cardsRef.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="why" className="py-24" style={{ background: 'linear-gradient(180deg,var(--bg-1) 0%,var(--bg-2) 100%)' }}>
      <div className="section-inner">
        <div className="section-label">Why Choose Us</div>
        <h2 className="section-title">
          The <span>Smart Choice</span> for
          <br />
          US Tax Filing
        </h2>
        <p className="section-sub">
          We help international founders establish and maintain a compliant US business setup with a clean, guided flow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {features.map((f, i) => (
            <div
              key={f.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className="reveal rounded-2xl p-8 border cursor-default relative overflow-hidden group transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'var(--bg-2)', borderColor: 'var(--line)', boxShadow: '0 8px 20px rgba(0,0,0,0.28)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: 'linear-gradient(90deg,var(--accent),var(--accent-2))' }} />

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-[10px] font-bold mb-5"
                style={{ background: 'var(--bg-1)', border: '1px solid var(--line)', color: 'var(--accent-2)' }}
              >
                {f.icon}
              </div>
              <h3 className="font-heading font-bold text-lg mb-3" style={{ color: 'var(--text-0)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

