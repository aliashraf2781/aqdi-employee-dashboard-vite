/** Downloads `rows` (array of plain objects) as a date-stamped .xlsx file. Returns false when there is nothing to write. */
export async function writeExcelFile(rows, { filename = 'export', sheetName = 'Sheet1' } = {}) {
  if (!rows?.length) return false;

  // xlsx is large, so it is only loaded when someone actually exports.
  const XLSX = await import('xlsx');
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), sheetName);

  const dateStamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `${filename}-${dateStamp}.xlsx`);
  return true;
}
