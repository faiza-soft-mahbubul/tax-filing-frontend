const SPREADSHEET_ID = '1O8K14Rl7kmPsxQEp7lGLnGIGSLPje8wM9MyRciXmwhI';
const SHEET_NAME = 'Submissions';
const PARENT_FOLDER_ID = '1ajrGrUf1kgn8pvdQU-Pi_RGk-Ow97gwf';

const DOC_FIELDS = [
  { key: 'articleDocs', label: 'Article of Organization / LLC Documents' },
  { key: 'einLetter', label: 'EIN Letter' },
  { key: 'bankStatements', label: 'Bank Statements' },
  { key: 'ownerAddressProof', label: 'Owner Address Proof Document' },
];

const HEADERS = [
  'Submitted At',
  'Business Name',
  'EIN',
  'Business Address',
  'Incorporation Date',
  'Incorporation Day',
  'Incorporation Month',
  'Incorporation Year',
  'Business Code',
  'Owner Name',
  'Owner Address',
  'Total Yearly Income',
  'Total Expenses',
  'Cost of Goods Sold',
  'LLC Formation Cost',
  'Fiscal Year End Month',
  'Fiscal Year End Day',
  'Additional Notes',
  'Email',
  'Phone',
  'Agreed',
  'Google Drive Folder',
  'Article of Organization / LLC Documents',
  'EIN Letter',
  'Bank Statements',
  'Owner Address Proof Document',
];

function sanitizeName(name) {
  return String(name || 'Business')
    .replace(/[\\/:*?"<>|#%]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getOrCreateFolder(parentFolderId, folderName) {
  const parent = DriveApp.getFolderById(parentFolderId);
  const iterator = parent.getFoldersByName(folderName);
  if (iterator.hasNext()) return iterator.next();
  return parent.createFolder(folderName);
}

function getExt(filename) {
  const name = String(filename || '');
  const idx = name.lastIndexOf('.');
  return idx > -1 ? name.substring(idx) : '';
}

function uploadDocuments(field, files, folder, businessName) {
  const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  const cleanBusiness = sanitizeName(businessName || 'Business');
  const cleanLabel = sanitizeName(field.label);

  return (files || []).map((file, index) => {
    if (!file || !file.base64) return null;

    const ext = getExt(file.originalName);
    const displayName = `${cleanBusiness} - ${cleanLabel} - ${now}-${index + 1}${ext}`;
    const bytes = Utilities.base64Decode(file.base64);
    const blob = Utilities.newBlob(bytes, file.mimeType || 'application/octet-stream', displayName);
    const created = folder.createFile(blob).setName(displayName);

    return {
      id: created.getId(),
      name: created.getName(),
      url: created.getUrl(),
    };
  }).filter(Boolean);
}

function urls(items) {
  return (items || []).map((x) => x.url).join('\n');
}

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    const p = JSON.parse(raw);

    const businessName = sanitizeName(p.businessName || 'Business');
    const businessFolder = getOrCreateFolder(PARENT_FOLDER_ID, businessName);

    const uploadedFiles = {};
    DOC_FIELDS.forEach((field) => {
      uploadedFiles[field.key] = uploadDocuments(
        field,
        Array.isArray(p[field.key]) ? p[field.key] : [],
        businessFolder,
        businessName
      );
    });

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) sh = ss.insertSheet(SHEET_NAME);
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

    sh.appendRow([
      new Date(),
      p.businessName || '',
      p.ein || '',
      p.businessAddress || '',
      p.incDate || '',
      p.incDay || '',
      p.incMonth || '',
      p.incYear || '',
      p.businessCode || '',
      p.ownerName || '',
      p.ownerAddress || '',
      p.income || '',
      p.expenses || '',
      p.cogs || '',
      p.llcCost || '',
      p.fyMonth || '',
      p.fyDay || '',
      p.notes || '',
      p.email || '',
      p.phone || '',
      p.agreed ? 'Yes' : 'No',
      businessFolder.getUrl(),
      urls(uploadedFiles.articleDocs),
      urls(uploadedFiles.einLetter),
      urls(uploadedFiles.bankStatements),
      urls(uploadedFiles.ownerAddressProof),
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        folderId: businessFolder.getId(),
        folderUrl: businessFolder.getUrl(),
        uploadedFiles,
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
