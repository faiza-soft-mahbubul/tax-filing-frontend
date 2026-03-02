import { useEffect, useRef } from 'react'

const docRows = [
  { icon: 'LLC', name: 'LLC Formation', sub: 'Articles of Organization', status: 'Done', statusClass: 'bg-green-900/40 text-green-300' },
  { icon: 'EIN', name: 'EIN Number', sub: 'Federal Tax ID', status: 'In Progress', statusClass: 'bg-blue-900/30 text-blue-300' },
  { icon: 'TAX', name: 'Tax Filing', sub: 'Form 1065 / 1120', status: 'Ready', statusClass: 'bg-slate-700 text-slate-200' },
  { icon: 'BANK', name: 'Bank Account', sub: 'Business Account Setup', status: 'Done', statusClass: 'bg-green-900/40 text-green-300' },
]

export default function Hero() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  useEffect(() => {
    const el = leftRef.current
    const er = rightRef.current
    if (el) {
      el.style.opacity = '0'
      el.style.transform = 'translateX(-30px)'
      el.style.transition = 'all 0.9s cubic-bezier(0.22,1,0.36,1)'
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.transform = 'translateX(0)'
      }, 100)
    }
    if (er) {
      er.style.opacity = '0'
      er.style.transform = 'translateX(30px)'
      er.style.transition = 'all 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s'
      setTimeout(() => {
        er.style.opacity = '1'
        er.style.transform = 'translateX(0)'
      }, 300)
    }
  }, [])

  const scrollToForm = (e) => {
    e.preventDefault()
    document.querySelector('#tax-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden" style={{ paddingTop: 80 }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 80% 50%, rgba(78,161,255,0.14) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 10% 80%, rgba(78,161,255,0.08) 0%, transparent 50%), linear-gradient(160deg, var(--bg-0) 0%, var(--bg-2) 50%, var(--bg-1) 100%)',
        }}
      />
      <div className="absolute inset-0 hero-grid-overlay" />

      <div className="relative z-10 max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center w-full py-12">
        <div ref={leftRef}>
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'var(--accent-soft)', border: '1px solid rgba(78,161,255,0.3)', color: 'var(--accent-2)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--accent-2)' }} />
            USA Business Formation Experts
          </div>

          <h1 className="font-heading font-black mb-6" style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', lineHeight: 1.1, color: 'var(--text-0)' }}>
            File Your <span style={{ color: 'var(--accent-2)' }}>US Taxes</span>
            <br />
            With Complete
            <br />
            Confidence
          </h1>

          <p className="text-base leading-relaxed mb-10 max-w-lg" style={{ color: 'var(--text-2)' }}>
            From LLC registration to EIN filing and tax compliance, we handle every document so you can focus on growing
            your business in the United States.
          </p>

          <div className="flex gap-4 flex-wrap mb-12">
            <a href="#tax-form" onClick={scrollToForm} className="btn-primary">
              Start Filing Now
            </a>
          </div>
        </div>

        <div ref={rightRef} className="relative hidden md:block">
          <div
            className="float-anim absolute -top-4 -right-2 z-10 rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ border: '1px solid var(--line)', boxShadow: '0 8px 20px rgba(0,0,0,0.35)', background: 'var(--surface-1)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(46,160,67,0.2)', color: 'var(--success)' }}>
              OK
            </div>
            <div>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-0)' }}>LLC Approved</div>
              <div className="text-xs" style={{ color: 'var(--text-2)' }}>State of Delaware</div>
            </div>
          </div>

          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{ border: '1px solid var(--line)', boxShadow: '0 12px 30px rgba(0,0,0,0.35)', background: 'var(--bg-2)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg,transparent,var(--accent-2),transparent)' }} />

            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-heading font-bold" style={{ color: 'var(--text-0)' }}>Your Documents</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>Q1 2026 Filing Status</div>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded text-white" style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent-2))' }}>
                Active
              </span>
            </div>

            {docRows.map((row) => (
              <div key={row.name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1.5" style={{ background: 'var(--surface-1)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: 'var(--bg-1)', color: 'var(--text-2)' }}>
                  {row.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-0)' }}>{row.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-2)' }}>{row.sub}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${row.statusClass}`}>{row.status}</span>
              </div>
            ))}

            <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--line)' }}>
              <span className="text-xs" style={{ color: 'var(--text-2)' }}>Completion</span>
              <span className="text-xs font-bold" style={{ color: 'var(--accent-2)' }}>75%</span>
            </div>
            <div className="h-1 rounded-full mt-1.5 overflow-hidden" style={{ background: 'var(--bg-1)' }}>
              <div className="h-full w-3/4 rounded-full" style={{ background: 'linear-gradient(90deg,var(--accent),var(--accent-2))' }} />
            </div>
          </div>

          <div
            className="float-anim-delayed absolute -bottom-3 -left-4 z-10 rounded-xl px-4 py-3"
            style={{ border: '1px solid var(--line)', boxShadow: '0 8px 20px rgba(0,0,0,0.35)', background: 'var(--surface-1)' }}
          >
            <div className="text-xs mb-0.5" style={{ color: 'var(--text-2)' }}>Tax Savings</div>
            <div className="font-heading font-bold text-xl" style={{ color: 'var(--success)' }}>+$12,400</div>
            <div className="text-xs" style={{ color: 'var(--text-2)' }}>This Year</div>
          </div>
        </div>
      </div>
    </section>
  )
}

