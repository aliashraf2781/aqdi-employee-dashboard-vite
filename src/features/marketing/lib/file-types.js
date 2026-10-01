export function isPdfFile(file) {
  return file?.type === 'application/pdf' || Boolean(file?.name?.toLowerCase().endsWith('.pdf'));
}

/** Error text when the picked file is not allowed, or null when it is fine. */
export function getFileTypeError(file, allowPdf) {
  if (file.type?.startsWith('image/')) return null;
  if (allowPdf && isPdfFile(file)) return null;
  return allowPdf ? 'الملف يجب أن يكون صورة أو PDF' : 'يجب اختيار ملف صورة فقط';
}
