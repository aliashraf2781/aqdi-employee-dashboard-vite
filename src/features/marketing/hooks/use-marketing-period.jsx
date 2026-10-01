import { createContext, useCallback, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  buildPeriodSearchParams,
  CUSTOM_PERIOD,
  PERIOD_FROM_PARAM,
  PERIOD_PARAM,
  PERIOD_TO_PARAM,
  resolvePeriod,
} from '@/features/marketing/lib/period';

const MarketingPeriodContext = createContext(null);

/**
 * Keeps the period filter in the url (`?mkt_period=` ...) so it survives tab changes.
 * One provider wraps the active tab; every tracking hook and the filter bar read the same value.
 */
export function MarketingPeriodProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawPeriod = searchParams.get(PERIOD_PARAM);
  const rawFrom = searchParams.get(PERIOD_FROM_PARAM);
  const rawTo = searchParams.get(PERIOD_TO_PARAM);

  const { period, dateFrom, dateTo, isCustom, queryParams } = useMemo(
    () => resolvePeriod({ rawPeriod, rawFrom, rawTo }),
    [rawPeriod, rawFrom, rawTo],
  );

  const commit = useCallback(
    (next) => setSearchParams((params) => buildPeriodSearchParams(params, next), { replace: true }),
    [setSearchParams],
  );

  const setPeriod = useCallback(
    (key) => commit(key === CUSTOM_PERIOD ? { period: key, dateFrom, dateTo } : { period: key }),
    [commit, dateFrom, dateTo],
  );
  const setRange = useCallback((from, to) => commit({ period: CUSTOM_PERIOD, dateFrom: from || null, dateTo: to || null }), [commit]);

  const value = useMemo(
    () => ({ period, dateFrom, dateTo, isCustom, queryParams, setPeriod, setRange }),
    [period, dateFrom, dateTo, isCustom, queryParams, setPeriod, setRange],
  );

  return <MarketingPeriodContext.Provider value={value}>{children}</MarketingPeriodContext.Provider>;
}

export function useMarketingPeriod() {
  const context = useContext(MarketingPeriodContext);
  if (!context) throw new Error('useMarketingPeriod must be used inside <MarketingPeriodProvider>');
  return context;
}
