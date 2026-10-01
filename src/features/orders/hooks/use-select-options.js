import { getOrderAddressStep, resolveOrderContractTypeKey } from '../lib/order-detail-steps';
import { getOptionsSource } from '../lib/contract-form/select-options';
import {
  useCities,
  useContractPeriodsForType,
  usePaymentTypes,
  usePropertyTypes,
  usePropertyUsages,
  useRegions,
  useTenantRoles,
  useUnitTypes,
  useUnitUsages,
} from './use-reference-data';

/**
 * Options of a select field of the contract editor: its fixed options, or the reference list
 * it names. Only the list the field needs is requested; cities follow the chosen region.
 */
export function useSelectOptions(field, orderData, formValues) {
  const contractType = resolveOrderContractTypeKey(orderData) || 'housing';
  const source = getOptionsSource(field);
  const regionId = formValues?.property_place_id ?? getOrderAddressStep(orderData)?.property_place_id ?? orderData?.property_place_id ?? null;
  const wants = (name) => source === name;

  const lists = {
    'tenant-roles': useTenantRoles(wants('tenant-roles')),
    'payment-types': usePaymentTypes(contractType, wants('payment-types')),
    'contract-periods': useContractPeriodsForType(contractType, { enabled: wants('contract-periods') }),
    regions: useRegions(wants('regions')),
    cities: useCities({ enabled: wants('cities'), regionId: wants('cities') ? regionId : null }),
    'unit-types': useUnitTypes(contractType, wants('unit-types')),
    'unit-usages': useUnitUsages(contractType, wants('unit-usages')),
    'property-types': usePropertyTypes(contractType, wants('property-types')),
    'property-usages': usePropertyUsages(contractType, wants('property-usages')),
  };

  if (Array.isArray(field?.options) && field.options.length > 0) return { options: field.options, isLoading: false };
  const list = lists[source];
  return list ? { options: list.options, isLoading: list.isLoading } : { options: field?.options ?? [], isLoading: false };
}
