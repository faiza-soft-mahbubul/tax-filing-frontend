# Mas Formation

Frontend-only landing page. Form data is sent directly to a Google Apps Script Web App URL.

## Run

```bash
pnpm install
pnpm dev
```

App runs on `http://localhost:5173`.

## Env

Create `.env` with:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-web-app-id/exec
```

## Google Apps Script (required)

Create a new Apps Script project and deploy as **Web app**:
- Execute as: `Me`
- Who has access: `Anyone`

Use this sample `Code.gs`:

```javascript
function doPost(e) {
  var payload = JSON.parse(e.postData.contents || '{}');
  var spreadsheetId = 'YOUR_SHEET_ID';
  var sheetName = 'Submissions';

  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sh = ss.getSheetByName(sheetName);
  if (!sh) sh = ss.insertSheet(sheetName);

  if (sh.getLastRow() === 0) {
    sh.appendRow([
      'submitted_at', 'business_name', 'ein', 'business_address', 'inc_day',
      'inc_month', 'inc_year', 'business_code', 'owner_name', 'owner_address',
      'income', 'expenses', 'cogs', 'llc_cost', 'fy_month', 'fy_day',
      'notes', 'email', 'phone', 'agreed', 'files'
    ]);
  }

  sh.appendRow([
    new Date(),
    payload.businessName || '',
    payload.ein || '',
    payload.businessAddress || '',
    payload.incDay || '',
    payload.incMonth || '',
    payload.incYear || '',
    payload.businessCode || '',
    payload.ownerName || '',
    payload.ownerAddress || '',
    payload.income || '',
    payload.expenses || '',
    payload.cogs || '',
    payload.llcCost || '',
    payload.fyMonth || '',
    payload.fyDay || '',
    payload.notes || '',
    payload.email || '',
    payload.phone || '',
    payload.agreed ? 'yes' : 'no',
    (payload.files || []).map(function (f) { return f.name || ''; }).join(', ')
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```
