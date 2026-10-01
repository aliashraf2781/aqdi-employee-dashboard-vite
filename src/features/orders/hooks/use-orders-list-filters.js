import { useMemo, useState } from 'react';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { buildAdminOrdersParams } from '../lib/admin-orders-query';
import { resolveListFilters, toggleFilterPill, STATUS_PILLS } from '../lib/orders-filters';

const DEFAULT_PER_PAGE = 20;

/**
 * Filter, search and paging state of an orders table, plus the API params built from it.
 * Any change to a filter sends the user back to the first page.
 * `lockedFilter` pre-selects a pill that cannot be turned off (used by screens that show one kind of order).
 */
export function useOrdersListFilters({ canceledStatusId, returnedStatusId, lockedFilter = null } = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(() => (lockedFilter ? [lockedFilter] : []));
  const [extraStatusId, setExtraStatusId] = useState(null);
  const [contractType, setContractType] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const search = useDebouncedValue(searchQuery.trim());

  const resetKey = JSON.stringify([search, activeFilters, extraStatusId, contractType, perPage]);
  const [previousResetKey, setPreviousResetKey] = useState(resetKey);
  if (resetKey !== previousResetKey) {
    setPreviousResetKey(resetKey);
    setPage(1);
  }

  const toggleFilter = (id) => {
    if (lockedFilter && STATUS_PILLS.includes(id)) return;
    if (STATUS_PILLS.includes(id) && !activeFilters.includes(id)) setExtraStatusId(null);
    setActiveFilters((previous) => toggleFilterPill(previous, id));
  };

  const changeExtraStatus = (statusId) => {
    if (lockedFilter) return;
    setExtraStatusId(statusId);
    if (statusId != null) setActiveFilters((previous) => previous.filter((id) => !STATUS_PILLS.includes(id)));
  };

  const params = useMemo(() => {
    const { isCompleted, statusId } = resolveListFilters({ activeFilters, extraStatusId, canceledStatusId, returnedStatusId });
    return buildAdminOrdersParams({
      page,
      perPage,
      search,
      isCompleted,
      statusId,
      contractType: contractType || undefined,
    });
  }, [activeFilters, extraStatusId, canceledStatusId, returnedStatusId, page, perPage, search, contractType]);

  return {
    params,
    page,
    setPage,
    perPage,
    setPerPage,
    searchQuery,
    setSearchQuery,
    activeFilters,
    toggleFilter,
    extraStatusId,
    changeExtraStatus,
    contractType,
    setContractType,
  };
}
