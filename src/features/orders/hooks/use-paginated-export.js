import { useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { fetchAllPages } from '../api/orders-api';

/**
 * Export button state: downloads every page of a list, then hands the rows to `onExport`
 * (which returns false when there was nothing to write).
 */
export function usePaginatedExport({ buildUrl, extractPage, onExport }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const rows = await fetchAllPages(buildUrl, extractPage);
      const exported = await onExport(rows);
      if (exported) toast.success(`تم تصدير ${rows.length} سجل بنجاح`);
      else toast.error('لا توجد بيانات للتصدير');
    } catch (error) {
      toast.error(getErrorMessage(error, 'تعذر تصدير البيانات'));
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExport, isExporting };
}
