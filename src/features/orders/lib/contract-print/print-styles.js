const FALLBACK_BRAND = 'teal';

/**
 * The print document is a separate HTML page without our CSS, so the brand color is
 * read from the theme token and handed over; neutrals use plain named colors (paper is white).
 */
function readBrandColor() {
  const channels = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
  return channels ? `rgb(${channels.split(/\s+/).join(',')})` : FALLBACK_BRAND;
}

export function buildContractPrintStyles() {
  const brand = readBrandColor();
  return `
    /* margin:0 removes the browser-injected page URL/date header and footer */
    @page { margin: 0; }
    * { box-sizing: border-box; }
    body { font-family: Arial, Tahoma, sans-serif; margin: 24px; color: black; line-height: 1.6; }
    .contract-doc + .contract-doc { padding-top: 8px; }
    .header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid ${brand}; }
    .header h1 { margin: 0 0 8px; font-size: 22px; color: ${brand}; }
    .header p { margin: 4px 0; font-size: 13px; color: dimgray; }
    .section { margin-bottom: 22px; page-break-inside: avoid; }
    .section h2 { font-size: 16px; margin: 0 0 10px; padding: 8px 12px; background: whitesmoke; border-right: 4px solid ${brand}; }
    table { width: 100%; border-collapse: collapse; }
    td { border: 1px solid gainsboro; padding: 8px 10px; font-size: 13px; vertical-align: top; }
    td.label { width: 35%; background: ghostwhite; font-weight: bold; color: dimgray; }
    .images { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px; }
    .images img { max-width: 220px; max-height: 180px; border: 1px solid lightgray; border-radius: 8px; object-fit: contain; }
    @media print {
      body { margin: 14mm 12mm; }
      .section { page-break-inside: avoid; }
    }
  `;
}
