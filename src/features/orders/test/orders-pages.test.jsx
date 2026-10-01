import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/shared/lib/api-client';
import { OrderDetailsPage } from '../pages/order-details-page';
import { OrdersPage } from '../pages/orders-page';
import { ORDER_FIXTURE, ORDERS_LIST_FIXTURE, STATUSES_FIXTURE } from './fixtures';
import { findButton, renderPage, signInAsAdmin } from './render-page';

vi.mock('@/shared/lib/api-client', async (importOriginal) => ({
  ...(await importOriginal()),
  apiClient: { get: vi.fn(), post: vi.fn() },
}));

function mockApi() {
  apiClient.get.mockImplementation(async (url) => {
    if (url.startsWith('/admin/contract-statuses')) return { data: { data: { items: STATUSES_FIXTURE } } };
    if (url === '/admin/orders') return { data: ORDERS_LIST_FIXTURE };
    if (url.startsWith('/admin/orders/')) return { data: { data: ORDER_FIXTURE } };
    return { data: { data: { items: [] } } };
  });
  apiClient.post.mockResolvedValue({ data: { message: 'ok' } });
}

beforeEach(() => {
  signInAsAdmin();
  mockApi();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

describe('OrdersPage', () => {
  it('lists the orders with their payment state', async () => {
    const page = await renderPage(<OrdersPage />, { path: '/home/orders', url: '/home/orders' });
    await page.settle();

    expect(page.container.textContent).toContain('جميع الطلبات');
    expect(page.container.textContent).toContain('#AQ-1007');
    expect(page.container.textContent).toContain('#AQ-1008');
    expect(page.container.textContent).toContain('غير مدفوع');
    // Only paid orders get the print shortcut.
    expect(page.container.querySelectorAll('[aria-label="طباعة العقد"]')).toHaveLength(1);
    await page.unmount();
  });

  it('sends the search text to the api after a pause', async () => {
    vi.useFakeTimers();
    const page = await renderPage(<OrdersPage />, { path: '/home/orders', url: '/home/orders' });
    const input = page.container.querySelector('input[type="text"]');
    const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

    await act(async () => {
      setValue.call(input, 'AQ-1008');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      vi.advanceTimersByTime(600);
    });
    vi.useRealTimers();
    await page.settle();

    const searchedParams = apiClient.get.mock.calls.filter(([url]) => url === '/admin/orders').map(([, config]) => config.params);
    expect(searchedParams.some((params) => params.search === 'AQ-1008')).toBe(true);
    await page.unmount();
  });
});

describe('OrderDetailsPage', () => {
  const render = () => renderPage(<OrderDetailsPage />, { path: '/home/orders/:id', url: '/home/orders/7' });

  it('shows the header and the data groups', async () => {
    const page = await render();
    await page.settle();
    const text = page.container.textContent;

    expect(text).toContain('#AQ-1007');
    expect(text).toContain('جديد');
    expect(text).toContain('الصك والملاك');
    expect(text).toContain('برج الندى');
    expect(text).toContain('المستأجر');
    expect(text).toContain('البيانات المالية');
    expect(text).toContain('الوحدة 5');
    expect(text).toContain('مسار الحالة');
    await page.unmount();
  });

  const openEditor = async (page, index) => {
    await page.click(page.container.querySelectorAll('[aria-label="تعديل"]')[index]);
    await page.settle();
    return document.body.querySelector('[role="dialog"]');
  };

  it('opens the deed editor with its form fields', async () => {
    const page = await render();
    await page.settle();

    const dialog = await openEditor(page, 0);
    expect(dialog.textContent).toContain('الصك والملاك');
    expect(dialog.textContent).toContain('رقم الهوية');
    expect(dialog.textContent).toContain('حفظ التعديلات');
    await page.unmount();
  });

  it('opens the editors of the tenant, financial and units sections', async () => {
    const page = await render();
    await page.settle();
    const editButtons = page.container.querySelectorAll('[aria-label="تعديل"]').length;
    expect(editButtons).toBeGreaterThanOrEqual(5);

    expect((await openEditor(page, 2)).textContent).toContain('رقم هوية المستأجر');
    await page.click(document.body.querySelector('[aria-label="إغلاق"]'));
    await page.settle();

    expect((await openEditor(page, 3)).textContent).toContain('مدة وتاريخ العقد');
    await page.click(document.body.querySelector('[aria-label="إغلاق"]'));
    await page.settle();

    expect((await openEditor(page, 4)).textContent).toContain('بيانات الوحدة');
    await page.unmount();
  });

  it('saves only the changed fields of an editor', async () => {
    const page = await render();
    await page.settle();
    const dialog = await openEditor(page, 0);

    const input = [...dialog.querySelectorAll('input')].find((node) => node.value === '1012345678');
    const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    await act(async () => {
      setValue.call(input, '2012345678');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.click(findButton(dialog, 'حفظ التعديلات'));
    await page.settle();

    const saveCall = apiClient.post.mock.calls.find(([url]) => url === '/admin/orders/7');
    // The backend requires add_legal_agent_of_owner on every owner update, so it is always sent.
    expect(saveCall[1]).toEqual({ property_owner_id_num: '2012345678', add_legal_agent_of_owner: 0 });
    await page.unmount();
  });

  it('does not save an invalid phone number', async () => {
    const page = await render();
    await page.settle();
    const dialog = await openEditor(page, 0);

    const input = [...dialog.querySelectorAll('input')].find((node) => node.value === '0555555555');
    const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    await act(async () => {
      setValue.call(input, '0555');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.click(findButton(dialog, 'حفظ التعديلات'));
    await page.settle();

    expect(apiClient.post).not.toHaveBeenCalled();
    expect(dialog.textContent).toContain('رقم الجوال يجب أن يكون 10 أرقام ويبدأ بـ 05');
    await page.unmount();
  });

  it('opens the return request flow from the refund pill', async () => {
    const page = await render();
    await page.settle();

    await page.click(findButton(page.container, 'رفع طلب استرجاع'));
    await page.settle();
    await act(async () => new Promise((resolve) => setTimeout(resolve, 30)));

    expect(document.body.textContent).toContain('قيمة المبلغ المسترجع');
    await page.unmount();
  });
});
