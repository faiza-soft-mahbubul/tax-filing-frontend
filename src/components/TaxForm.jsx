import { useState } from 'react'
import useStore from '../store/useStore'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL

const documentFields = [
  {
    key: 'articleDocs',
    label: 'Article of Organization / LLC Documents',
    multiple: false,
    hint: 'Image, PDF, docs, any file format',
  },
  {
    key: 'einLetter',
    label: 'EIN Letter',
    multiple: false,
    hint: 'Image, PDF, docs, any file format',
  },
  {
    key: 'bankStatements',
    label: 'Bank Statements',
    multiple: true,
    hint: 'Multiple files allowed (image, PDF, docs, any format)',
  },
  {
    key: 'ownerAddressProof',
    label: 'Owner Address Proof Document',
    multiple: false,
    hint: 'Image, PDF, docs, any file format',
  },
]

function Field({ label, required = false, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>
        {label}{required && <span style={{ color: '#EF4444' }}> *</span>}
      </label>
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

function TInput({ placeholder, value, onChange, type = 'text' }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={inputStyle}
      onFocus={(e) => { e.target.style.borderBottomColor = '#00BABA' }}
      onBlur={(e) => { e.target.style.borderBottomColor = '#D1D5DB' }}
    />
  )
}

function TSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{ ...inputStyle, cursor: 'pointer' }}
      onFocus={(e) => { e.target.style.borderBottomColor = '#00BABA' }}
      onBlur={(e) => { e.target.style.borderBottomColor = '#D1D5DB' }}
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
      style={{ ...inputStyle, resize: 'vertical', borderBottom: '1px solid #D1D5DB' }}
      onFocus={(e) => { e.target.style.borderBottomColor = '#00BABA' }}
      onBlur={(e) => { e.target.style.borderBottomColor = '#D1D5DB' }}
    />
  )
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))
    reader.readAsDataURL(file)
  })
}

async function prepareFiles(files) {
  const prepared = await Promise.all(
    (files || []).map(async (file) => ({
      originalName: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      base64: await fileToBase64(file),
    }))
  )
  return prepared
}

