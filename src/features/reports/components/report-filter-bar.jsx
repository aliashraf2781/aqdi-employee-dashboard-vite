import { Button } from '@/shared/components/ui/button';
import { SelectField } from '@/shared/components/ui/select-field';
import { TextField } from '@/shared/components/ui/text-field';
import { REPORT_PERIODS } from '../lib/report-filters';

/**
 * The one filter bar for every analysis panel: period chips, a date range for
 * "custom", contract type and employee. It is fully controlled by `filters`.
 */
export function ReportFilterBar({ filters, onChange, contractTypeOptions, employeeOptions, isLoadingEmployees }) {
  const isCustomPeriod = filters.period === 'custom';

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {REPORT_PERIODS.map((period) => (
          <Button
            key={period.id}
            size="sm"
            variant={filters.period === period.id ? 'primary' : 'outline'}
            className="rounded-full"
            aria-pressed={filters.period === period.id}
            onClick={() => onChange('period', period.id)}
          >
            {period.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {isCustomPeriod && (
          <>
            <TextField
              label="من"
              type="date"
              value={filters.dateFrom}
              onChange={(event) => onChange('dateFrom', event.target.value)}
            />
            <TextField
              label="إلى"
              type="date"
              value={filters.dateTo}
              min={filters.dateFrom || undefined}
              onChange={(event) => onChange('dateTo', event.target.value)}
            />
          </>
        )}
        <SelectField
          label="نوع العقد"
          value={filters.contractType}
          options={contractTypeOptions.map(({ id, label }) => ({ value: id, label }))}
          onChange={(event) => onChange('contractType', event.target.value)}
        />
        <SelectField
          label="الموظف"
          value={filters.employee}
          disabled={isLoadingEmployees}
          options={employeeOptions.map(({ id, label }) => ({ value: id, label }))}
          onChange={(event) => onChange('employee', event.target.value)}
        />
      </div>
    </div>
  );
}
