import useStore from '../store/useStore'

const faqs = [
  {
    q: 'Do I need to be a US citizen to form an LLC?',
    a: 'No. Non-US residents can legally form and own an LLC in the United States without a US visa or SSN.',
  },
  {
    q: 'How long does LLC formation take?',
    a: 'Standard processing usually takes 7 to 14 business days depending on state rules.',
  },
  {
    q: 'What is an EIN and do I need one?',
    a: 'EIN is your business federal tax ID. You need it for banking and tax filing.',
  },
  {
    q: 'How do I pay for your services?',
    a: 'We accept bank transfer, cards, and PayPal based on service scope.',
  },
  {
    q: 'Do I need to file US taxes if I am outside the USA?',
    a: 'It depends on business activity and income source. We help assess your case.',
  },
  {
    q: 'What ongoing compliance is required after forming my LLC?',
    a: 'Most states require annual reports and registered agent maintenance.',
  },
]

export default function FAQ() {
  const { openFaqIndex, setOpenFaqIndex } = useStore()

  return (
    <section id="faq" className="py-24" style={{ background: 'var(--bg-2)' }}>
      <div className="section-inner">
        <div className="text-center mb-14">
          <div className="section-label justify-center">FAQ</div>
          <h2 className="section-title">
            Frequently Asked <span>Questions</span>
          </h2>
          <p className="section-sub mx-auto text-center mt-2">Everything you need to know before filing.</p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {faqs.map((item, i) => {
            const isOpen = openFaqIndex === i
            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: 'var(--bg-1)',
                  border: isOpen ? '1px solid rgba(78,161,255,0.45)' : '1px solid var(--line)',
                }}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors duration-200"
                  style={{ color: isOpen ? 'var(--accent-2)' : 'var(--text-1)', fontWeight: 600, fontSize: '0.95rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  onClick={() => setOpenFaqIndex(i)}
                >
                  <span>{item.q}</span>
                  <span
                    className="text-2xl flex-shrink-0 leading-none transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)', color: 'var(--accent-2)' }}
                  >
                    +
                  </span>
                </button>

                <div
                  className="overflow-hidden transition-all duration-400"
                  style={{
                    maxHeight: isOpen ? 180 : 0,
                    padding: isOpen ? '0 1.5rem 1.25rem' : '0 1.5rem',
                    color: 'var(--text-2)',
                    fontSize: '0.9rem',
                    lineHeight: 1.75,
                    transition: 'max-height 0.4s ease, padding 0.3s ease',
                  }}
                >
                  {item.a}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

