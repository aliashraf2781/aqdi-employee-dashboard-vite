import { toast } from 'sonner';

/** Copies text and tells the user. `successMessage` is the toast shown on success. */
export async function copyToClipboard(text, successMessage = 'تم النسخ') {
  const value = String(text ?? '');
  if (!value.trim()) {
    toast.error('لا يوجد نص للنسخ');
    return false;
  }

  try {
    await navigator.clipboard.writeText(value);
    toast.success(successMessage);
    return true;
  } catch {
    toast.error('تعذر النسخ');
    return false;
  }
}
