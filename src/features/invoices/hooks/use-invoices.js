import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchInvoices } from '../api/payments-api';

export const INVOICES_QUERY_KEY = ['invoices-payments'];

export function useInvoices() {
  return useQuery({ queryKey: INVOICES_QUERY_KEY, queryFn: fetchInvoices, placeholderData: keepPreviousData });
}
