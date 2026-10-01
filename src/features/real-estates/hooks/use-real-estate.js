import { useQuery } from '@tanstack/react-query';
import { getRealEstate } from '@/features/real-estates/api/real-estates-api';

export const REAL_ESTATE_QUERY_KEY = 'real-estate';

export function useRealEstate(id) {
  return useQuery({
    queryKey: [REAL_ESTATE_QUERY_KEY, id],
    queryFn: () => getRealEstate(id),
    enabled: Boolean(id),
  });
}
