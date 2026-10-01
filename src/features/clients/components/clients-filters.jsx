import { Download, Loader2, Search } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { SelectField } from '@/shared/components/ui/select-field';
import { TextField } from '@/shared/components/ui/text-field';

const PLATFORM_OPTIONS = [
  { value: 'all', label: 'كل المصادر' },
  { value: 'website', label: 'عملاء الموقع' },
  { value: 'google_play', label: 'جوجل بلاي' },
  { value: 'apple_store', label: 'آبل' },
];

const CREATED_AT_OPTIONS = [
  { value: 'all', label: 'كل الفترات' },
  { value: 'today', label: 'اليوم' },
  { value: 'week', label: 'هذا الأسبوع' },
  { value: 'month', label: 'هذا الشهر' },
  { value: 'year', label: 'هذه السنة' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'كل الحالات' },
  { value: 'active', label: 'نشط' },
  { value: 'inactive', label: 'موقوف' },
  { value: 'banned', label: 'محظور' },
];

/** Search box, export button and the three dropdown filters. Fully controlled by the page. */
export function ClientsFilters({ searchInput, onSearchChange, filters, onFilterChange, onExport, isExporting }) {
  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-3 size-4 text-muted-foreground" aria-hidden />
          <TextField
            aria-label="بحث"
            value={searchInput}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="بحث بالاسم أو الجوال أو الإيميل أو رقم العميل"
            className="ps-10"
          />
        </div>
        <Button variant="outline" size="lg" onClick={onExport} disabled={isExporting}>
          {isExporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          {isExporting ? 'جارٍ التصدير...' : 'تصدير'}
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <SelectField
          aria-label="المصدر"
          options={PLATFORM_OPTIONS}
          value={filters.platform}
          onChange={(event) => onFilterChange('platform', event.target.value)}
        />
        <SelectField
          aria-label="الفترة"
          options={CREATED_AT_OPTIONS}
          value={filters.createdAt}
          onChange={(event) => onFilterChange('createdAt', event.target.value)}
        />
        <SelectField
          aria-label="الحالة"
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(event) => onFilterChange('status', event.target.value)}
        />
      </div>
    </div>
  );
}
