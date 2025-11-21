/**
 * PDF Export Utility
 * Generates a simple PDF with patient information
 * 
 * TODO: For production PDF generation:
 * Option 1: Use puppeteer
 *   npm install puppeteer
 *   import puppeteer from 'puppeteer'
 * 
 * Option 2: Use pdfkit
 *   npm install pdfkit
 *   import PDFDocument from 'pdfkit'
 * 
 * For now, we return a simple text file as PDF (base64)
 */

export async function exportPatientPdf(patient, notes = []) {
  const html = generateHTML(patient, notes)

  // For now, return a simple text-based PDF
  // In production, use puppeteer or html-pdf to generate real PDFs
  const pdfContent = generateSimplePDF(patient, notes)
  return Buffer.from(pdfContent)
}

function generateHTML(patient, notes) {
  const notesHtml = notes
    .map(
      (note) =>
        `<div style="margin-bottom: 10px; padding: 8px; background: #f5f5f5;">
      <strong>${note.domain}</strong> - ${new Date(note.createdAt).toLocaleDateString()}
      <p>${note.text}</p>
    </div>`
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Patient Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        h1 { border-bottom: 2px solid #0066cc; padding-bottom: 10px; }
        .section { margin: 20px 0; }
        .label { font-weight: bold; color: #0066cc; }
      </style>
    </head>
    <body>
      <h1>${patient.name}</h1>
      
      <div class="section">
        <div class="label">Age:</div> ${patient.age}
      </div>
      
      <div class="section">
        <div class="label">Gender:</div> ${patient.gender}
      </div>
      
      ${patient.contact?.email ? `<div class="section"><div class="label">Email:</div> ${patient.contact.email}</div>` : ''}
      ${patient.contact?.phone ? `<div class="section"><div class="label">Phone:</div> ${patient.contact.phone}</div>` : ''}
      
      ${patient.domains?.length > 0 ? `<div class="section"><div class="label">Medical Domains:</div> ${patient.domains.join(', ')}</div>` : ''}
      
      <div class="section">
        <h2>Notes</h2>
        ${notesHtml || '<p>No notes</p>'}
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
        Generated: ${new Date().toLocaleString()}
      </div>
    </body>
    </html>
  `
}

function generateSimplePDF(patient, notes) {
  // Simple text-based PDF (in production, use puppeteer)
  let content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 500 >>
stream
BT
/F1 14 Tf
50 700 Td
(${patient.name}) Tj
0 -30 Td
/F1 10 Tf
(Age: ${patient.age}) Tj
0 -20 Td
(Gender: ${patient.gender}) Tj
${patient.contact?.email ? `0 -20 Td\n(Email: ${patient.contact.email}) Tj` : ''}
${patient.contact?.phone ? `0 -20 Td\n(Phone: ${patient.contact.phone}) Tj` : ''}
0 -40 Td
/F1 12 Tf
(Notes:) Tj
${notes.map((n) => `0 -20 Td\n(${n.text.substring(0, 50)}) Tj`).join('\n')}
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000262 00000 n
0000000341 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
891
%%EOF`

  return content
}

export default exportPatientPdf
