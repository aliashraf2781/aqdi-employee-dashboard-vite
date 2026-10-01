import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/shared/lib/api-client';
import { OrderDetailsPage } from '../pages/order-details-page';
import { OrdersPage } from '../pages/orders-page';
import { ORDER_FIXTURE, ORDERS_LIST_FIXTURE, STATUSES_FIXTURE } from './fixtures';
import { findButton, openMenu, renderPage, signInAsAdmin, typeInto, wait } from './render-page';

vi.mock('@/shared/lib/api-client', async (importOriginal) => ({
  ...(await importOriginal()),
  apiClient: { get: vi.fn(), post: vi.fn() },
}));

const PENDING_STATUS = {
  id: 5,
  name: 'معلق',
  is_active: true,
  status_case: {
    fields: [
      { name: 'deed_type', type: 'select', label_ar: 'نوع الصك', required: true, options: [{ value: 'paper', label_ar: 'ورقي' }, { value: 'old', label_ar: 'قديم' }] },
      { name: 'deed_number', type: 'text', label_ar: 'رقم الصك', required_if: ['deed_type', 'old'] },
    ],
  },
};

let statuses;

beforeEach(() => {
  signInAsAdmin();
  statuses = [...STATUSES_FIXTURE, PENDING_STATUS];
  apiClient.get.mockImplementation(async (url) => {
    if (url === '/admin/contract-statuses') return { data: { data: { items: statuses } } };
    if (url.startsWith('/admin/contract-statuses')) return { data: { data: { items: statuses } } };
    if (url === '/admin/orders') return { data: ORDERS_LIST_FIXTURE };
    if (url.startsWith('/admin/orders/')) return { data: { data: ORDER_FIXTURE } };
    if (url === '/admin/contract-periods') return { data: { data: { items: [{ id: 3, period: 'سنة واحدة', price: 349 }] } } };
    return { data: { data: { items: [] } } };
  });
  apiClient.post.mockImplementation(async (url) =>
    url === '/admin/contract-paid-by-employees'
      ? { data: { message: 'تم', payment_url: 'https://pay.example/x', cart_amount: 349 } }
      : { data: { message: 'ok' } },
  );
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

const postedTo = (url) => apiClient.post.mock.calls.filter(([calledUrl]) => calledUrl === url).map(([, body]) => body);

describe('payment link dialog (list toolbar)', () => {
  it('validates the form, then creates the link and shows it', async () => {
    const page = await renderPage(<OrdersPage />, { path: '/home/orders', url: '/home/orders' });
    await page.settle();

    await page.click(page.container.querySelector('[aria-label="توليد رابط دفع — طلب واتساب"]'));
    await wait();
    const dialog = document.body.querySelector('[role="dialog"]');

    await page.click(findButton(dialog, 'توليد رابط الدفع'));
    await wait();
    expect(dialog.textContent).toContain('رقم الجوال مطلوب');
    expect(dialog.textContent).toContain('يرجى إدخال مبلغ صحيح');
    expect(apiClient.post).not.toHaveBeenCalled();

    const [mobile, amount] = dialog.querySelectorAll('input');
    await typeInto(mobile, '0512345678');
    await typeInto(amount, '349');
    await page.click(findButton(dialog, 'توليد رابط الدفع'));
    await wait();

    expect(postedTo('/admin/contract-paid-by-employees')).toEqual([
      { customer_mobile: '0512345678', contract_type: 'housing', contract_period_id: 3, amount: 349 },
    ]);
    expect(document.body.textContent).toContain('https://pay.example/x');
    await page.unmount();
  });
});

describe('manage contract statuses dialog', () => {
  it('lists the statuses and adds a new one', async () => {
    const page = await renderPage(<OrdersPage />, { path: '/home/orders', url: '/home/orders' });
    await page.settle();

    await page.click(page.container.querySelector('[aria-label="إدارة الحالات"]'));
    await wait();
    expect(document.body.textContent).toContain('مستلم');

    await page.click(findButton(document.body, 'إضافة حالة'));
    await wait();
    const dialog = [...document.body.querySelectorAll('[role="dialog"]')].at(-1);
    await page.click(findButton(dialog, 'إضافة الحالة'));
    await wait();
    expect(dialog.textContent).toContain('اسم الحالة مطلوب');

    await typeInto(dialog.querySelector('input'), 'قيد المراجعة');
    await page.click(findButton(dialog, 'إضافة الحالة'));
    await wait();

    const [body] = postedTo('/admin/contract-statuses');
    expect(body).toMatchObject({ name: 'قيد المراجعة', is_active: true });
    expect(body.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    await page.unmount();
  });
});

describe('status with extra fields (details page)', () => {
  it('asks for the required inputs before changing the status', async () => {
    const page = await renderPage(<OrderDetailsPage />, { path: '/home/orders/:id', url: '/home/orders/7' });
    await page.settle();
    await openMenu(findButton(page.container, 'جديد'));
    await wait();
    await page.click([...document.body.querySelectorAll('[role="menuitem"]')].find((item) => item.textContent === 'معلق'));
    await wait();
    await page.click(findButton(document.body, 'تأكيد التغيير'));
    await wait();

    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog.textContent).toContain('نوع الصك');
    expect(dialog.textContent).not.toContain('رقم الصك');

    await page.click(findButton(dialog, 'تأكيد تغيير الحالة'));
    await wait();
    expect(dialog.textContent).toContain('هذا الحقل مطلوب');
    expect(apiClient.post).not.toHaveBeenCalled();

    await typeInto(dialog.querySelector('select'), 'old');
    await wait();
    expect(dialog.textContent).toContain('رقم الصك *');

    await page.click(findButton(dialog, 'تأكيد تغيير الحالة'));
    await wait();
    expect(apiClient.post).not.toHaveBeenCalled();

    await typeInto(dialog.querySelector('textarea'), '777');
    await page.click(findButton(dialog, 'تأكيد تغيير الحالة'));
    await wait();
    expect(postedTo('/admin/orders/7/status')).toEqual([{ status_id: 5, deed_type: 'old', deed_number: '777' }]);
    await page.unmount();
  });
});
