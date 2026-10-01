import { TextField } from '@/shared/components/ui/text-field';
import { PillButtons } from '@/features/marketing/components/shared/pill-buttons';
import { useMarketingPeriod } from '@/features/marketing/hooks/use-marketing-period';
import { MARKETING_PERIODS } from '@/features/marketing/lib/period';

const toOption = (period) => ({ value: period.key, label: period.label_ar || period.label || period.key });

/** Period pills (+ date pickers for a custom range). The selection lives in the url. */
export function PeriodFilterBar({ periods }) {
  const { period, dateFrom, dateTo, isCustom, setPeriod, setRange } = useMarketingPeriod();
  // Prefer the labels sent by the API, fall back to the standard list.
  const options = (Array.isArray(periods) && periods.length ? periods : MARKETING_PERIODS).map(toOption);

  return (
    <div className="mb-4 flex flex-wrap items-end gap-4">
      <PillButtons options={options} value={period} onChange={setPeriod} label="الفترة" />
      {isCustom && (
        <div className="flex items-end gap-3">
          <TextField type="date" label="من" value={dateFrom || ''} max={dateTo || undefined} onChange={(event) => setRange(event.target.value, dateTo)} />
          <TextField type="date" label="إلى" value={dateTo || ''} min={dateFrom || undefined} onChange={(event) => setRange(dateFrom, event.target.value)} />
        </div>
      )}
    </div>
  );
}
