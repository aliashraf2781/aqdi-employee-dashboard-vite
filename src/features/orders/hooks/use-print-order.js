import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { fetchOrder } from '../api/orders-api';
import { printOrderContract } from '../lib/contract-print';

/** Loads one order and opens the browser print dialog with its contract. */
export function usePrintOrder() {
  const [isPrinting, setIsPrinting] = useState(false);

  const printOrder = useCallback(async (orderId) => {
    if (!orderId) {
      toast.error('لا توجد بيانات للطباعة');
      return;
    }

    setIsPrinting(true);
    try {
      const orderData = await fetchOrder(orderId);
      if (!printOrderContract(orderData)) toast.error('تعذر فتح نافذة الطباعة');
    } catch (error) {
      toast.error(getErrorMessage(error, 'تعذر تحميل بيانات الطباعة'));
    } finally {
      setIsPrinting(false);
    }
  }, []);

  return { isPrinting, printOrder };
}
