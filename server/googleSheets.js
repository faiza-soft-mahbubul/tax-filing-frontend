const { google } = require('googleapis')

const SPREADSHEET_TITLE = process.env.GOOGLE_SHEET_TITLE || 'tax-failling'
const WORKSHEET_TITLE = process.env.GOOGLE_WORKSHEET_TITLE || 'Submissions'

const HEADERS = [
  'submitted_at',
  'business_name',
  'ein',
  'business_address',
  'incorporation_day',
  'incorporation_month',
  'incorporation_year',
  'business_code',
  'owner_name',
  'owner_address',
  'income',
  'expenses',
  'cogs',
  'llc_cost',
  'fiscal_year_month',
  'fiscal_year_day',
  'notes',
  'email',
  'phone',
  'agreed',
  'files',
]

function parseServiceAccountCredentials() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
  }

  if (process.env.GOOGLE_CREDENTIALS_JSON) {
    return JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
  }

  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    return {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }
  }

  return null
}

function createAuthClient(accessToken) {
  if (accessToken) {
    const oauth2 = new google.auth.OAuth2()
    oauth2.setCredentials({ access_token: accessToken })
    return oauth2
  }

  const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
  ]

  const serviceAccount = parseServiceAccountCredentials()
  if (serviceAccount) {
    return new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes,
    })
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.VITE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (clientId && clientSecret && refreshToken) {
    const oauth2 = new google.auth.OAuth2(clientId, clientSecret)
    oauth2.setCredentials({ refresh_token: refreshToken })
    return oauth2
  }

  throw new Error(
    'Google write credentials missing. Use GOOGLE_SERVICE_ACCOUNT_JSON (recommended) or GOOGLE_REFRESH_TOKEN + GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET. VITE_API_KEY/CLIENT_ID/CLIENT_SECRET alone cannot write to Sheets.'
  )
}

async function getGoogleApis(accessToken) {
  const auth = createAuthClient(accessToken)
  const authClient = typeof auth.getClient === 'function' ? await auth.getClient() : auth

  return {
    sheets: google.sheets({ version: 'v4', auth: authClient }),
    drive: google.drive({ version: 'v3', auth: authClient }),
  }
}

async function findSpreadsheetByTitle(drive, title) {
  const query = `name='${title.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`
  const response = await drive.files.list({
    q: query,
    fields: 'files(id,name)',
    pageSize: 1,
    spaces: 'drive',
  })

  return response.data.files?.[0]?.id || null
}

async function createSpreadsheet(sheets, title) {
  const created = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title },
      sheets: [{ properties: { title: WORKSHEET_TITLE } }],
    },
  })

  return created.data.spreadsheetId
}

async function ensureWorksheetExists(sheets, spreadsheetId) {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties.title',
  })

  const hasSheet = (meta.data.sheets || []).some(
    (sheet) => sheet.properties?.title === WORKSHEET_TITLE
  )

  if (!hasSheet) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: WORKSHEET_TITLE } } }],
      },
    })
  }
}

async function ensureHeaderRow(sheets, spreadsheetId) {
  const range = `${WORKSHEET_TITLE}!A1:Z1`
  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range })
  const hasHeader = Boolean(response.data.values?.length)
  if (hasHeader) {
    return
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values: [HEADERS] },
  })
}

function toRow(data) {
  return [
    new Date().toISOString(),
    data.businessName || '',
    data.ein || '',
    data.businessAddress || '',
    data.incDay || '',
    data.incMonth || '',
    data.incYear || '',
    data.businessCode || '',
    data.ownerName || '',
    data.ownerAddress || '',
    data.income || '',
    data.expenses || '',
    data.cogs || '',
    data.llcCost || '',
    data.fyMonth || '',
    data.fyDay || '',
    data.notes || '',
    data.email || '',
    data.phone || '',
    data.agreed ? 'yes' : 'no',
    Array.isArray(data.files)
      ? data.files
          .map((file) => (typeof file === 'string' ? file : file?.name || ''))
          .filter(Boolean)
          .join(', ')
      : '',
  ]
}

async function getOrCreateSpreadsheetId(drive, sheets) {
  if (process.env.GOOGLE_SHEET_ID) {
    return process.env.GOOGLE_SHEET_ID
  }

  const existingId = await findSpreadsheetByTitle(drive, SPREADSHEET_TITLE)
  if (existingId) {
    return existingId
  }

  return createSpreadsheet(sheets, SPREADSHEET_TITLE)
}

async function appendSubmission(data, accessToken) {
  const { drive, sheets } = await getGoogleApis(accessToken)
  const spreadsheetId = await getOrCreateSpreadsheetId(drive, sheets)

  await ensureWorksheetExists(sheets, spreadsheetId)
  await ensureHeaderRow(sheets, spreadsheetId)

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${WORKSHEET_TITLE}!A:Z`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [toRow(data)],
    },
  })

  return {
    spreadsheetId,
    spreadsheetTitle: SPREADSHEET_TITLE,
    worksheetTitle: WORKSHEET_TITLE,
  }
}

module.exports = {
  appendSubmission,
}
