import { useQuery } from '@tanstack/react-query';
import { fetchClientCoupons } from '@/features/clients/api/client-coupons-api';
import { findActiveCoupon } from '@/features/clients/lib/coupons';
import { clientsKeys } from '@/features/clients/hooks/query-keys';

const NO_COUPONS = [];

export function useClientCoupons(clientId) {
  const query = useQuery({
    queryKey: clientsKeys.coupons(clientId),
    queryFn: () => fetchClientCoupons(clientId),
    enabled: clientId != null && clientId !== '',
  });

  const coupons = query.data ?? NO_COUPONS;

  return {
    coupons,
    activeCoupon: findActiveCoupon(coupons),
    isLoading: query.isLoading,
  };
}
