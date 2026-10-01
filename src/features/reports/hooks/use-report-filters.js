import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_FILTER_VALUE } from '../lib/report-filters';

const PARAM_BY_FILTER = {
  period: 'period',
  dateFrom: 'date_from',
  dateTo: 'date_to',
  contractType: 'contract_type',
  employee: 'employee_id',
};
const DEFAULTS = {
  period: DEFAULT_FILTER_VALUE,
  dateFrom: '',
  dateTo: '',
  contractType: DEFAULT_FILTER_VALUE,
  employee: DEFAULT_FILTER_VALUE,
};

/**
 * The filter bar state lives in the URL (?period=&contract_type=...) so a report
 * can be shared and survives a refresh. Leaving "custom" clears the dates.
 */
export function useReportFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const values = {};
    for (const [filterName, paramName] of Object.entries(PARAM_BY_FILTER)) {
      values[filterName] = searchParams.get(paramName) ?? DEFAULTS[filterName];
    }
    return values;
  }, [searchParams]);

  const setFilter = useCallback(
    (filterName, value) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set(PARAM_BY_FILTER[filterName], value);
          if (filterName === 'period' && value !== 'custom') {
            next.delete(PARAM_BY_FILTER.dateFrom);
            next.delete(PARAM_BY_FILTER.dateTo);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { filters, setFilter };
}
