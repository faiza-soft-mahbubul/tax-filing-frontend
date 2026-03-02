import { useEffect, useRef } from 'react'

const docRows = [
  { icon: '📋', name: 'LLC Formation', sub: 'Articles of Organization', status: 'Done', statusClass: 'bg-green-100 text-green-600' },
  { icon: '🏛️', name: 'EIN Number', sub: 'Federal Tax ID', status: 'In Progress', statusClass: 'bg-teal-50 text-teal' },
  { icon: '📝', name: 'Tax Filing', sub: 'Form 1065 / 1120', status: 'Ready', statusClass: 'bg-blue-50 text-blue-500' },
  { icon: '🏦', name: 'Bank Account', sub: 'Business Account Setup', status: 'Done', statusClass: 'bg-green-100 text-green-600' },
]

export default function Hero() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  useEffect(() => {
    const el = leftRef.current
    const er = rightRef.current
    if (el) {
      el.style.opacity = '0'; el.style.transform = 'translateX(-30px)'
      el.style.transition = 'all 0.9s cubic-bezier(0.22,1,0.36,1)'
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateX(0)' }, 100)
    }
    if (er) {
      er.style.opacity = '0'; er.style.transform = 'translateX(30px)'
      er.style.transition = 'all 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s'
      setTimeout(() => { er.style.opacity = '1'; er.style.transform = 'translateX(0)' }, 300)
    }
  }, [])

  const scrollToForm = (e) => {
    e.preventDefault()
    document.querySelector('#tax-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ paddingTop: 80 }}
    >
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 60% at 80% 50%, rgba(0,186,186,0.10) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 10% 80%, rgba(0,186,186,0.06) 0%, transparent 50%), linear-gradient(160deg, #f0fafa 0%, #e8f9f9 50%, #f0fafa 100%)'
      }} />
      <div className="absolute inset-0 hero-grid-overlay" />

      <div className="relative z-10 max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center w-full py-12">
        {/* Left */}
        <div ref={leftRef}>
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(0,186,186,0.08)', border: '1px solid rgba(0,186,186,0.25)', color: '#008080' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-teal pulse-dot" />
            🇺🇸 USA Business Formation Experts
          </div>

          <h1 className="font-heading font-black text-gray-900 mb-6" style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', lineHeight: 1.1 }}>
            File Your <span className="bg-gradient-to-r from-teal to-teal-light bg-clip-text text-transparent" style={{ WebkitTextFillColor: 'transparent' }}>US Taxes</span><br />
            With Complete<br />Confidence
          </h1>

          <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-lg">
            From LLC registration to EIN filing and tax compliance — we handle every document so you can focus on growing your business in the United States.
          </p>

          <div className="flex gap-4 flex-wrap mb-12">
            <a href="#tax-form" onClick={scrollToForm} className="btn-primary">
              Start Filing Now →
            </a>
          </div>

        </div>

        {/* Right — Document card */}
        <div ref={rightRef} className="relative hidden md:block">
          {/* Float card 1 */}
          <div className="float-anim absolute -top-4 -right-2 z-10 rounded-xl px-4 py-3 bg-white flex items-center gap-3"
            style={{ border: '1px solid rgba(0,186,186,0.25)', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: 'rgba(34,197,94,0.12)' }}>✅</div>
            <div>
              <div className="text-xs font-semibold text-gray-900">LLC Approved</div>
              <div className="text-xs text-gray-400">State of Delaware</div>
            </div>
          </div>

          {/* Main doc card */}
          <div className="rounded-2xl p-6 bg-white relative overflow-hidden"
            style={{ border: '1px solid rgba(0,186,186,0.2)', boxShadow: '0 2px 12px rgba(0,186,186,0.06)' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal to-transparent" />

            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-heading font-bold text-gray-900">Your Documents</div>
                <div className="text-xs text-gray-400 mt-0.5">Q1 2025 Filing Status</div>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded text-white" style={{ background: 'linear-gradient(135deg,#00BABA,#00D8D8)' }}>Active</span>
            </div>

            {docRows.map((row) => (
              <div key={row.name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1.5 hover:bg-teal-50 transition-colors">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 bg-teal-50">{row.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">{row.name}</div>
                  <div className="text-xs text-gray-400">{row.sub}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${row.statusClass}`}>{row.status}</span>
              </div>
            ))}

            <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid #e5f9f9' }}>
              <span className="text-xs text-gray-400">Completion</span>
              <span className="text-xs font-bold text-teal">75%</span>
            </div>
            <div className="h-1 rounded-full mt-1.5 overflow-hidden bg-teal-100">
              <div className="h-full w-3/4 rounded-full" style={{ background: 'linear-gradient(90deg,#00BABA,#00D8D8)' }} />
            </div>
          </div>

          {/* Float card 2 */}
          <div className="float-anim-delayed absolute -bottom-3 -left-4 z-10 rounded-xl px-4 py-3 bg-white"
            style={{ border: '1px solid rgba(0,186,186,0.25)', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <div className="text-xs text-gray-400 mb-0.5">Tax Savings</div>
            <div className="font-heading font-bold text-green-400 text-xl">+$12,400</div>
            <div className="text-xs text-gray-400">This Year</div>
          </div>
        </div>
      </div>
    </section>
  )
}
