import { useState } from 'react'
import useStore from '../store/useStore'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = Array.from({length:31},(_,i)=>String(i+1).padStart(2,'0'))
const YEARS = Array.from({length:30},(_,i)=>String(2024-i))
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize:'0.82rem', fontWeight:600, color:'#374151' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid #D1D5DB',
  borderRadius: 0,
  padding: '0.6rem 0',
  color: '#111827',
  fontFamily: 'Poppins, sans-serif',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.2s',
}

function TInput({ placeholder, value, onChange, type='text' }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={inputStyle}
      onFocus={e => e.target.style.borderBottomColor='#00BABA'}
      onBlur={e => e.target.style.borderBottomColor='#D1D5DB'}
    />
  )
}

function TSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{ ...inputStyle, cursor:'pointer' }}
      onFocus={e => e.target.style.borderBottomColor='#00BABA'}
      onBlur={e => e.target.style.borderBottomColor='#D1D5DB'}
    >
      {children}
    </select>
  )
}

function TTextarea({ placeholder, value, onChange }) {
  return (
    <textarea
      rows={3}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{ ...inputStyle, resize:'vertical', borderBottom:'1px solid #D1D5DB' }}
      onFocus={e => e.target.style.borderBottomColor='#00BABA'}
      onBlur={e => e.target.style.borderBottomColor='#D1D5DB'}
    />
  )
}

