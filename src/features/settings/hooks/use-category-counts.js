import { useQueries } from '@tanstack/react-query';
import { CATEGORY_COUNT_SOURCES } from '@/features/settings/configs/category-count-sources';

const COUNT_STALE_TIME_MS = 30_000;
const FIRST_PAGE = 1;

/**
 * Row counts for the hub cards, keyed by category id.
 * A count is `null` while loading and `undefined` when it could not be loaded.
 */
export function useCategoryCounts(categoryIds) {
  const countedIds = categoryIds.filter((id) => CATEGORY_COUNT_SOURCES[id]);

  const results = useQueries({
    queries: countedIds.map((id) => ({
      queryKey: ['settings-category-count', id],
      queryFn: async () => (await CATEGORY_COUNT_SOURCES[id].fetchRows({ page: FIRST_PAGE, filters: {} })).total,
      staleTime: COUNT_STALE_TIME_MS,
      retry: false,
    })),
  });

  return Object.fromEntries(
    countedIds.map((id, index) => {
      const { data, isError } = results[index];
      return [id, isError ? undefined : (data ?? null)];
    }),
  );
}
