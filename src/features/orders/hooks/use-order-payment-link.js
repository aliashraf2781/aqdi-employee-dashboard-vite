import { useState } from 'react';
import { toast } from 'sonner';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { fetchContractPaymentLink } from '../api/contract-paid-api';
import { getOrderContractUuid } from '../lib/order-contact';
import { buildOrderPaymentUrl } from '../lib/order-sms-templates';

const EMPTY_LINK = { paymentUrl: '', cartAmount: null, alreadyPaid: false, message: null, payment: null };

/** Payment link of an order: show it in a dialog, or copy it. Falls back to the public pay url when the gateway fails. */
export function useOrderPaymentLink() {
  const [link, setLink] = useState(EMPTY_LINK);
  const [isOpen, setIsOpen] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const show = async (orderData) => {
    const uuid = getOrderContractUuid(orderData);
    if (!uuid) {
      toast.error('رقم الطلب غير متوفر');
      return;
    }
    try {
      const result = await fetchContractPaymentLink(uuid);
      setLink({
        paymentUrl: result.paymentUrl || '',
        cartAmount: result.cartAmount,
        alreadyPaid: result.alreadyPaid,
        message: result.message,
        payment: result.payment,
      });
      setIsOpen(true);
    } catch (error) {
      toast.error(error?.response?.data?.gateway_error || error?.response?.data?.message || error?.message || 'تعذر إنشاء رابط الدفع');
    }
  };

  const copy = async (uuid) => {
    if (!uuid) {
      toast.error('رقم الطلب غير متوفر');
      return;
    }
    setIsCopying(true);
    try {
      let url = buildOrderPaymentUrl(uuid);
      try {
        const result = await fetchContractPaymentLink(uuid);
        if (result.alreadyPaid) {
          toast.error(result.message || 'هذا العقد مدفوع مسبقاً');
          return;
        }
        url = result.paymentUrl || url;
      } catch {
        // the gateway is down: the public pay url is still valid
      }
      await copyToClipboard(url, 'تم نسخ رابط الدفع');
    } finally {
      setIsCopying(false);
    }
  };

  return { link, isOpen, setIsOpen, isCopying, show, copy };
}
