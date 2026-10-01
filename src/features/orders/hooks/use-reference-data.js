import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchContractPeriods, fetchReferenceList, fetchTenantRoles } from '../api/reference-api';
import { mapContractPeriodsToOptions } from '../lib/contract-periods';
import {
  getCityRegionId,
  mapCitiesToOptions,
  mapReferenceToOptions,
  mapTenantRolesToOptions,
} from '../lib/reference-options';

const REFERENCE_STALE_TIME = 60_000;
const TENANT_ROLES_STALE_TIME = 5 * 60_000;
// A stable empty list, so effects depending on `items` do not re-run while loading.
const EMPTY_LIST = [];

/** A reference list (cities, unit types, ...) as `{ items, options, isLoading }`. */
function useReferenceList({ queryKey, endpoint, params, enabled = true, toOptions = mapReferenceToOptions }) {
  const query = useQuery({
    queryKey,
    queryFn: () => fetchReferenceList(endpoint, params),
    enabled,
    staleTime: REFERENCE_STALE_TIME,
  });
  const items = query.data ?? EMPTY_LIST;
  return { items, options: toOptions(items), isLoading: query.isLoading };
}

export const useRegions = (enabled = true) =>
  useReferenceList({ queryKey: ['regions'], endpoint: '/admin/regions', params: { per_page: 200 }, enabled });

export function useCities({ enabled = true, regionId = null } = {}) {
  const { items, isLoading } = useReferenceList({
    queryKey: ['cities'],
    endpoint: '/admin/cities',
    params: { per_page: 500 },
    enabled,
  });

  const regionKey = regionId == null || regionId === '' ? null : String(regionId);
  const cities = useMemo(
    () => (regionKey ? items.filter((city) => String(getCityRegionId(city)) === regionKey) : items),
    [items, regionKey],
  );

  return { items: cities, options: mapCitiesToOptions(cities), isLoading };
}

const byContractType = (name, endpoint) => (contractType, enabled = true) =>
  useReferenceList({
    queryKey: [name, contractType],
    endpoint,
    params: { contract_type: contractType, per_page: 200 },
    enabled: enabled && Boolean(contractType),
  });

export const usePropertyTypes = byContractType('property-types', '/admin/real-estate-types');
export const usePropertyUsages = byContractType('property-usages', '/admin/real-estate-usages');
export const useUnitTypes = byContractType('unit-types', '/admin/unit-types');
export const useUnitUsages = byContractType('unit-usages', '/admin/unit-usages');

export const usePaymentTypes = (contractType, enabled = true) =>
  useReferenceList({
    queryKey: ['payment-types', contractType],
    endpoint: '/admin/payment-types',
    params: { contract_type: contractType, per_page: 100 },
    enabled: enabled && Boolean(contractType),
  });

/** Contract periods of one contract type (optionally only those of an instrument type). */
export function useContractPeriodsForType(contractType, { instrumentType = null, enabled = true } = {}) {
  const query = useQuery({
    queryKey: ['contract-periods', contractType || 'all', instrumentType || 'any'],
    queryFn: () => fetchContractPeriods(contractType),
    enabled: enabled && Boolean(contractType),
    staleTime: REFERENCE_STALE_TIME,
  });

  const items = (query.data ?? EMPTY_LIST).filter(
    (period) => !instrumentType || !period?.instrument_type || String(period.instrument_type) === String(instrumentType),
  );

  return { items, options: mapContractPeriodsToOptions(items), isLoading: query.isLoading };
}

export function useTenantRoles(enabled = true) {
  const query = useQuery({
    queryKey: ['tenant-roles'],
    queryFn: fetchTenantRoles,
    enabled,
    staleTime: TENANT_ROLES_STALE_TIME,
  });
  const items = query.data ?? [];
  return { items, options: mapTenantRolesToOptions(items), isLoading: query.isLoading, isError: query.isError };
}