function openLocalFile(file) {
  const url = URL.createObjectURL(file)
  window.open(url, '_blank', 'noopener,noreferrer')
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

export default function TaxForm() {
  const { form, setFormField, formSubmitted, formLoading, setFormLoading, setFormSubmitted } = useStore()
  const [submitError, setSubmitError] = useState('')
  const [submitResult, setSubmitResult] = useState(null)

  const handleSubmit = async () => {
    setSubmitError('')

    const requiredFields = [
      ['businessName', 'Business Name'],
      ['businessAddress', 'Business Address'],
      ['incDate', 'Incorporation Date'],
      ['ownerName', 'Owner Name'],
      ['ownerAddress', 'Owner Address'],
      ['email', 'Email Address'],
      ['phone', 'WhatsApp Number'],
    ]
    const missingFields = requiredFields
      .filter(([key]) => !String(form[key] || '').trim())
      .map(([, label]) => label)

    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(', ')}`)
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

      const [incYear, incMonth, incDay] = form.incDate ? form.incDate.split('-') : ['', '', '']
      const payload = {
        businessName: form.businessName,
        ein: form.ein,
        businessAddress: form.businessAddress,
        incDate: form.incDate,
        incDay: incDay || '',
        incMonth: incMonth || '',
        incYear: incYear || '',
        businessCode: form.businessCode,
        ownerName: form.ownerName,
        ownerAddress: form.ownerAddress,
        income: form.income,
        expenses: form.expenses,
        cogs: form.cogs,
        llcCost: form.llcCost,
        fyMonth: form.fyMonth,
        fyDay: form.fyDay,
        notes: form.notes,
        email: form.email,
        phone: form.phone,
        agreed: form.agreed,
        articleDocs: await prepareFiles(form.articleDocs),
        einLetter: await prepareFiles(form.einLetter),
        bankStatements: await prepareFiles(form.bankStatements),
        ownerAddressProof: await prepareFiles(form.ownerAddressProof),
      }

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      })
      const result = await response.json().catch(() => ({}))

      if (!response.ok || !result.ok) {
        throw new Error(result.message || `Submission failed. Server returned ${response.status}.`)
      }

      setSubmitResult(result)
      setFormLoading(false)
      setFormSubmitted(true)
    } catch (error) {
      setFormLoading(false)
      setSubmitError(error.message || 'Submission failed. Please try again.')
    }
  }

  const set = (field) => (e) => setFormField(field, e.target.value)
  const setCheck = (field) => (e) => setFormField(field, e.target.checked)
  const addFiles = (field, multiple) => (e) => {
    const selected = Array.from(e.target.files || [])
    const next = multiple ? [...(form[field] || []), ...selected] : selected.slice(0, 1)
    setFormField(field, next)
    e.target.value = ''
  }
  const removeFile = (field, index) => {
    const current = form[field] || []
    setFormField(field, current.filter((_, i) => i !== index))
  }

  const gridRow2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem', marginBottom: '1.4rem' }
  const gridRow3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.4rem', marginBottom: '1.4rem' }
  const divider = { borderTop: '1px solid #E5E7EB', margin: '0.5rem 0 1.4rem' }

  return (
    <section id="tax-form" className="py-24" style={{ background: '#eef9f9', borderTop: '1px solid rgba(0,186,186,0.15)' }}>
      <div className="section-inner">
        <div className="text-center mb-12">
          <div className="section-label justify-center">Tax Filing</div>
          <h2 className="section-title">Submit Your <span>Tax Filing</span> Application</h2>
          <p className="section-sub mx-auto text-center mt-2">
            Fill in your details below and our experts will handle everything from start to finish.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-2xl p-10 relative overflow-hidden"
            style={{ background: '#fff', border: '1px solid #D1FAF0', boxShadow: '0 2px 12px rgba(0,186,186,0.06)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg,transparent,#00BABA,#00D8D8,transparent)' }} />

            {formSubmitted ? (
              <div className="text-center py-8">
                <h3 className="font-heading font-bold text-2xl text-gray-900 mb-3">Application Submitted</h3>
                <p className="text-gray-500 text-sm leading-loose">
                  Your data and documents were sent successfully.
                </p>

                {submitResult?.folderUrl && (
                  <div className="mt-4">
                    <a href={submitResult.folderUrl} target="_blank" rel="noreferrer" style={{ color: '#00BABA', textDecoration: 'underline', fontWeight: 600 }}>
                      Open Google Drive Folder
                    </a>
                  </div>
                )}

                {submitResult?.uploadedFiles && (
                  <div className="mt-5 text-left">
                    {documentFields.map((field) => {
                      const links = submitResult.uploadedFiles[field.key] || []
                      if (links.length === 0) return null
                      return (
                        <div key={field.key} style={{ marginBottom: '0.7rem' }}>
                          <div style={{ fontWeight: 600, color: '#374151', fontSize: '0.85rem' }}>{field.label}</div>
                          {links.map((item) => (
                            <div key={item.id || item.url} style={{ fontSize: '0.82rem' }}>
                              <a href={item.url} target="_blank" rel="noreferrer" style={{ color: '#00BABA', textDecoration: 'underline' }}>
                                {item.name || 'Open file'}
                              </a>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div id="filing-form">
                <div style={gridRow2}>
                  <Field label="Business Name" required>
                    <TInput placeholder="Acme LLC" value={form.businessName} onChange={set('businessName')} />
                  </Field>
                  <Field label="EIN">
                    <TInput placeholder="XX-XXXXXXX" value={form.ein} onChange={set('ein')} />
                  </Field>
                </div>

                <div style={{ marginBottom: '1.4rem' }}>
                  <Field label="Business Address" required>
                    <TInput placeholder="123 Main St, Dover, DE 19901" value={form.businessAddress} onChange={set('businessAddress')} />
                  </Field>
                </div>

                <div style={gridRow2}>
                  <Field label="Incorporation Date" required>
                    <TInput type="date" value={form.incDate} onChange={set('incDate')} />
                  </Field>
                  <Field label="Business Code">
                    <TInput placeholder="e.g. 541510" value={form.businessCode} onChange={set('businessCode')} />
                  </Field>
                </div>

                <div style={{ marginBottom: '1.4rem' }}>
                  <Field label="Owner Name" required>
                    <TInput placeholder="John Doe" value={form.ownerName} onChange={set('ownerName')} />
                  </Field>
                </div>

                <div style={{ marginBottom: '1.4rem' }}>
                  <Field label="Owner Address" required>
                    <TInput placeholder="Owner full address" value={form.ownerAddress} onChange={set('ownerAddress')} />
                  </Field>
                </div>

                <div style={divider} />

                <div style={gridRow3}>
                  <Field label="Total Yearly Income">
                    <TInput placeholder="0.00" value={form.income} onChange={set('income')} />
                  </Field>
                  <Field label="Total Expenses">
                    <TInput placeholder="0.00" value={form.expenses} onChange={set('expenses')} />
                  </Field>
                  <Field label="Cost of Goods Sold">
                    <TInput placeholder="0.00" value={form.cogs} onChange={set('cogs')} />
                  </Field>
                </div>

                <div style={gridRow2}>
                  <Field label="LLC Formation Cost">
                    <TInput placeholder="0.00" value={form.llcCost} onChange={set('llcCost')} />
                  </Field>
                  <Field label="Fiscal Year End">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <TSelect value={form.fyMonth} onChange={set('fyMonth')}>
                        <option value="">Month</option>
                        {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m.slice(0, 3)}</option>)}
                      </TSelect>
                      <TSelect value={form.fyDay} onChange={set('fyDay')}>
                        <option value="">Day</option>
                        {DAYS.map((d) => <option key={d}>{d}</option>)}
                      </TSelect>
                    </div>
                  </Field>
                </div>

                <div style={divider} />

                <div style={{ marginBottom: '1.4rem' }}>
                  <Field label="Additional Notes">
                    <TTextarea
                      placeholder="Any additional information or special circumstances (optional)"
                      value={form.notes}
                      onChange={set('notes')}
                    />
                  </Field>
                </div>

                <div style={{ marginBottom: '1.4rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                    Additional Documents
                  </label>

                  {documentFields.map((field) => {
                    const files = form[field.key] || []
                    return (
                      <div key={field.key} style={{ marginBottom: '0.8rem' }}>
                        <label
                          htmlFor={`upload-${field.key}`}
                          className="flex flex-col items-center gap-2 rounded-xl p-4 text-center cursor-pointer transition-all"
                          style={{ border: '1px dashed rgba(0,186,186,0.35)', background: files.length ? 'rgba(0,186,186,0.03)' : 'transparent' }}
                        >
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>{field.label}</span>
                          <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{field.hint}</span>
                          <span style={{ fontSize: '0.85rem', color: files.length ? '#00BABA' : '#9CA3AF' }}>
                            {files.length ? `${files.length} file(s) selected` : 'Click to upload'}
                          </span>
                          <input
                            id={`upload-${field.key}`}
                            type="file"
                            multiple={field.multiple}
                            className="hidden"
                            onChange={addFiles(field.key, field.multiple)}
                          />
                        </label>

                        {files.length > 0 && (
                          <div style={{ marginTop: '0.5rem' }}>
                            {files.map((file, idx) => (
                              <div key={`${file.name}-${idx}`} className="flex items-center justify-between gap-2" style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                                <span style={{ color: '#374151' }}>{file.name}</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => openLocalFile(file)}
                                    style={{ color: '#00BABA', textDecoration: 'underline', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                  >
                                    View
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(field.key, idx)}
                                    style={{ color: '#EF4444', textDecoration: 'underline', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div style={divider} />

                <div style={gridRow2}>
                  <Field label="Your Email Address" required>
                    <TInput type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} />
                  </Field>
                  <Field label="WhatsApp Number" required>
                    <TInput type="tel" placeholder="+880 1XXX-XXXXXX" value={form.phone} onChange={set('phone')} />
                  </Field>
                </div>

                <div className="flex items-start gap-3 mb-6">
                  <input
                    type="checkbox"
                    id="f-agree"
                    checked={form.agreed}
                    onChange={setCheck('agreed')}
                    style={{ marginTop: 3, accentColor: '#00BABA', width: 15, height: 15, flexShrink: 0, cursor: 'pointer' }}
                  />
                  <label htmlFor="f-agree" style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.6, cursor: 'pointer' }}>
                    I have read and agree to Mas Formation's{' '}
                    <a href="#" style={{ color: '#00BABA', textDecoration: 'underline' }}>Terms of Service</a>{' '}
                    and <a href="#" style={{ color: '#00BABA', textDecoration: 'underline' }}>Privacy Policy</a>.
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
                  {formLoading ? 'Processing...' : 'Submit Tax Filing Application'}
                </button>

                {submitError && (
                  <p className="text-center mt-3" style={{ fontSize: '0.8rem', color: '#EF4444' }}>
                    {submitError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
