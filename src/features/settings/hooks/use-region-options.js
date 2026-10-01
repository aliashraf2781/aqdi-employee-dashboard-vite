import { useQuery } from '@tanstack/react-query';
import { fetchPlainList } from '@/features/settings/api/list-fetchers';
import { REGIONS_QUERY_KEY, REGIONS_PATH } from '@/features/settings/configs/regions-config';

const toOption = (region) => ({ value: String(region.id), label: region.name_ar });

/** Region dropdown options for the city form. Shares the `regions` cache key so edits refresh it. */
export function useRegionOptions() {
  const { data } = useQuery({
    queryKey: [REGIONS_QUERY_KEY, 'options'],
    queryFn: () => fetchPlainList(REGIONS_PATH),
  });
  return (data?.rows ?? []).map(toOption);
}
