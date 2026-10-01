import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { invalidateRefundCaches } from '@/features/orders';
import { getErrorMessage } from '@/shared/lib/api-client';
import { updateRefundContract } from '../api/refunds-api';
import { resolveRefundActionKey } from '../lib/refund-lookup';

const MISSING_REFUND = 'MISSING_REFUND_ID';
const REJECTION_NOTE = 'لم تتم الموافقة من الإدارة';

/** Mutation: the admin rejects the refund of `order`. Call `mutate()`; `onRejected` runs after the caches refresh. */
export function useRejectRefund({ order, refund, refundsLookup, refundItems, queryKey, onRejected }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const refundKey = resolveRefundActionKey(order, refund, refundsLookup, refundItems);
      if (!refundKey) throw new Error(MISSING_REFUND);

      const amount = Number(order?.refund_amount ?? refund?.refundAmount);
      return updateRefundContract(refundKey, {
        adminConfirmed: false,
        refundAmount: Number.isFinite(amount) && amount > 0 ? amount : 0,
        notes: REJECTION_NOTE,
      });
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'تم تسجيل عدم الموافقة');
      invalidateRefundCaches(queryClient, { queryKey });
      onRejected?.();
    },
    onError: (error) => {
      if (error?.message === MISSING_REFUND) toast.error('تعذر تحديد طلب الاسترجاع');
      else toast.error(getErrorMessage(error, 'حدث خطأ أثناء تنفيذ الإجراء'));
    },
  });
}
