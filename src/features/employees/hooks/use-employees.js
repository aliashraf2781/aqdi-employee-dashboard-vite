import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchEmployee, fetchEmployees } from '@/features/employees/api/employees-api';
import { employeeKeys } from '@/features/employees/hooks/query-keys';

export function useEmployees({ page, search }) {
  return useQuery({
    queryKey: employeeKeys.list(page, search),
    queryFn: () => fetchEmployees({ page, search }),
    placeholderData: keepPreviousData,
  });
}

export function useEmployee(id) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => fetchEmployee(id),
    enabled: Boolean(id),
  });
}
