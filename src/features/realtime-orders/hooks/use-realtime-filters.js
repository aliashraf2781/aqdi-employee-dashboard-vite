import { useMemo, useState } from 'react';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { buildRealtimeListParams } from '../lib/realtime-sections';

export const REALTIME_DEFAULT_PER_PAGE = 25;

/**
 * Search, section, status chip, contract type and paging state of the realtime table,
 * plus the API params built from them. Any filter change sends the user back to page 1.
 */
export function useRealtimeFilters({ statusIds, canViewReceivedQueue }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(null);
  const [extraStatusId, setExtraStatusId] = useState(null);
  const [contractType, setContractType] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(REALTIME_DEFAULT_PER_PAGE);
  const search = useDebouncedValue(searchQuery.trim());

  const resetKey = JSON.stringify([search, activeSection, extraStatusId, contractType, perPage]);
  const [previousResetKey, setPreviousResetKey] = useState(resetKey);
  if (resetKey !== previousResetKey) {
    setPreviousResetKey(resetKey);
    setPage(1);
  }

  const toggleSection = (sectionId) => {
    setExtraStatusId(null);
    setSearchQuery('');
    setFiltersOpen(false);
    setActiveSection((previous) => (previous === sectionId ? null : sectionId));
  };

  const closeSection = () => {
    setActiveSection(null);
    setSearchQuery('');
  };

  const changeExtraStatus = (statusId) => {
    setExtraStatusId(statusId);
    if (statusId != null) setActiveSection(null);
  };

  const params = useMemo(
    () =>
      buildRealtimeListParams({
        activeSection,
        extraStatusId,
        contractType,
        search,
        page,
        perPage,
        statusIds,
        canViewReceivedQueue,
      }),
    [activeSection, extraStatusId, contractType, search, page, perPage, statusIds, canViewReceivedQueue],
  );

  return {
    params,
    searchQuery,
    setSearchQuery,
    activeSection,
    toggleSection,
    closeSection,
    extraStatusId,
    changeExtraStatus,
    contractType,
    setContractType,
    filtersOpen,
    toggleFiltersOpen: () => setFiltersOpen((open) => !open),
    hasInlineFilters: extraStatusId != null || Boolean(contractType),
    page,
    setPage,
    perPage,
    setPerPage,
  };
}
