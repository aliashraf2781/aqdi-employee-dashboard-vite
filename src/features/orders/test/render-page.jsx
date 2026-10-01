import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/** Signs in a super admin so permission checks pass. */
export function signInAsAdmin() {
  useAuthStore.setState({ token: 'test-token', user: { id: 1, is_system_admin: true } });
}

/**
 * Renders a page inside the router and query providers the app uses.
 * Returns { container, click, type, unmount }. `path` is the route pattern, `url` the address to open.
 */
export async function renderPage(element, { path = '/', url = '/' } = {}) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route path={path} element={element} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  return {
    container,
    /** Waits for pending promises (queries) to settle. */
    settle: () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); }),
    click: (node) => act(async () => { node.dispatchEvent(new MouseEvent('click', { bubbles: true })); }),
    unmount: () => act(async () => { root.unmount(); container.remove(); }),
  };
}

/** The first element of `root` whose text contains `text` (buttons and links preferred). */
export function findByText(root, text, selector = '*') {
  const nodes = [...root.querySelectorAll(selector)].filter((node) => node.textContent.includes(text));
  return nodes.at(-1) ?? null;
}

export function findButton(root, text) {
  return [...root.querySelectorAll('button, a')].find((node) => node.textContent.includes(text)) ?? null;
}
