import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/shared/lib/api-client';
import { findButton, renderPage, signInAsAdmin, wait } from '@/features/orders/test/render-page';
import { ReturnOrdersPage } from './return-orders-page';

vi.mock('@/shared/lib/api-client', async (importOriginal) => ({
  ...(await importOriginal()),
  apiClient: { get: vi.fn(), post: vi.fn() },
}));

const REFUND_URL = '/admin/analytics/refunds/contracts';
const RETURNED_ORDER = {
  id: 7,
  uuid: 'AQ-1007',
  contract_type: 'سكني',
  is_paid: true,
  amount_payment: 349,
  employee_name: 'أحمد',
  has_return_request: true,
  refund_amount: 300,
  updated_at: '2026-01-01T10:00:00Z',
};
const REFUND = {
  id: 55,
  contract_id: 7,
  refund_amount: 300,
  management_approval: { approved: null },
  contract: { id: 7, uuid: 'AQ-1007', contract_type: 'سكني' },
};

beforeEach(() => {
  signInAsAdmin();
  apiClient.get.mockImplementation(async (url) => {
    if (url === '/admin/orders') return { data: { data: { items: [RETURNED_ORDER], pagination: { total: 1, last_page: 1 } } } };
    if (url === REFUND_URL) {
      return { data: { data: { contracts: [REFUND], summary: { management_approval: { pending: 1, approved: 0, rejected: 0 } } } } };
    }
    return { data: { data: { items: [] } } };
  });
  apiClient.post.mockResolvedValue({ data: { message: 'ok' } });
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

describe('return orders page', () => {
  it('lists the returned order with a pending approval and the KPI counters', async () => {
    const page = await renderPage(<ReturnOrdersPage />, { path: '/home/return-orders', url: '/home/return-orders' });
    await page.settle();

    expect(page.container.textContent).toContain('#AQ-1007');
    expect(page.container.textContent).toContain('بانتظار');
    expect(page.container.textContent).toContain('استرجاع 300 ريال');
    expect(page.container.textContent).toContain('بانتظار الموافقة');
    await page.unmount();
  });

  it('approves a refund and shows the message for the customer', async () => {
    const page = await renderPage(<ReturnOrdersPage />, { path: '/home/return-orders', url: '/home/return-orders' });
    await page.settle();

    await page.click(page.container.querySelector('[aria-label="اعتماد الاسترجاع"]'));
    await wait();
    const dialog = document.body.querySelector('[role="dialog"]');
    await page.click(findButton(dialog, 'حفظ'));
    await wait();

    expect(apiClient.post).toHaveBeenCalledWith(`${REFUND_URL}/55`, { admin_confirmed: true, refund_amount: 300, notes: 'تم التحويل' });
    expect(document.body.textContent).toContain('تمت موافقة الإدارة بنجاح');
    await page.unmount();
  });

  it('rejects a refund after confirmation', async () => {
    const page = await renderPage(<ReturnOrdersPage />, { path: '/home/return-orders', url: '/home/return-orders' });
    await page.settle();

    await page.click(page.container.querySelector('[aria-label="رفض"]'));
    await wait();
    await page.click(findButton(document.body.querySelector('[role="dialog"]'), 'تأكيد الرفض'));
    await wait();

    expect(apiClient.post).toHaveBeenCalledWith(`${REFUND_URL}/55`, {
      admin_confirmed: false,
      refund_amount: 300,
      notes: 'لم تتم الموافقة من الإدارة',
    });
    await page.unmount();
  });
});
