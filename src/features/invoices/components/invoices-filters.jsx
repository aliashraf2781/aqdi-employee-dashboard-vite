import { Download } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { SelectField } from '@/shared/components/ui/select-field';
import { TextField } from '@/shared/components/ui/text-field';
import { STATUS_FILTER_OPTIONS, TYPE_FILTER_OPTIONS } from '../lib/invoice-meta';

/** Search box, status and type selects, and the CSV export button. */
export function InvoicesFilters({ filters, onChange, onExport }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-0 flex-1">
        <TextField
          label="بحث"
          placeholder="بحث برقم الفاتورة أو العقد أو الجوال.."
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
        />
      </div>
      <SelectField
        label="الحالة"
        value={filters.status}
        options={STATUS_FILTER_OPTIONS}
        onChange={(event) => onChange('status', event.target.value)}
      />
      <SelectField
        label="نوع العقد"
        value={filters.contractType}
        options={TYPE_FILTER_OPTIONS}
        onChange={(event) => onChange('contractType', event.target.value)}
      />
      <Button variant="outline" className="h-11" onClick={onExport}>
        <Download className="size-4" />
        تصدير CSV
      </Button>
    </div>
  );
}
