import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { citiesConfig } from '@/features/settings/configs/cities-config';
import { CrudPage } from '@/features/settings/crud/crud-page';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const get = vi.fn();
const post = vi.fn();

vi.mock('@/shared/lib/api-client', () => ({
  apiClient: { get: (...args) => get(...args), post: (...args) => post(...args) },
  getErrorMessage: (_error, fallback) => fallback,
}));

vi.mock('@/features/permissions', () => ({
  PERMISSION_SECTIONS: { cities: 'cities', regions: 'regions' },
  usePermissions: () => ({ can: () => true, isReady: true }),
}));

const mountedRoots = [];

const flush = () => act(async () => new Promise((resolve) => setTimeout(resolve, 20)));

function renderPage() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const root = createRoot(container);
  mountedRoots.push(root);
  act(() => {
    root.render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CrudPage config={citiesConfig} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });
  return container;
}

describe('CrudPage with the cities config', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    get.mockReset();
    post.mockReset();
    get.mockImplementation((path) => {
      if (path === '/admin/cities') {
        return Promise.resolve({ data: { data: { items: [{ id: 1, name_ar: 'الرياض', regions: { id: 5, name_ar: 'منطقة الرياض' } }] } } });
      }
      return Promise.resolve({ data: { data: { items: [{ id: 5, name_ar: 'منطقة الرياض' }] } } });
    });
    post.mockResolvedValue({ data: { message: 'تم' } });
  });

  afterEach(() => {
    mountedRoots.splice(0).forEach((root) => act(() => root.unmount()));
  });

  it('lists rows with edit and delete buttons', async () => {
    const container = renderPage();
    await flush();
    expect(container.textContent).toContain('الرياض');
    expect(container.textContent).toContain('منطقة الرياض');
    expect(container.textContent).toContain('تعديل');
    expect(container.textContent).toContain('حذف');
  });

  it('opens the edit dialog with the stored values selected and saves them', async () => {
    const container = renderPage();
    await flush();

    const editButton = [...container.querySelectorAll('button')].find((button) => button.textContent === 'تعديل');
    await act(async () => editButton.click());
    await flush();

    const nameInput = document.body.querySelector('input');
    const regionSelect = document.body.querySelector('select');
    expect(nameInput.value).toBe('الرياض');
    expect(regionSelect.value).toBe('5');

    const form = document.body.querySelector('form');
    await act(async () => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    await flush();

    expect(post).toHaveBeenCalledWith('/admin/cities/1', { name_ar: 'الرياض', region_id: '5' });
  });

  it('asks for confirmation before deleting', async () => {
    const container = renderPage();
    await flush();

    const deleteButton = [...container.querySelectorAll('button')].find((button) => button.textContent === 'حذف');
    await act(async () => deleteButton.click());

    const confirm = [...document.body.querySelectorAll('button')].find((button) => button.textContent === 'تأكيد الحذف');
    await act(async () => confirm.click());
    await flush();

    expect(post).toHaveBeenCalledWith('/admin/cities/1/delete');
  });
});
