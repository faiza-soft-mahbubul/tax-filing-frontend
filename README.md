# Mas Formation

Frontend-only landing page. Form + document files are sent to a Google Apps Script Web App URL.

## Run

```bash
pnpm install
pnpm dev
```

App runs at `http://localhost:5173`.

## Env

Set in `.env`:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-web-app-id/exec
```

## Document Upload Flow

The form sends:
- Business information fields
- Four document groups:
  - `articleDocs`
  - `einLetter`
  - `bankStatements` (multiple)
  - `ownerAddressProof`

Each file is sent as:
- `originalName`
- `mimeType`
- `size`
- `base64`

## Apps Script

Use the code from:
- `apps-script/Code.gs`

This script:
1. Creates/uses business-name folder under parent Drive folder `1ajrGrUf1kgn8pvdQU-Pi_RGk-Ow97gwf`
2. Uploads files with clean names
3. Appends row to Google Sheet
4. Returns uploaded file links + folder URL

Deploy as Web App:
- Execute as: `Me`
- Who has access: `Anyone`

Then update `.env` with the deployed `/exec` URL and restart `pnpm dev`.
