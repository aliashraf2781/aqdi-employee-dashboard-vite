import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchFilterEmployees } from '../api/reports-api';
import { buildEmployeeOptions, CONTRACT_TYPE_OPTIONS } from '../lib/report-filters';

const FIVE_MINUTES = 5 * 60 * 1000;

/** Options for the filter bar: employees come from the API, contract types are fixed. */
export function useReportFilterOptions() {
  const { data: employees, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['report-filter-employees'],
    queryFn: fetchFilterEmployees,
    staleTime: FIVE_MINUTES,
  });

  const employeeOptions = useMemo(() => buildEmployeeOptions(employees), [employees]);

  return { contractTypeOptions: CONTRACT_TYPE_OPTIONS, employeeOptions, isLoadingEmployees };
}
