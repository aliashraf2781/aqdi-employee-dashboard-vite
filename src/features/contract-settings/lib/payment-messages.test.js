import { describe, expect, it } from 'vitest';
import { buildPaymentMessagePayload, getPaymentMessageByType, paymentMessageToFormValues } from './payment-messages';

describe('payment message helpers', () => {
  it('finds a message by type', () => {
    const items = [{ type: 'failed', id: 2 }, { type: 'success', id: 1 }];
    expect(getPaymentMessageByType(items, 'success')).toEqual({ type: 'success', id: 1 });
    expect(getPaymentMessageByType([], 'success')).toBeNull();
  });

  it('maps a saved message to form values with empty defaults', () => {
    expect(paymentMessageToFormValues({ message: 'تم' })).toEqual({
      message: 'تم',
      button_text: '',
      button_link: '',
      button_text_2: '',
      button_link_2: '',
    });
  });

  it('trims every field and adds the type', () => {
    const payload = buildPaymentMessagePayload(
      { message: ' م ', button_text: ' أ ', button_link: ' u ', button_text_2: ' ب ', button_link_2: ' v ' },
      'failed',
    );
    expect(payload).toEqual({ type: 'failed', message: 'م', button_text: 'أ', button_link: 'u', button_text_2: 'ب', button_link_2: 'v' });
  });
});
