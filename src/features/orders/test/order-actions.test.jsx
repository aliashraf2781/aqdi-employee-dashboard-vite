import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/shared/lib/api-client';
import { OrderDetailsPage } from '../pages/order-details-page';
import { ORDER_FIXTURE, STATUSES_FIXTURE } from './fixtures';
import { findButton, openMenu, renderPage, signInAsAdmin, typeInto, wait } from './render-page';

vi.mock('@/shared/lib/api-client', async (importOriginal) => ({
  ...(await importOriginal()),
  apiClient: { get: vi.fn(), post: vi.fn() },
}));

beforeEach(() => {
  signInAsAdmin();
  apiClient.get.mockImplementation(async (url) => {
    if (url.startsWith('/admin/contract-statuses')) return { data: { data: { items: STATUSES_FIXTURE } } };
    if (url.startsWith('/admin/orders/')) return { data: { data: ORDER_FIXTURE } };
    if (url.startsWith('/admin/payment-gateway/')) return { data: { payment_url: 'https://pay.example/AQ-1007', cart_amount: 349 } };
    return { data: { data: { items: [] } } };
  });
  apiClient.post.mockResolvedValue({ data: { message: 'ok' } });
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

const renderDetails = async () => {
  const page = await renderPage(<OrderDetailsPage />, { path: '/home/orders/:id', url: '/home/orders/7' });
  await page.settle();
  return page;
};

const postedTo = (url) => apiClient.post.mock.calls.filter(([calledUrl]) => calledUrl === url).map(([, body]) => body);

describe('status change from the details header', () => {
  it('asks for confirmation, then changes the status', async () => {
    const page = await renderDetails();
    await openMenu(findButton(page.container, 'جديد'));
    await wait();

    await page.click([...document.body.querySelectorAll('[role="menuitem"]')].find((item) => item.textContent === 'مستلم'));
    await wait();
    expect(document.body.textContent).toContain('هل أنت متأكد من تغيير حالة الطلب #AQ-1007 إلى «مستلم»؟');
    expect(apiClient.post).not.toHaveBeenCalled();

    await page.click(findButton(document.body, 'تأكيد التغيير'));
    await wait();
    expect(postedTo('/admin/orders/7/status')).toEqual([{ status_id: 6 }]);
    await page.unmount();
  });
});

describe('return request flow', () => {
  it('validates the amount, then raises the request with the order uuid', async () => {
    const page = await renderDetails();
    await page.click(findButton(page.container, 'رفع طلب استرجاع'));
    await wait();

    const dialog = document.body.querySelector('[role="dialog"]');
    await page.click(findButton(dialog, 'تأكيد الاسترجاع'));
    await wait();
    expect(dialog.textContent).toContain('يرجى إدخال قيمة المبلغ المسترجع');
    expect(apiClient.post).not.toHaveBeenCalled();

    await typeInto(dialog.querySelector('input[type="number"]'), '120');
    await page.click(findButton(dialog, 'تأكيد الاسترجاع'));
    await wait();

    expect(postedTo('/admin/refundable-contracts')).toEqual([{ contract_id: 'AQ-1007', refund_amount: 120, notes: null }]);
    expect(document.body.textContent).toContain('تم رفع طلب الاسترجاع بنجاح');
    await page.unmount();
  });
});

describe('header dialogs', () => {
  it('sends the contract draft with the contact number', async () => {
    const page = await renderDetails();
    await page.click(findButton(page.container, 'إرسال المسودة'));
    await wait();

    const dialog = document.body.querySelector('[role="dialog"]');
    await page.click(findButton(dialog, 'إرسال المسودة'));
    await wait();
    expect(dialog.textContent).toContain('رقم مسودة العقد مطلوب');

    await typeInto(dialog.querySelector('input'), '1234567890');
    await page.click(findButton(dialog, 'إرسال المسودة'));
    await wait();
    expect(postedTo('/admin/orders/7/status')).toEqual([{ status_id: 8, ejar_contract_draft_number: '1234567890', contact_number_mode: 'same' }]);
    await page.unmount();
  });

  it('documents the order in Ejar and moves it to the documented status', async () => {
    apiClient.get.mockImplementation(async (url) => {
      if (url.startsWith('/admin/contract-statuses')) return { data: { data: { items: [...STATUSES_FIXTURE, { id: 9, name: 'تم التوثيق' }] } } };
      return { data: { data: ORDER_FIXTURE } };
    });
    const page = await renderDetails();
    await page.click(findButton(page.container, 'موثق في إيجار'));
    await wait();

    const dialog = document.body.querySelector('[role="dialog"]');
    await typeInto(dialog.querySelector('input'), '9876543210');
    await page.click(findButton(dialog, 'تأكيد التوثيق في إيجار'));
    await wait();

    expect(postedTo('/admin/orders/7')).toEqual([{ ejar_contract_number: '9876543210', ejar_status_notes: null }]);
    expect(postedTo('/admin/orders/7/status')).toEqual([{ status_id: 9 }]);
    await page.unmount();
  });

  it('records the property update', async () => {
    const page = await renderDetails();
    await page.click(findButton(page.container, 'رفع تحديث العقار'));
    await wait();

    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog.querySelector('input').value).toBe('5555');
    await page.click(findButton(dialog, 'تأكيد رفع العقار'));
    await wait();
    expect(dialog.textContent).toContain('الرجاء تحديد طريقة الإضافة');

    await page.click(findButton(dialog, 'ورقي'));
    await page.click(findButton(dialog, 'تأكيد رفع العقار'));
    await wait();
    expect(postedTo('/admin/orders/7')).toEqual([{ deed_addition_method: 'paper', deed_number: '5555' }]);
    await page.unmount();
  });

  it('builds the correction message from the chosen errors', async () => {
    const page = await renderDetails();
    await page.click(findButton(page.container, 'طلب مرفق ناقص'));
    await wait();

    const dialog = document.body.querySelector('[role="dialog"]');
    await page.click(findButton(dialog, 'المستأجر خطأ'));
    expect(dialog.textContent).toContain('- المستأجر خطأ');
    expect(dialog.textContent).toContain('#AQ-1007');
    await page.unmount();
  });

  it('shows the payment link of an unpaid order', async () => {
    apiClient.get.mockImplementation(async (url) => {
      if (url.startsWith('/admin/payment-gateway/')) return { data: { payment_url: 'https://pay.example/AQ-1007', cart_amount: 349 } };
      if (url.startsWith('/admin/contract-statuses')) return { data: { data: { items: STATUSES_FIXTURE } } };
      return { data: { data: { ...ORDER_FIXTURE, contract_summary: { ...ORDER_FIXTURE.contract_summary, is_paid: false } } } };
    });
    const page = await renderDetails();
    await page.click(findButton(page.container, 'توليد رابط دفع'));
    await wait();

    expect(document.body.textContent).toContain('تم إنشاء رابط الدفع بنجاح');
    expect(document.body.textContent).toContain('https://pay.example/AQ-1007');
    await act(async () => {});
    await page.unmount();
  });
});
