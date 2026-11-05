import {
  InvoicePaymentOption,
  InvoicePaymentStatus,
  InvoicePaymentTerms,
} from '../types';

export interface CommercialInvoicePdfPayload {
  invoiceRef: string;
  orderNumber?: string;
  issueDate: string;
  status: InvoicePaymentStatus;
  paymentTerms: InvoicePaymentTerms;
  paymentOption: InvoicePaymentOption;
  billFrom: {
    companyName: string;
    contactPerson: string;
    address: string;
    country: string;
    phone: string;
    billingEmail: string;
  };
  billTo: {
    companyName?: string;
    contactPerson?: string;
    address?: string;
    phone?: string;
    website?: string;
    email?: string;
  };
  lineItem: {
    description: string;
    specsAndSla: string;
    quantity: number;
    unitRate: number;
    lineTotal: number;
  };
  subtotal: number;
  taxRatePercent: number;
  taxAmount: number;
  grandTotal: number;
  paypalEmail: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNo: string;
    branch: string;
    branchCode: string;
    swiftCode: string;
    routingNo: string;
  };
  paymentInstructions: string;
  invoiceNotesAndTerms?: string;
}

function escapePdfString(text: string): string {
  return (text || '')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = (text || '').trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    if (!current) {
      current = w;
    } else if ((current + ' ' + w).length <= maxCharsPerLine) {
      current += ' ' + w;
    } else {
      lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [''];
}

export function downloadCommercialInvoicePdf(
  data: CommercialInvoicePdfPayload
): void {
  const ops: string[] = [];

  const drawRect = (
    x: number,
    yTop: number,
    w: number,
    h: number,
    fillRgb?: [number, number, number],
    strokeRgb?: [number, number, number],
    lineWidth = 0.75
  ) => {
    const yPdf = 842 - yTop - h;
    ops.push('q');
    if (fillRgb) {
      ops.push(`${fillRgb[0]} ${fillRgb[1]} ${fillRgb[2]} rg`);
    }
    if (strokeRgb) {
      ops.push(`${strokeRgb[0]} ${strokeRgb[1]} ${strokeRgb[2]} RG`);
      ops.push(`${lineWidth} w`);
    }
    const mode = fillRgb && strokeRgb ? 'B' : fillRgb ? 'f' : 'S';
    ops.push(`${x.toFixed(1)} ${yPdf.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)} re ${mode}`);
    ops.push('Q');
  };

  const drawText = (
    text: string,
    x: number,
    yTop: number,
    size = 9,
    font: 'F1' | 'F2' | 'F3' = 'F1',
    rgb: [number, number, number] = [0.08, 0.12, 0.22]
  ) => {
    const yPdf = 842 - yTop;
    ops.push('BT');
    ops.push(`/${font} ${size} Tf`);
    ops.push(`${rgb[0]} ${rgb[1]} ${rgb[2]} rg`);
    ops.push(`${x.toFixed(1)} ${yPdf.toFixed(1)} Td`);
    ops.push(`(${escapePdfString(text)}) Tj`);
    ops.push('ET');
  };

  // Top Header Navy Banner
  drawRect(36, 32, 523, 62, [0.0, 0.118, 0.353]);
  drawText('FIX PHOTO STUDIO', 50, 56, 16, 'F2', [1, 1, 1]);
  drawText(
    'Get pixel-perfect photo & video editing services · Commercial Studio Invoice',
    50,
    74,
    8.5,
    'F1',
    [0.72, 0.86, 1.0]
  );

  drawText('COMMERCIAL INVOICE', 415, 52, 11, 'F2', [0.0, 0.78, 1.0]);
  drawText(`INVOICE NO: ${data.invoiceRef}`, 415, 67, 8.5, 'F3', [1, 1, 1]);
  drawText(
    `STATUS: ${data.status === 'paid' ? 'PAID & SETTLED' : 'PENDING PAYMENT'}`,
    415,
    80,
    8.5,
    'F2',
    data.status === 'paid' ? [0.4, 0.95, 0.65] : [1.0, 0.84, 0.35]
  );

  // Meta Strip
  drawRect(36, 102, 523, 28, [0.95, 0.975, 0.995], [0.82, 0.88, 0.94]);
  drawText(
    `Issue Date: ${data.issueDate}`,
    48,
    119,
    8.5,
    'F1',
    [0.15, 0.22, 0.32]
  );
  if (data.orderNumber) {
    drawText(
      `Order Ref: ${data.orderNumber}`,
      210,
      119,
      8.5,
      'F2',
      [0.0, 0.118, 0.353]
    );
  }
  drawText(
    `Payment Terms: ${data.paymentTerms}`,
    345,
    119,
    8.5,
    'F2',
    [0.0, 0.118, 0.353]
  );
  drawText(
    `Payment Option: ${data.paymentOption}`,
    455,
    119,
    8.5,
    'F2',
    [0.0, 0.45, 0.9]
  );

  // BILL FROM & BILL TO Columns
  const billToEntries: Array<{ label: string; value: string }> = [];
  if (data.billTo.companyName?.trim()) {
    billToEntries.push({
      label: 'Company Name:',
      value: data.billTo.companyName.trim(),
    });
  }
  if (data.billTo.contactPerson?.trim()) {
    billToEntries.push({
      label: 'Contact Person:',
      value: data.billTo.contactPerson.trim(),
    });
  }
  if (data.billTo.address?.trim()) {
    billToEntries.push({
      label: 'Address:',
      value: data.billTo.address.trim(),
    });
  }
  if (data.billTo.phone?.trim()) {
    billToEntries.push({
      label: 'Phone No.:',
      value: data.billTo.phone.trim(),
    });
  }
  if (data.billTo.website?.trim()) {
    billToEntries.push({
      label: 'Website:',
      value: data.billTo.website.trim(),
    });
  }
  if (data.billTo.email?.trim()) {
    billToEntries.push({
      label: 'Email:',
      value: data.billTo.email.trim(),
    });
  }

  const boxHeight = Math.max(108, 34 + Math.max(5, billToEntries.length) * 14);
  drawRect(36, 140, 254, boxHeight, [0.985, 0.99, 0.998], [0.82, 0.88, 0.94]);
  drawRect(305, 140, 254, boxHeight, [0.985, 0.99, 0.998], [0.82, 0.88, 0.94]);

  // BILL FROM Content
  drawText('BILL FROM:', 48, 156, 9, 'F2', [0.0, 0.118, 0.353]);
  const billFromRows: Array<[string, string]> = [
    ['Company Name:', data.billFrom.companyName],
    ['Contact Person:', data.billFrom.contactPerson],
    ['Address:', data.billFrom.address],
    ['Country:', data.billFrom.country],
    ['Phone:', data.billFrom.phone],
  ];
  let bfY = 172;
  for (const [lbl, val] of billFromRows) {
    if (!val?.trim()) continue;
    drawText(lbl, 48, bfY, 8.2, 'F2', [0.28, 0.34, 0.42]);
    drawText(val.slice(0, 36), 120, bfY, 8.2, 'F1', [0.08, 0.12, 0.2]);
    bfY += 14;
  }

  // BILL TO Content (Only fields provided by customer)
  drawText('BILL TO:', 317, 156, 9, 'F2', [0.0, 0.118, 0.353]);
  let btY = 172;
  if (billToEntries.length === 0) {
    drawText('Client Account', 317, btY, 8.5, 'F1', [0.28, 0.34, 0.42]);
  } else {
    for (const entry of billToEntries) {
      drawText(entry.label, 317, btY, 8.2, 'F2', [0.28, 0.34, 0.42]);
      drawText(entry.value.slice(0, 34), 392, btY, 8.2, 'F1', [0.08, 0.12, 0.2]);
      btY += 14;
    }
  }

  // Itemized Invoice Table
  const tableTop = 140 + boxHeight + 14;
  drawRect(36, tableTop, 523, 24, [0.0, 0.118, 0.353]);
  drawText('SL', 44, tableTop + 15, 8.5, 'F2', [1, 1, 1]);
  drawText('SERVICE / PROJECT DESCRIPTION', 72, tableTop + 15, 8.5, 'F2', [1, 1, 1]);
  drawText('SPECS & SLA', 280, tableTop + 15, 8.5, 'F2', [1, 1, 1]);
  drawText('QTY', 405, tableTop + 15, 8.5, 'F2', [1, 1, 1]);
  drawText('UNIT RATE', 445, tableTop + 15, 8.5, 'F2', [1, 1, 1]);
  drawText('LINE TOTAL', 502, tableTop + 15, 8.5, 'F2', [1, 1, 1]);

  const descLines = wrapText(data.lineItem.description, 36).slice(0, 2);
  const specLines = wrapText(data.lineItem.specsAndSla, 24).slice(0, 2);
  const rowHeight = Math.max(36, Math.max(descLines.length, specLines.length) * 14 + 12);

  drawRect(36, tableTop + 24, 523, rowHeight, [1, 1, 1], [0.82, 0.88, 0.94]);
  drawText('01', 44, tableTop + 40, 8.5, 'F3', [0.15, 0.2, 0.3]);
  descLines.forEach((line, idx) => {
    drawText(line, 72, tableTop + 40 + idx * 12, 8.5, 'F2', [0.05, 0.1, 0.2]);
  });
  specLines.forEach((line, idx) => {
    drawText(line, 280, tableTop + 40 + idx * 12, 8, 'F1', [0.3, 0.36, 0.45]);
  });
  drawText(
    String(data.lineItem.quantity),
    405,
    tableTop + 40,
    8.5,
    'F3',
    [0.08, 0.12, 0.2]
  );
  drawText(
    `$${data.lineItem.unitRate.toFixed(2)}`,
    445,
    tableTop + 40,
    8.5,
    'F3',
    [0.08, 0.12, 0.2]
  );
  drawText(
    `$${data.lineItem.lineTotal.toFixed(2)}`,
    502,
    tableTop + 40,
    9,
    'F2',
    [0.0, 0.118, 0.353]
  );

  // Totals Section
  const totalsTop = tableTop + 24 + rowHeight;
  drawRect(36, totalsTop, 523, 64, [0.97, 0.985, 1.0], [0.82, 0.88, 0.94]);
  drawText('Subtotal (USD):', 395, totalsTop + 16, 8.5, 'F1', [0.3, 0.36, 0.45]);
  drawText(
    `$${data.subtotal.toFixed(2)}`,
    502,
    totalsTop + 16,
    8.5,
    'F3',
    [0.08, 0.12, 0.2]
  );

  drawText(
    `Tax / VAT (${data.taxRatePercent}%):`,
    395,
    totalsTop + 32,
    8.5,
    'F1',
    [0.3, 0.36, 0.45]
  );
  drawText(
    `$${data.taxAmount.toFixed(2)}`,
    502,
    totalsTop + 32,
    8.5,
    'F3',
    [0.08, 0.12, 0.2]
  );

  drawText(
    data.status === 'paid'
      ? 'GRAND TOTAL SETTLED (USD):'
      : 'GRAND TOTAL DUE (USD):',
    340,
    totalsTop + 52,
    10,
    'F2',
    [0.0, 0.118, 0.353]
  );
  drawText(
    `$${data.grandTotal.toFixed(2)}`,
    498,
    totalsTop + 52,
    11,
    'F2',
    [0.0, 0.45, 0.9]
  );

  // Official Payment Remittance Details (Configured by Studio Admin)
  const remitTop = totalsTop + 80;
  const isPaypal = data.paymentOption === 'PayPal';
  const remitHeight = isPaypal ? 115 : 175;

  drawRect(
    36,
    remitTop,
    523,
    remitHeight,
    [0.985, 0.99, 0.998],
    [0.82, 0.88, 0.94]
  );
  drawText(
    'OFFICIAL PAYMENT REMITTANCE DETAILS (CONFIGURED BY STUDIO ADMIN)',
    48,
    remitTop + 18,
    9,
    'F2',
    [0.0, 0.118, 0.353]
  );
  drawText(
    `Ref: ${data.invoiceRef}`,
    450,
    remitTop + 18,
    8.5,
    'F3',
    [0.0, 0.45, 0.9]
  );

  let rY = remitTop + 36;
  drawText(
    `Payment Terms: ${data.paymentTerms}   |   Payment Option: ${data.paymentOption}`,
    48,
    rY,
    8.5,
    'F2',
    [0.12, 0.2, 0.32]
  );
  rY += 18;

  if (isPaypal) {
    drawText('PayPal Account Details:', 48, rY, 8.5, 'F2', [0.0, 0.118, 0.353]);
    rY += 14;
    drawText(
      `PayPal Mail ID: ${data.paypalEmail}`,
      48,
      rY,
      9.5,
      'F2',
      [0.0, 0.42, 0.88]
    );
    rY += 20;
  } else {
    drawText('Bank Details Below:', 48, rY, 8.5, 'F2', [0.0, 0.118, 0.353]);
    rY += 14;
    const bankRows: Array<[string, string]> = [
      ['Bank Name :', data.bankDetails.bankName],
      ['Account Name :', data.bankDetails.accountName],
      ['Account No :', data.bankDetails.accountNo],
      ['Branch :', data.bankDetails.branch],
      ['Branch Code :', data.bankDetails.branchCode],
      ['SWIFT Code :', data.bankDetails.swiftCode],
      ['Routing No :', data.bankDetails.routingNo],
    ];
    for (const [bLabel, bVal] of bankRows) {
      drawText(bLabel, 48, rY, 8.2, 'F2', [0.28, 0.34, 0.42]);
      drawText(bVal, 135, rY, 8.2, 'F3', [0.08, 0.12, 0.2]);
      rY += 13;
    }
    rY += 6;
  }

  const resolvedInstructions = (data.paymentInstructions || '').replace(
    /INV-FPS-2026-XXXX/gi,
    data.invoiceRef
  );
  const instrLines = wrapText(
    `Payment Instructions: ${resolvedInstructions}`,
    90
  ).slice(0, 3);
  for (const line of instrLines) {
    drawText(line, 48, rY, 8, 'F1', [0.25, 0.3, 0.38]);
    rY += 12;
  }

  // Footer
  drawText(
    `Billing Support: ${data.billFrom.billingEmail} · Official Commercial Invoice (${data.invoiceRef})`,
    36,
    805,
    8,
    'F1',
    [0.4, 0.45, 0.52]
  );

  // Assemble PDF 1.4 file
  const streamContent = ops.join('\n');
  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
    '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>\nendobj\n',
    `7 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.invoiceRef}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2500);
}
