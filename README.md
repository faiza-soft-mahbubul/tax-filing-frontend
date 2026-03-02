# Mas Formation

Landing page with a tax filing form. On submit, data is sent to a backend API and appended to Google Sheets.

## Tech stack

- React + Vite + Tailwind CSS
- Express API server
- Google Drive API + Google Sheets API

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env` from `.env.example` and fill credentials.

Recommended credentials:
- `GOOGLE_SERVICE_ACCOUNT_JSON` (or `GOOGLE_CLIENT_EMAIL` + `GOOGLE_PRIVATE_KEY`)

Optional:
- `GOOGLE_SHEET_ID` to force writing into an existing sheet
- `VITE_SHEET_ID` fallback for existing sheet ID
- `GOOGLE_SHEET_TITLE` defaults to `tax-failling`
- `GOOGLE_WORKSHEET_TITLE` defaults to `Submissions`

## Run

Start frontend + backend together:

```bash
pnpm dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8787`

## Submit flow

When form is submitted:

1. API checks required fields (`email`, `phone`, `agreed`)
2. Backend finds spreadsheet named `tax-failling`
3. If not found, backend creates it
4. Backend creates worksheet/header if needed
5. Backend appends a new row with form data

## Production

```bash
pnpm build
NODE_ENV=production pnpm start
```

In production mode, Express serves both API and built frontend from `dist/`.
