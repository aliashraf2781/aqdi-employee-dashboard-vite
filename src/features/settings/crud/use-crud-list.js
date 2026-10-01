import { keepPreviousData, useQuery } from '@tanstack/react-query';

/** Loads one page of a CRUD config's list. Re-fetches when the page or filters change. */
export function useCrudList(config, { page, filters }) {
  return useQuery({
    queryKey: [config.queryKey, page, filters],
    queryFn: () => config.fetchRows({ page, filters }),
    placeholderData: keepPreviousData,
  });
}
