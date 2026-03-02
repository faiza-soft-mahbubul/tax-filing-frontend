import { useEffect, useRef } from 'react'

const steps = [
  { num: '01', badge: 'Step 1', emoji: '📋', title: 'Choose Your Service', desc: 'Select the service that matches your business goals. Book a free consultation if you need guidance before getting started.' },
  { num: '02', badge: 'Step 2', emoji: '✏️', title: 'Submit Your Details', desc: 'Fill out our simple online form with your business information. Takes less than 10 minutes to complete.' },
  { num: '03', badge: 'Step 3', emoji: '⚙️', title: 'We Handle Everything', desc: 'Our expert team files all documents with the state and IRS on your behalf. We keep you updated at every stage.' },
  { num: '04', badge: 'Step 4', emoji: '🎉', title: 'Receive Your Documents', desc: 'Get your LLC certificate, EIN letter, and all official documents delivered digitally to your email. You\'re all set!' },
]

export default function HowItWorks() {
  const flowRef = useRef(null)
  const trackRef = useRef(null)
  const fillRef = useRef(null)
  const dotRefs = useRef([])
  const cardRefs = useRef([])

  // Fix track line: top = center of first dot, height = distance to center of last dot
  const fixTrackLine = () => {
    const flow = flowRef.current
    const dots = dotRefs.current.filter(Boolean)
    const track = trackRef.current
    if (!flow || dots.length < 2 || !track) return

    const flowRect = flow.getBoundingClientRect()
    const first = dots[0].getBoundingClientRect()
    const last = dots[dots.length - 1].getBoundingClientRect()

    const topOffset = first.top + first.height / 2 - flowRect.top
    const height = (last.top + last.height / 2) - (first.top + first.height / 2)

    track.style.top = `${topOffset}px`
    track.style.height = `${height}px`
  }

  // Scroll-driven bidirectional animation
  const updateFlow = () => {
    const flow = flowRef.current
    const fill = fillRef.current
    if (!flow || !fill) return

    const winH = window.innerHeight
    const flowRect = flow.getBoundingClientRect()

    // Progress 0→1 as section scrolls through viewport
    const scrolled = Math.max(0, Math.min(1,
      (winH * 0.6 - flowRect.top) / (flowRect.height + winH * 0.2)
    ))
    fill.style.height = `${scrolled * 100}%`

    // Activate / deactivate each step card and dot
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
    <section id="how" className="py-24 bg-white">
      <div className="section-inner">
        <div className="text-center mb-14">
          <div className="section-label justify-center">How It Works</div>
          <h2 className="section-title">
            From Application to<br /><span>Approval in 4 Steps</span>
          </h2>
          <p className="section-sub mx-auto text-center mt-2">
            A simple, guided process — we handle the complexity so you don't have to.
          </p>
        </div>

        {/* Flow container */}
        <div ref={flowRef} className="max-w-2xl mx-auto relative">
          {/* Vertical track */}
          <div
            ref={trackRef}
            className="absolute left-8 w-0.5 rounded-sm overflow-hidden"
            style={{ background: '#e5f0f0', zIndex: 0 }}
          >
            <div
              ref={fillRef}
              className="absolute top-0 left-0 right-0 rounded-sm"
              style={{
                height: '0%',
                background: 'linear-gradient(180deg,#00BABA,#00D8D8)',
                transition: 'height 0.1s linear',
              }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="flex items-start gap-6 relative z-10"
              style={{ marginBottom: i < steps.length - 1 ? '2rem' : 0 }}
            >
              {/* Dot */}
              <div
                ref={(el) => (dotRefs.current[i] = el)}
                className="flow-dot-circle flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-heading font-extrabold text-sm relative"
                style={{
                  border: '2px solid #d1eeee',
                  background: '#f8fffe',
                  color: '#aacfcf',
                  zIndex: 2,
                }}
              >
                {step.num}
              </div>

              {/* Card */}
              <div
                ref={(el) => (cardRefs.current[i] = el)}
                className="flow-step-card flex-1 rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: '#f9fefe',
                  border: '1.5px solid #e5f0f0',
                  marginTop: 10,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                    style={{ background: 'rgba(0,186,186,0.1)', color: '#00BABA' }}
                  >
                    {step.badge}
                  </span>
                  <span className="text-base">{step.emoji}</span>
                </div>
                <h3 className="font-heading font-bold text-gray-900 text-base mb-1">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
