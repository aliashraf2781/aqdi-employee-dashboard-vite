import { downloadCsv } from '@/shared/lib/csv';
import { printElement } from '@/shared/lib/print-element';

const PDF_RENDER_SCALE = 2;

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

/** Every <table> in the panel becomes rows for the CSV; tables are separated by a blank row. */
export function collectTableRows(panel) {
  const rows = [];
  panel.querySelectorAll('table').forEach((table, index) => {
    if (index > 0) rows.push([]);
    table.querySelectorAll('tr').forEach((tableRow) => {
      rows.push(Array.from(tableRow.querySelectorAll('th,td')).map((cell) => cell.textContent));
    });
  });
  return rows;
}

/** Returns false when the active report has no tables (chart/KPI only reports). */
export function exportPanelTablesToCsv(panel, filenamePrefix) {
  if (!panel || panel.querySelectorAll('table').length === 0) return false;
  downloadCsv(collectTableRows(panel), filenamePrefix);
  return true;
}

export function printReportPanel(panel) {
  return printElement(panel);
}

/** Renders the panel to an image and splits it across A4 pages. The libraries load only when used. */
export async function downloadReportPdf(panel, filenamePrefix) {
  if (!panel) return false;

  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);

    const canvas = await html2canvas(panel, {
      scale: PDF_RENDER_SCALE,
      useCORS: true,
      logging: false,
      backgroundColor: getComputedStyle(document.body).backgroundColor,
      windowWidth: panel.scrollWidth,
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageHeight = (canvas.height * pageWidth) / canvas.width;
    const image = canvas.toDataURL('image/png');

    let heightLeft = imageHeight;
    let offset = 0;
    pdf.addImage(image, 'PNG', 0, offset, pageWidth, imageHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      offset = heightLeft - imageHeight;
      pdf.addPage();
      pdf.addImage(image, 'PNG', 0, offset, pageWidth, imageHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filenamePrefix}-${todayStamp()}.pdf`);
    return true;
  } catch {
    return false;
  }
}
