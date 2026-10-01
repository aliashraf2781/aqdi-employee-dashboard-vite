const UTF8_BOM = '﻿';

function toCsvCell(value) {
  const text = String(value ?? '').replace(/"/g, '""').trim();
  return `"${text}"`;
}

/** Turns an array of rows (arrays of values) into CSV text that Excel opens correctly in Arabic. */
export function buildCsv(rows) {
  const body = rows.map((row) => row.map(toCsvCell).join(',')).join('\n');
  return `${UTF8_BOM}${body}`;
}

/** Starts a browser download of `rows` as `<filenamePrefix>-<yyyy-mm-dd>.csv`. */
export function downloadCsv(rows, filenamePrefix) {
  const blob = new Blob([buildCsv(rows)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
