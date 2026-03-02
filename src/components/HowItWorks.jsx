import { useEffect, useRef } from 'react'

const steps = [
  {
    num: '01',
    title: 'Choose Your Service',
    desc: 'Select the service that matches your business goals and filing requirements.',
  },
  {
    num: '02',
    title: 'Submit Your Details',
    desc: 'Fill in the form with your business information and upload required documents.',
  },
  {
    num: '03',
    title: 'We Handle Processing',
    desc: 'Our team validates and prepares records for submission and compliance handling.',
  },
  {
    num: '04',
    title: 'Get Confirmation',
    desc: 'Receive your status updates and documents once processing completes.',
  },
]

export default function HowItWorks() {
  const flowRef = useRef(null)
  const trackRef = useRef(null)
  const fillRef = useRef(null)
  const dotRefs = useRef([])
  const cardRefs = useRef([])

  const fixTrackLine = () => {
    const flow = flowRef.current
    const dots = dotRefs.current.filter(Boolean)
    const track = trackRef.current
    if (!flow || dots.length < 2 || !track) return

    const flowRect = flow.getBoundingClientRect()
    const first = dots[0].getBoundingClientRect()
    const last = dots[dots.length - 1].getBoundingClientRect()

    const topOffset = first.top + first.height / 2 - flowRect.top
    const height = last.top + last.height / 2 - (first.top + first.height / 2)

    track.style.top = `${topOffset}px`
    track.style.height = `${height}px`
  }

  const updateFlow = () => {
    const flow = flowRef.current
    const fill = fillRef.current
    if (!flow || !fill) return

    const winH = window.innerHeight
    const flowRect = flow.getBoundingClientRect()

    const scrolled = Math.max(0, Math.min(1, (winH * 0.6 - flowRect.top) / (flowRect.height + winH * 0.2)))
    fill.style.height = `${scrolled * 100}%`

    dotRefs.current.forEach((dot, i) => {
      const card = cardRefs.current[i]
      if (!dot || !card) return
      const dotRect = dot.getBoundingClientRect()
      const dotCenter = dotRect.top + dotRect.height / 2
      const isActive = dotCenter < winH * 0.68

      if (isActive) {
        dot.classList.add('active')
        card.classList.add('active')
      } else {
        dot.classList.remove('active')
        card.classList.remove('active')
      }
    })
  }

  useEffect(() => {
    fixTrackLine()
    updateFlow()
    window.addEventListener('scroll', updateFlow, { passive: true })
    window.addEventListener('resize', fixTrackLine)
    return () => {
      window.removeEventListener('scroll', updateFlow)
      window.removeEventListener('resize', fixTrackLine)
    }
  }, [])

  return (
    <section id="how" className="py-24" style={{ background: 'var(--bg-0)' }}>
      <div className="section-inner">
        <div className="text-center mb-14">
          <div className="section-label justify-center">How It Works</div>
          <h2 className="section-title">
            From Application to
            <br />
            <span>Approval in 4 Steps</span>
          </h2>
          <p className="section-sub mx-auto text-center mt-2">A simple and guided process with full transparency.</p>
        </div>

        <div ref={flowRef} className="max-w-2xl mx-auto relative">
          <div ref={trackRef} className="absolute left-8 w-0.5 rounded-sm overflow-hidden" style={{ background: 'var(--line)', zIndex: 0 }}>
            <div
              ref={fillRef}
              className="absolute top-0 left-0 right-0 rounded-sm"
              style={{
                height: '0%',
                background: 'linear-gradient(180deg,var(--accent),var(--accent-2))',
                transition: 'height 0.1s linear',
              }}
            />
          </div>

          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-6 relative z-10" style={{ marginBottom: i < steps.length - 1 ? '2rem' : 0 }}>
              <div
                ref={(el) => (dotRefs.current[i] = el)}
                className="flow-dot-circle flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-heading font-extrabold text-sm relative"
                style={{ border: '2px solid var(--line)', background: 'var(--bg-2)', color: 'var(--text-2)', zIndex: 2 }}
              >
                {step.num}
              </div>

              <div
                ref={(el) => (cardRefs.current[i] = el)}
                className="flow-step-card flex-1 rounded-2xl p-5 relative overflow-hidden"
                style={{ background: 'var(--bg-2)', border: '1.5px solid var(--line)' }}
              >
                <h3 className="font-heading font-bold text-base mb-1" style={{ color: 'var(--text-0)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

