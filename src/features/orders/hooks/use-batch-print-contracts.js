import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { fetchOrder } from '../api/orders-api';
import { printOrderContracts } from '../lib/contract-print';

/**
 * Loads each selected order and opens one print document with every contract
 * (one contract per page). Orders that fail to load are skipped and reported.
 */
export function useBatchPrintContracts() {
  const [isBatchPrinting, setIsBatchPrinting] = useState(false);

  const batchPrint = useCallback(async (ids = []) => {
    const orderIds = Array.from(ids).filter((id) => id != null);
    if (!orderIds.length) {
      toast.error('لم يتم تحديد أي طلب للطباعة');
      return;
    }

    setIsBatchPrinting(true);
    try {
      const results = await Promise.allSettled(orderIds.map(fetchOrder));
      const orders = results.filter((result) => result.status === 'fulfilled' && result.value).map((result) => result.value);
      const failedCount = orderIds.length - orders.length;

      if (!orders.length) {
        toast.error('تعذر تحميل بيانات الطباعة');
        return;
      }
      if (!printOrderContracts(orders)) {
        toast.error('تعذر فتح نافذة الطباعة');
        return;
      }

      if (failedCount > 0) toast.error(`تمت طباعة ${orders.length} عقد، وتعذّر تحميل ${failedCount}`);
      else toast.success(`تم تجهيز ${orders.length} عقد للطباعة`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'تعذر تحميل بيانات الطباعة'));
    } finally {
      setIsBatchPrinting(false);
    }
  }, []);

  return { isBatchPrinting, batchPrint };
}
