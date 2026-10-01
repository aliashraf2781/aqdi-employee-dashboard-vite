import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '@/features/clients/api/clients-api';
import { mapUserToClientRow } from '@/features/clients/lib/client-mapper';
import { clientsKeys } from '@/features/clients/hooks/query-keys';

/**
 * One client with their contracts. The detail, properties and discount screens
 * all call this, so they share a single cached request.
 * `user` is the raw payload for screens that need fields the row mapper drops.
 */
export function useClientDetail(clientId) {
  const query = useQuery({
    queryKey: clientsKeys.detail(clientId),
    queryFn: () => fetchClient(clientId),
    enabled: clientId != null && clientId !== '',
  });

  const client = query.data ? mapUserToClientRow(query.data) : null;

  return {
    user: query.data ?? null,
    client,
    contracts: client?.contracts ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
