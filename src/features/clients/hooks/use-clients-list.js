import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchClients } from '@/features/clients/api/clients-api';
import { mapUserToClientRow } from '@/features/clients/lib/client-mapper';
import { buildClientsQueryParams } from '@/features/clients/lib/clients-query';
import { clientsKeys } from '@/features/clients/hooks/query-keys';

const EMPTY_META = { currentPage: 1, lastPage: 1, total: 0, perPage: 0 };

/** Paged, filterable clients list. `filters` follows `buildClientsQueryParams`. */
export function useClientsList(filters) {
  const params = buildClientsQueryParams(filters);

  const query = useQuery({
    queryKey: clientsKeys.list(params),
    queryFn: () => fetchClients(filters),
    placeholderData: keepPreviousData,
  });

  return {
    rows: (query.data?.items ?? []).map(mapUserToClientRow),
    meta: query.data?.meta ?? EMPTY_META,
    summary: query.data?.summary ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
  };
}
