import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { TextField } from '@/shared/components/ui/text-field';
import { CUSTOM_PERIOD } from '@/features/employees/lib/kpi-periods';

/** Period tabs, plus the from/to date pickers when "مدة محددة" is chosen. */
export function KpiFilters({ periods, period, dateFrom, dateTo, onPeriodChange, onDateFromChange, onDateToChange }) {
  return (
    <div className="flex flex-col gap-3">
      <Tabs value={period} onValueChange={onPeriodChange}>
        <TabsList>
          {periods.map((item) => (
            <TabsTrigger key={item.key} value={item.key}>
              {item.label_ar}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {period === CUSTOM_PERIOD && (
        <div className="flex flex-wrap items-end gap-3">
          <TextField label="من" type="date" value={dateFrom} onChange={(event) => onDateFromChange(event.target.value)} />
          <TextField label="إلى" type="date" value={dateTo} min={dateFrom || undefined} onChange={(event) => onDateToChange(event.target.value)} />
        </div>
      )}
    </div>
  );
}
