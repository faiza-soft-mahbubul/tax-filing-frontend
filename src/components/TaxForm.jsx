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
      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-1)' }}>
        {label}
        {required && <span style={{ color: 'var(--danger)' }}> *</span>}
      </label>
      {children}
    </div>
  )
}

function ErrorText({ message }) {
  if (!message) return null
  return <span style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{message}</span>
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div
      className="rounded-xl p-5 md:p-6"
      style={{
        background: 'var(--bg-1)',
        border: '1px solid var(--line)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      <div className="mb-4">
        <h3 className="font-heading font-bold text-base" style={{ color: 'var(--text-0)' }}>
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-xs" style={{ color: 'var(--text-2)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}

const inputStyle = {
  background: 'var(--surface-1)',
  border: '1px solid var(--line)',
  borderRadius: '10px',
  padding: '0.72rem 0.85rem',
  color: 'var(--text-0)',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
}

function onFieldFocus(e) {
  e.target.style.borderColor = 'var(--accent-2)'
  e.target.style.boxShadow = '0 0 0 3px rgba(var(--accent-2-rgb),0.18)'
}

function onFieldBlur(e) {
  e.target.style.borderColor = 'var(--line)'
  e.target.style.boxShadow = 'none'
}

function TInput({ placeholder, value, onChange, type = 'text' }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={inputStyle}
      onFocus={onFieldFocus}
      onBlur={onFieldBlur}
    />
  )
}

function TSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{ ...inputStyle, cursor: 'pointer', color: value ? 'var(--text-0)' : 'var(--text-2)' }}
      onFocus={onFieldFocus}
      onBlur={onFieldBlur}
    >
      {children}
    </select>
  )
}

