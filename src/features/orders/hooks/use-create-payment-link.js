import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createContractPaidLink } from '../api/contract-paid-api';
import { CONTRACT_PAID_QUERY_KEY, invalidateOrdersCaches } from '../lib/order-query-keys';
import { extractPaymentFromResponse } from '../lib/payment-link';

/**
 * Mutation: create a payment link for a WhatsApp customer.
 * Resolves to the extracted payment, or null when the server answered without a link.
 */
export function useCreatePaymentLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body) => {
      const data = await createContractPaidLink(body);
      const payment = extractPaymentFromResponse(data);
      if (!payment.paymentUrl && !payment.alreadyPaid) {
        toast.error(data?.message || 'لم يتم إرجاع رابط الدفع');
        return null;
      }
      toast.success(
        payment.alreadyPaid ? payment.message || 'تم دفع هذا العقد بالفعل' : data?.message || 'تم توليد رابط الدفع',
      );
      invalidateOrdersCaches(queryClient, { queryKey: [CONTRACT_PAID_QUERY_KEY] });
      return payment;
    },
    onError: (error) =>
      toast.error(error?.response?.data?.gateway_error || error?.response?.data?.message || 'تعذر توليد رابط الدفع'),
  });
}
