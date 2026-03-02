import useStore from '../store/useStore'

const faqs = [
  {
    q: 'Do I need to be a US citizen to form an LLC?',
    a: 'No! Non-US residents can legally form and own an LLC in the United States. You do not need a US visa, SSN, or even visit the country. We handle the entire process remotely.',
  },
  {
    q: 'How long does LLC formation take?',
    a: 'Standard processing takes 7–14 business days depending on the state. Expedited service can get your LLC approved in as little as 24–48 hours. Delaware and Wyoming are among the fastest states.',
  },
  {
    q: 'What is an EIN and do I need one?',
    a: 'An EIN (Employer Identification Number) is your business\'s federal tax ID — like a Social Security Number for your company. You need it to open a US bank account, hire employees, and file taxes.',
  },
  {
    q: 'How do I pay for your services?',
    a: 'We accept international bank transfers (SWIFT/IBAN), credit/debit cards (Visa, Mastercard), and PayPal. All transactions are secure and encrypted.',
  },
  {
    q: 'Do I need to file US taxes if I\'m not based in the USA?',
    a: 'It depends on your business activity. A foreign-owned single-member LLC with no US-connected income may have minimal filing requirements. We assess your situation and guide you accordingly.',
  },
  {
    q: 'What ongoing compliance is required after forming my LLC?',
    a: 'Most states require an Annual Report and a small filing fee each year. You also need to maintain a registered agent. We offer annual compliance packages to keep everything up to date automatically.',
  },
]

export default function FAQ() {
  const { openFaqIndex, setOpenFaqIndex } = useStore()

  return (
    <section id="faq" className="py-24" style={{ background: '#f8fffe' }}>
      <div className="section-inner">
        <div className="text-center mb-14">
          <div className="section-label justify-center">FAQ</div>
          <h2 className="section-title">
            Frequently Asked <span>Questions</span>
          </h2>
          <p className="section-sub mx-auto text-center mt-2">
            Everything you need to know about forming and filing a US LLC from abroad.
          </p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {faqs.map((item, i) => {
            const isOpen = openFaqIndex === i
            return (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  border: isOpen ? '1px solid rgba(0,186,186,0.3)' : '1px solid #E5E7EB',
                }}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors duration-200 hover:text-teal"
                  style={{ color: isOpen ? '#00BABA' : '#111827', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '0.95rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  onClick={() => setOpenFaqIndex(i)}
                >
                  <span>{item.q}</span>
                  <span
                    className="text-teal text-2xl flex-shrink-0 leading-none transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}
                  >
                    +
                  </span>
                </button>

                <div
                  className="overflow-hidden transition-all duration-400"
                  style={{
                    maxHeight: isOpen ? 200 : 0,
                    padding: isOpen ? '0 1.5rem 1.25rem' : '0 1.5rem',
                    color: '#6B7280',
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