function TTextarea({ placeholder, value, onChange }) {
  return (
    <textarea
      rows={4}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{ ...inputStyle, resize: 'vertical', minHeight: 110 }}
      onFocus={onFieldFocus}
      onBlur={onFieldBlur}
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
  const [fieldErrors, setFieldErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    const trimmedBusinessName = String(form.businessName || '').trim()
    const trimmedBusinessAddress = String(form.businessAddress || '').trim()
    const trimmedOwnerName = String(form.ownerName || '').trim()
    const trimmedOwnerAddress = String(form.ownerAddress || '').trim()
    const trimmedEin = String(form.ein || '').trim()
    const trimmedBusinessCode = String(form.businessCode || '').trim()
    const trimmedNotes = String(form.notes || '').trim()

    if (!trimmedBusinessName) {
      errors.businessName = 'Business Name is required.'
    } else if (trimmedBusinessName.length < 2) {
      errors.businessName = 'Business Name must be at least 2 characters.'
    }

    if (!trimmedBusinessAddress) {
      errors.businessAddress = 'Business Address is required.'
    } else if (trimmedBusinessAddress.length < 8) {
      errors.businessAddress = 'Business Address looks too short.'
    }

    if (!String(form.incDate || '').trim()) {
      errors.incDate = 'Incorporation Date is required.'
    } else {
      const picked = new Date(form.incDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (Number.isNaN(picked.getTime())) {
        errors.incDate = 'Please select a valid date.'
      } else if (picked > today) {
        errors.incDate = 'Incorporation Date cannot be in the future.'
      }
    }

    if (!trimmedOwnerName) {
      errors.ownerName = 'Owner Name is required.'
    } else if (trimmedOwnerName.length < 2) {
      errors.ownerName = 'Owner Name must be at least 2 characters.'
    }

    if (!trimmedOwnerAddress) {
      errors.ownerAddress = 'Owner Address is required.'
    } else if (trimmedOwnerAddress.length < 8) {
      errors.ownerAddress = 'Owner Address looks too short.'
    }

    const email = String(form.email || '').trim()
    if (!email) {
      errors.email = 'Email Address is required.'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = 'Please enter a valid email address.'
    }

    const phone = String(form.phone || '').trim()
    const digitsOnly = phone.replace(/\D/g, '')
    if (!phone) {
      errors.phone = 'WhatsApp Number is required.'
    } else if (!/^[\d+\-()\s]+$/.test(phone)) {
      errors.phone = 'Phone contains invalid characters.'
    } else if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      errors.phone = 'Please enter a valid WhatsApp number.'
    }

    if (trimmedEin && !/^\d{2}-?\d{7}$/.test(trimmedEin)) {
      errors.ein = 'EIN must be 9 digits (example: 12-3456789).'
    }

    if (trimmedBusinessCode && !/^[A-Za-z0-9-]{2,10}$/.test(trimmedBusinessCode)) {
      errors.businessCode = 'Business Code must be 2-10 letters/numbers.'
    }

    const currencyFields = [
      ['income', 'Total Yearly Income'],
      ['expenses', 'Total Expenses'],
      ['cogs', 'Cost of Goods Sold'],
      ['llcCost', 'LLC Formation Cost'],
    ]

    currencyFields.forEach(([key, label]) => {
      const raw = String(form[key] || '').trim()
      if (!raw) return
      if (!/^\d+(\.\d{1,2})?$/.test(raw)) {
        errors[key] = `${label} must be a valid amount.`
        return
      }
      if (Number(raw) < 0) {
        errors[key] = `${label} cannot be negative.`
      }
    })

    if (form.fyMonth && !form.fyDay) errors.fyDay = 'Please select Fiscal Year End day.'
    if (form.fyDay && !form.fyMonth) errors.fyMonth = 'Please select Fiscal Year End month.'
    if (form.fyMonth && form.fyDay) {
      const month = Number(form.fyMonth)
      const day = Number(form.fyDay)
      const maxDay = new Date(2024, month, 0).getDate()
      if (day > maxDay) {
        errors.fyDay = `Selected month supports up to ${maxDay} days.`
      }
    }

    if (trimmedNotes.length > 1000) {
      errors.notes = 'Additional Notes cannot exceed 1000 characters.'
    }

    if (!form.agreed) {
      errors.agreed = 'You must agree to the Terms of Service and Privacy Policy.'
    }

    return errors
  }

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleSubmit = async () => {
    setSubmitError('')
    setFieldErrors({})

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFormLoading(true)
    try {
      if (!APPS_SCRIPT_URL) {
        throw new Error('VITE_APPS_SCRIPT_URL is missing in .env')
      }

      const [incYear, incMonth, incDay] = form.incDate ? form.incDate.split('-') : ['', '', '']
      const payload = {
        businessName: String(form.businessName || '').trim(),
        ein: String(form.ein || '').trim(),
        businessAddress: String(form.businessAddress || '').trim(),
        incDate: form.incDate,
        incDay: incDay || '',
        incMonth: incMonth || '',
        incYear: incYear || '',
        businessCode: String(form.businessCode || '').trim(),
        ownerName: String(form.ownerName || '').trim(),
        ownerAddress: String(form.ownerAddress || '').trim(),
        income: String(form.income || '').trim(),
        expenses: String(form.expenses || '').trim(),
        cogs: String(form.cogs || '').trim(),
        llcCost: String(form.llcCost || '').trim(),
        fyMonth: form.fyMonth,
        fyDay: form.fyDay,
        notes: String(form.notes || '').trim(),
        email: String(form.email || '').trim(),
        phone: String(form.phone || '').trim(),
        agreed: form.agreed,
        articleDocs: await prepareFiles(form.articleDocs),
        einLetter: await prepareFiles(form.einLetter),
        bankStatements: await prepareFiles(form.bankStatements),
        ownerAddressProof: await prepareFiles(form.ownerAddressProof),
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000)

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const raw = await response.text()
      let result = {}
      if (raw) {
        try {
          result = JSON.parse(raw)
        } catch {
          result = { message: raw }
        }
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.message || `Submission failed. Server returned ${response.status}.`)
      }

      setFormSubmitted(true)
    } catch (error) {
      if (error.name === 'AbortError') {
        setSubmitError('Request timed out. Please try again.')
      } else {
        setSubmitError(error.message || 'Submission failed. Please try again.')
      }
    } finally {
      setFormLoading(false)
    }
  }

  const set = (field) => (e) => {
    setFormField(field, e.target.value)
    clearFieldError(field)
    if (field === 'fyMonth') clearFieldError('fyDay')
    if (field === 'fyDay') clearFieldError('fyMonth')
  }

  const setCheck = (field) => (e) => {
    setFormField(field, e.target.checked)
    clearFieldError(field)
  }

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

  return (
    <section id="tax-form" className="py-24" style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--line)' }}>
      <div className="section-inner">
        <div className="text-center mb-12">
          <div className="section-label justify-center">Tax Filing</div>
          <h2 className="section-title">
            Submit Your <span>Tax Filing</span> Application
          </h2>
          <p className="section-sub mx-auto text-center mt-2">
            Fill in your details below and our experts will handle everything from start to finish.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', boxShadow: '0 14px 30px rgba(0,0,0,0.22)' }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: 'linear-gradient(90deg,var(--accent),var(--accent-2),var(--accent))' }}
            />

            {formSubmitted ? (
              <div className="text-center py-10">
                <div
                  className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-2)', color: 'var(--accent-2)', fontWeight: 700 }}
                >
                  OK
                </div>
                <h3 className="font-heading font-bold text-2xl mb-3" style={{ color: 'var(--text-0)' }}>
                  Application Submitted
                </h3>
                <p className="text-sm leading-loose" style={{ color: 'var(--text-2)' }}>
                  Your application was submitted successfully.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="mt-5 px-5 py-2 rounded-lg font-semibold"
                  style={{ background: 'var(--surface-1)', color: 'var(--text-1)', border: '1px solid var(--line)' }}
                >
                  Back to Form
                </button>
              </div>
            ) : (
              <div id="filing-form" className="space-y-5">
                <SectionCard title="Business Information" subtitle="Core company and owner details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <Field label="Business Name" required>
                      <TInput placeholder="Acme LLC" value={form.businessName} onChange={set('businessName')} />
                      <ErrorText message={fieldErrors.businessName} />
                    </Field>
                    <Field label="EIN">
                      <TInput placeholder="12-3456789" value={form.ein} onChange={set('ein')} />
                      <ErrorText message={fieldErrors.ein} />
                    </Field>
                  </div>

                  <div className="mb-5">
                    <Field label="Business Address" required>
                      <TInput placeholder="123 Main St, Dover, DE 19901" value={form.businessAddress} onChange={set('businessAddress')} />
                      <ErrorText message={fieldErrors.businessAddress} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <Field label="Incorporation Date" required>
                      <TInput type="date" value={form.incDate} onChange={set('incDate')} />
                      <ErrorText message={fieldErrors.incDate} />
                    </Field>
                    <Field label="Business Code">
                      <TInput placeholder="e.g. 541510" value={form.businessCode} onChange={set('businessCode')} />
                      <ErrorText message={fieldErrors.businessCode} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Owner Name" required>
                      <TInput placeholder="John Doe" value={form.ownerName} onChange={set('ownerName')} />
                      <ErrorText message={fieldErrors.ownerName} />
                    </Field>
                    <Field label="Owner Address" required>
                      <TInput placeholder="Owner full address" value={form.ownerAddress} onChange={set('ownerAddress')} />
                      <ErrorText message={fieldErrors.ownerAddress} />
                    </Field>
                  </div>
                </SectionCard>

                <SectionCard title="Financial Information" subtitle="Optional values for your filing profile">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    <Field label="Total Yearly Income">
                      <TInput placeholder="0.00" value={form.income} onChange={set('income')} />
                      <ErrorText message={fieldErrors.income} />
                    </Field>
                    <Field label="Total Expenses">
                      <TInput placeholder="0.00" value={form.expenses} onChange={set('expenses')} />
                      <ErrorText message={fieldErrors.expenses} />
                    </Field>
                    <Field label="Cost of Goods Sold">
                      <TInput placeholder="0.00" value={form.cogs} onChange={set('cogs')} />
                      <ErrorText message={fieldErrors.cogs} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <Field label="LLC Formation Cost">
                      <TInput placeholder="0.00" value={form.llcCost} onChange={set('llcCost')} />
                      <ErrorText message={fieldErrors.llcCost} />
                    </Field>
                    <Field label="Fiscal Year End">
                      <div className="grid grid-cols-2 gap-3">
                        <TSelect value={form.fyMonth} onChange={set('fyMonth')}>
                          <option value="">Month</option>
                          {MONTHS.map((m, i) => (
                            <option key={m} value={i + 1}>
                              {m.slice(0, 3)}
                            </option>
                          ))}
                        </TSelect>
                        <TSelect value={form.fyDay} onChange={set('fyDay')}>
                          <option value="">Day</option>
                          {DAYS.map((d) => (
                            <option key={d}>{d}</option>
                          ))}
                        </TSelect>
                      </div>
                      <ErrorText message={fieldErrors.fyMonth || fieldErrors.fyDay} />
                    </Field>
                  </div>

                  <Field label="Additional Notes">
                    <TTextarea
                      placeholder="Any additional information or special circumstances (optional)"
                      value={form.notes}
                      onChange={set('notes')}
                    />
                    <ErrorText message={fieldErrors.notes} />
                  </Field>
                </SectionCard>

                <SectionCard title="Additional Documents" subtitle="Upload any supporting documents (files can be replaced anytime)">
                  <div className="space-y-3">
                    {documentFields.map((field) => {
                      const files = form[field.key] || []
                      return (
                        <div key={field.key} className="rounded-xl p-4" style={{ border: '1px dashed var(--line)', background: 'var(--surface-1)' }}>
                          <label htmlFor={`upload-${field.key}`} className="cursor-pointer block text-center">
                            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-1)' }}>
                              {field.label}
                            </div>
                            <div className="text-xs mb-2" style={{ color: 'var(--text-2)' }}>
                              {field.hint}
                            </div>
                            <div
                              className="inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold"
                              style={{
                                color: files.length ? 'var(--accent-2)' : 'var(--text-2)',
                                background: files.length ? 'var(--accent-soft)' : 'transparent',
                                border: '1px solid var(--line)',
                              }}
                            >
                              {files.length ? `${files.length} file(s) selected` : 'Click to upload'}
                            </div>
                          </label>

                          <input
                            id={`upload-${field.key}`}
                            type="file"
                            multiple={field.multiple}
                            className="hidden"
                            onChange={addFiles(field.key, field.multiple)}
                          />

                          {files.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {files.map((file, idx) => (
                                <div
                                  key={`${file.name}-${idx}`}
                                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-2"
                                  style={{ background: 'var(--bg-2)', border: '1px solid var(--line)' }}
                                >
                                  <span className="text-xs md:text-sm truncate" style={{ color: 'var(--text-1)' }}>
                                    {file.name}
                                  </span>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => openLocalFile(file)}
                                      style={{ color: 'var(--accent-2)', textDecoration: 'underline', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                      View
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeFile(field.key, idx)}
                                      style={{ color: 'var(--danger)', textDecoration: 'underline', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
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
                </SectionCard>

                <SectionCard title="Contact & Confirmation" subtitle="Where we can reach you for updates">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <Field label="Your Email Address" required>
                      <TInput type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} />
                      <ErrorText message={fieldErrors.email} />
                    </Field>
                    <Field label="WhatsApp Number" required>
                      <TInput type="tel" placeholder="+880 1XXX-XXXXXX" value={form.phone} onChange={set('phone')} />
                      <ErrorText message={fieldErrors.phone} />
                    </Field>
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="f-agree"
                      checked={form.agreed}
                      onChange={setCheck('agreed')}
                      style={{ marginTop: 3, accentColor: 'var(--accent-2)', width: 15, height: 15, flexShrink: 0, cursor: 'pointer' }}
                    />
                    <label htmlFor="f-agree" style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6, cursor: 'pointer' }}>
                      I have read and agree to Mas Formation's{' '}
                      <a href="#" style={{ color: 'var(--accent-2)', textDecoration: 'underline' }}>Terms of Service</a>{' '}
                      and <a href="#" style={{ color: 'var(--accent-2)', textDecoration: 'underline' }}>Privacy Policy</a>.
                    </label>
                  </div>

                  {fieldErrors.agreed && (
                    <p className="mb-4" style={{ fontSize: '0.78rem', color: 'var(--danger)' }}>
                      {fieldErrors.agreed}
                    </p>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={formLoading}
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg,var(--accent),var(--accent-2))',
                      color: '#fff',
                      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                      fontSize: '0.97rem',
                      border: 'none',
                      cursor: formLoading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 8px 20px rgba(var(--accent-rgb),0.32)',
                      opacity: formLoading ? 0.8 : 1,
                    }}
                  >
                    {formLoading ? (
                      <>
                        <span className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Submitting, please wait...
                      </>
                    ) : (
                      'Submit Tax Filing Application'
                    )}
                  </button>

                  {submitError && (
                    <p className="text-center mt-3" style={{ fontSize: '0.82rem', color: 'var(--danger)' }}>
                      {submitError}
                    </p>
                  )}
                </SectionCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