export default function TaxForm() {
  const { form, setFormField, formSubmitted, formLoading, setFormLoading, setFormSubmitted } = useStore()
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async () => {
    setSubmitError('')

    if (!form.email || !form.phone) {
      alert('Please fill in your Email Address and WhatsApp Number.')
      return
    }
    if (!form.agreed) {
      alert('Please agree to the Terms of Service to continue.')
      return
    }

    setFormLoading(true)
    try {
      if (!APPS_SCRIPT_URL) {
        throw new Error('VITE_APPS_SCRIPT_URL is missing in .env')
      }

      const payload = {
        ...form,
        files: (form.files || []).map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
      }

      // Apps Script web app works best with a simple request (no preflight).
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      })

      if (response.type !== 'opaque' && !response.ok) {
        throw new Error(`Submission failed. Server returned ${response.status}.`)
      }

      setFormLoading(false)
      setFormSubmitted(true)
    } catch (error) {
      setFormLoading(false)
      setSubmitError(error.message || 'Submission failed. Please try again.')
    }
  }

  const set = (field) => (e) => setFormField(field, e.target.value)
  const setCheck = (field) => (e) => setFormField(field, e.target.checked)

  const gridRow2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.4rem', marginBottom:'1.4rem' }
  const gridRow3 = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1.4rem', marginBottom:'1.4rem' }
  const divider = { borderTop:'1px solid #E5E7EB', margin:'0.5rem 0 1.4rem' }

  return (
    <section id="tax-form" className="py-24" style={{ background:'#eef9f9', borderTop:'1px solid rgba(0,186,186,0.15)' }}>
      <div className="section-inner">
        <div className="text-center mb-12">
          <div className="section-label justify-center">Tax Filing</div>
          <h2 className="section-title">Submit Your <span>Tax Filing</span> Application</h2>
          <p className="section-sub mx-auto text-center mt-2">
            Fill in your details below and our experts will handle everything from start to finish.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Card */}
          <div className="rounded-2xl p-10 relative overflow-hidden"
            style={{ background:'#fff', border:'1px solid #D1FAF0', boxShadow:'0 2px 12px rgba(0,186,186,0.06)' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background:'linear-gradient(90deg,transparent,#00BABA,#00D8D8,transparent)' }} />

            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="font-heading font-bold text-2xl text-gray-900 mb-3">Application Submitted!</h3>
                <p className="text-gray-500 text-sm leading-loose">
                  We've received your tax filing application.<br />
                  Our team will review it and contact you within 24 hours.
                </p>
                <div className="mt-6 px-6 py-3 rounded-xl text-sm font-semibold inline-block" style={{ background:'rgba(0,186,186,0.08)', color:'#00BABA' }}>
                  ✅ Confirmation sent to {form.email}
                </div>
              </div>
            ) : (
              <div id="filing-form">
                {/* Row 1: Business Name + EIN */}
                <div style={gridRow2}>
                  <Field label="Business Name *"><TInput placeholder="Acme LLC" value={form.businessName} onChange={set('businessName')} /></Field>
                  <Field label="EIN # (if available)"><TInput placeholder="XX-XXXXXXX" value={form.ein} onChange={set('ein')} /></Field>
                </div>

                {/* Row: Business Address */}
                <div style={{ marginBottom:'1.4rem' }}>
                  <Field label="Business Address *"><TInput placeholder="123 Main St, Dover, DE 19901" value={form.businessAddress} onChange={set('businessAddress')} /></Field>
                </div>

                {/* Row: Inc Date + Business Code */}
                <div style={gridRow2}>
                  <Field label="Incorporation Date *">
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.5rem' }}>
                      <TSelect value={form.incDay} onChange={set('incDay')}>
                        <option value="">Day</option>
                        {DAYS.map(d=><option key={d}>{d}</option>)}
                      </TSelect>
                      <TSelect value={form.incMonth} onChange={set('incMonth')}>
                        <option value="">Month</option>
                        {MONTHS.map((m,i)=><option key={m} value={i+1}>{m.slice(0,3)}</option>)}
                      </TSelect>
                      <TSelect value={form.incYear} onChange={set('incYear')}>
                        <option value="">Year</option>
                        {YEARS.map(y=><option key={y}>{y}</option>)}
                      </TSelect>
                    </div>
                  </Field>
                  <Field label="Business Code"><TInput placeholder="e.g. 541510" value={form.businessCode} onChange={set('businessCode')} /></Field>
                </div>

                {/* Row: Owner Name + Owner Address */}
                <div style={gridRow2}>
                  <Field label="Owner Name *"><TInput placeholder="John Doe" value={form.ownerName} onChange={set('ownerName')} /></Field>
                  <Field label="Owner Address *"><TInput placeholder="Your home address" value={form.ownerAddress} onChange={set('ownerAddress')} /></Field>
                </div>

                <div style={divider} />

                {/* Row: Income, Expenses, COGS */}
                <div style={gridRow3}>
                  <Field label="Total Yearly Income ($)"><TInput placeholder="0.00" value={form.income} onChange={set('income')} /></Field>
                  <Field label="Total Expenses ($)"><TInput placeholder="0.00" value={form.expenses} onChange={set('expenses')} /></Field>
                  <Field label="Cost of Goods Sold ($)"><TInput placeholder="0.00" value={form.cogs} onChange={set('cogs')} /></Field>
                </div>

                {/* Row: LLC Cost + Fiscal Year End */}
                <div style={gridRow2}>
                  <Field label="LLC Formation Cost ($)"><TInput placeholder="0.00" value={form.llcCost} onChange={set('llcCost')} /></Field>
                  <Field label="Fiscal Year End">
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                      <TSelect value={form.fyMonth} onChange={set('fyMonth')}>
                        <option value="">Month</option>
                        {MONTHS.map((m,i)=><option key={m} value={i+1}>{m.slice(0,3)}</option>)}
                      </TSelect>
                      <TSelect value={form.fyDay} onChange={set('fyDay')}>
                        <option value="">Day</option>
                        {DAYS.map(d=><option key={d}>{d}</option>)}
                      </TSelect>
                    </div>
                  </Field>
                </div>

                <div style={divider} />

                {/* Notes */}
                <div style={{ marginBottom:'1.4rem' }}>
                  <Field label="Additional Notes">
                    <TTextarea placeholder="Any additional information, special circumstances, or questions..." value={form.notes} onChange={set('notes')} />
                  </Field>
                </div>

                {/* Upload */}
                <div style={{ marginBottom:'1.4rem' }}>
                  <label style={{ fontSize:'0.82rem', fontWeight:600, color:'#374151', display:'block', marginBottom:'0.5rem' }}>
                    Supporting Documents
                  </label>
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center gap-2 rounded-xl p-6 text-center cursor-pointer transition-all"
                    style={{ border:'1px dashed rgba(0,186,186,0.35)', background: form.files?.length ? 'rgba(0,186,186,0.03)' : 'transparent' }}
                  >
                    <span className="text-2xl text-teal">☁️</span>
                    <span id="upload-label" style={{ fontSize:'0.88rem', color: form.files?.length ? '#00BABA' : '#9CA3AF' }}>
                      {form.files?.length ? `${form.files.length} file(s) selected` : 'Upload financial docs, bank statements, receipts…'}
                    </span>
                    <span style={{ fontSize:'0.75rem', color:'#9CA3AF' }}>PDF, JPG, PNG up to 10MB</span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={e => setFormField('files', Array.from(e.target.files))}
                    />
                  </label>
                </div>

                <div style={divider} />

                {/* Contact */}
                <div style={gridRow2}>
                  <Field label="Your Email Address *"><TInput type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} /></Field>
                  <Field label="WhatsApp Number *"><TInput type="tel" placeholder="+880 1XXX-XXXXXX" value={form.phone} onChange={set('phone')} /></Field>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 mb-6">
                  <input
                    type="checkbox"
                    id="f-agree"
                    checked={form.agreed}
                    onChange={setCheck('agreed')}
                    style={{ marginTop:3, accentColor:'#00BABA', width:15, height:15, flexShrink:0, cursor:'pointer' }}
                  />
                  <label htmlFor="f-agree" style={{ fontSize:'0.82rem', color:'#6B7280', lineHeight:1.6, cursor:'pointer' }}>
                    I have read and agree to Mas Formation's{' '}
                    <a href="#" style={{ color:'#00BABA', textDecoration:'underline' }}>Terms of Service</a>{' '}
                    and <a href="#" style={{ color:'#00BABA', textDecoration:'underline' }}>Privacy Policy</a>.
                  </label>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={formLoading}
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg,#00BABA,#00D8D8)',
                    color: '#fff',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.97rem',
                    border: 'none',
                    cursor: formLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 10px rgba(0,186,186,0.15)',
                    opacity: formLoading ? 0.8 : 1,
                  }}
                >
                  {formLoading ? '⏳ Processing...' : '📋 Submit Tax Filing Application →'}
                </button>

                <p className="text-center mt-3" style={{ fontSize:'0.76rem', color:'#9CA3AF' }}>
                  🔒 Your information is fully secure. No spam, ever.
                </p>
                {submitError && (
                  <p className="text-center mt-3" style={{ fontSize:'0.8rem', color:'#EF4444' }}>
                    {submitError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex justify-center gap-10 mt-6 flex-wrap">
            {['Free Consultation', '24hr Response Time', 'Expert Support'].map(t => (
              <div key={t} className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="text-teal font-bold">✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
