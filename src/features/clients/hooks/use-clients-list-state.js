import { useState } from 'react';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { DEFAULT_PAGE_SIZE, statusFilterToParams } from '@/features/clients/lib/clients-query';

const SEARCH_DEBOUNCE_MS = 500;
const DEFAULT_FILTERS = { platform: 'all', createdAt: 'all', status: 'all', pageSize: DEFAULT_PAGE_SIZE };

/**
 * Everything the clients list screen lets the user change: search text, dropdown
 * filters, page size and page number. `apiFilters` is what the list/export calls need.
 * Changing any filter sends the user back to page 1.
 */
export function useClientsListState() {
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const search = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS);

  // The page is remembered together with the filters it was chosen for; when the
  // filters change the stored key no longer matches and we fall back to page 1.
  const filtersKey = JSON.stringify([search, filters]);
  const [pageState, setPageState] = useState({ key: filtersKey, page: 1 });
  const page = pageState.key === filtersKey ? pageState.page : 1;

  const changeFilter = (name, value) => setFilters((previous) => ({ ...previous, [name]: value }));

  const apiFilters = {
    search,
    platform: filters.platform,
    createdAt: filters.createdAt,
    ...statusFilterToParams(filters.status),
  };

  return {
    searchInput,
    setSearchInput,
    filters,
    changeFilter,
    page,
    setPage: (nextPage) => setPageState({ key: filtersKey, page: nextPage }),
    apiFilters,
  };
}
