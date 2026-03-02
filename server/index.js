const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const { appendSubmission } = require('./googleSheets')

dotenv.config()

const app = express()
const port = Number(process.env.SERVER_PORT || 8787)

app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/tax-filing', async (req, res) => {
  try {
    const payload = req.body || {}

    if (!payload.email || !payload.phone) {
      return res.status(400).json({
        ok: false,
        message: 'Email and phone are required.',
      })
    }

    if (!payload.agreed) {
      return res.status(400).json({
        ok: false,
        message: 'Terms agreement is required.',
      })
    }

    const result = await appendSubmission(payload)
    return res.json({
      ok: true,
      spreadsheetId: result.spreadsheetId,
      spreadsheetTitle: result.spreadsheetTitle,
      worksheetTitle: result.worksheetTitle,
    })
  } catch (error) {
    console.error('Tax filing submit failed:', error)
    return res.status(500).json({
      ok: false,
      message:
        error?.message ||
        'Failed to save data to Google Sheets. Check your Google credential environment variables.',
    })
  }
})

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
