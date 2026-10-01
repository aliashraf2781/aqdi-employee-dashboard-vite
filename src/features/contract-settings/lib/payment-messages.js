export const PAYMENT_MESSAGE_TYPES = { success: 'success', failed: 'failed' };

export const PAYMENT_MESSAGE_META = {
  success: {
    label: 'رسالة نجاح الدفع',
    description: 'تظهر للعميل بعد إتمام عملية الدفع بنجاح',
    tone: 'success',
  },
  failed: {
    label: 'رسالة فشل الدفع',
    description: 'تظهر للعميل عند فشل عملية الدفع',
    tone: 'danger',
  },
};

export const EMPTY_PAYMENT_MESSAGE_FORM = {
  message: '',
  button_text: '',
  button_link: '',
  button_text_2: '',
  button_link_2: '',
};

export function getPaymentMessageByType(items = [], type) {
  return items.find((item) => item?.type === type) ?? null;
}

export function paymentMessageToFormValues(item) {
  return {
    message: item.message ?? '',
    button_text: item.button_text ?? '',
    button_link: item.button_link ?? '',
    button_text_2: item.button_text_2 ?? '',
    button_link_2: item.button_link_2 ?? '',
  };
}

export function buildPaymentMessagePayload(values, type) {
  return {
    type,
    message: values.message.trim(),
    button_text: values.button_text.trim(),
    button_link: values.button_link.trim(),
    button_text_2: values.button_text_2.trim(),
    button_link_2: values.button_link_2.trim(),
  };
}
