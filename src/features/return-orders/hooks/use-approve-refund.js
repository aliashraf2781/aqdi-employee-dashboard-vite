import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { updateRefundContract } from '../api/refunds-api';
import { resolveRefundActionKey } from '../lib/refund-lookup';

const MISSING_REFUND = 'MISSING_REFUND_ID';

/**
 * Mutation: the admin approves the refund of `order`. Call `mutate({ refundAmount, notes })`.
 * Caches are refreshed later by the page, once the success dialog is closed.
 */
export function useApproveRefund({ order, refund, refundsLookup, refundItems, onApproved }) {
  return useMutation({
    mutationFn: ({ refundAmount, notes }) => {
      const refundKey = resolveRefundActionKey(order, refund, refundsLookup, refundItems);
      if (!refundKey) throw new Error(MISSING_REFUND);
      return updateRefundContract(refundKey, { adminConfirmed: true, refundAmount: Number(refundAmount), notes });
    },
    onSuccess: (data, { refundAmount }) => {
      toast.success(data?.message || 'تمت موافقة الإدارة بنجاح');
      onApproved?.({ ...refund, refundAmount: Number(refundAmount) });
    },
    onError: (error) => {
      if (error?.message === MISSING_REFUND) toast.error('تعذر تحديد طلب الاسترجاع');
      else toast.error(getErrorMessage(error, 'حدث خطأ أثناء حفظ الموافقة'));
    },
  });
}
