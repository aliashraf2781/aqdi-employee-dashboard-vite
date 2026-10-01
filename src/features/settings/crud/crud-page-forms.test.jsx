import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { contractPeriodsConfig } from '@/features/settings/configs/contract-periods-config';
import { tenantRolesConfig } from '@/features/settings/configs/tenant-roles-config';
import { CrudPage } from '@/features/settings/crud/crud-page';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
// jsdom has no ResizeObserver, which Radix switches use.
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

vi.mock('@/shared/lib/api-client', () => ({
  apiClient: { get: () => Promise.resolve({ data: { data: { items: [] } } }), post: vi.fn() },
  getErrorMessage: (_error, fallback) => fallback,
}));

vi.mock('@/features/permissions', () => ({
  PERMISSION_SECTIONS: { contract_periods: 'contract_periods', tenant_roles: 'tenant_roles' },
  usePermissions: () => ({ can: () => true, isReady: true }),
}));

const mountedRoots = [];

const flush = () => act(async () => new Promise((resolve) => setTimeout(resolve, 20)));

async function openAddDialog(config) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const root = createRoot(container);
  mountedRoots.push(root);
  act(() => {
    root.render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CrudPage config={config} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });
  await flush();
  const addButton = [...container.querySelectorAll('button')].find((button) => button.textContent.includes('إضافة'));
  await act(async () => addButton.click());
  await flush();
}

describe('dialogs with conditional and rich fields', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    mountedRoots.splice(0).forEach((root) => act(() => root.unmount()));
  });

  it('shows the custom period name only when "other" is chosen', async () => {
    await openAddDialog(contractPeriodsConfig);
    expect(document.body.textContent).not.toContain('اسم المدة');

    const select = document.body.querySelector('[role="dialog"] select');
    await act(async () => {
      select.value = '__custom__';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(document.body.textContent).toContain('اسم المدة');
  });

  it('renders the rich text editor and the user-input switch in the tenant role dialog', async () => {
    await openAddDialog(tenantRolesConfig);
    expect(document.body.querySelector('.rich-content')).not.toBeNull();
    expect(document.body.textContent).toContain('حقل من المستخدم؟');
    expect(document.body.textContent).not.toContain('اسم حقل الإدخال');

    const toggle = document.body.querySelector('[role="switch"]');
    await act(async () => toggle.click());
    expect(document.body.textContent).toContain('اسم حقل الإدخال');
  });
});
