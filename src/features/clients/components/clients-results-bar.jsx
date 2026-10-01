import { Loader2 } from 'lucide-react';
import { SelectField } from '@/shared/components/ui/select-field';

export const PAGE_SIZE_OPTIONS = [25, 50, 100].map((size) => ({ value: size, label: String(size) }));

/** "Showing 1-25 of 90" line plus the page-size picker. */
export function ClientsResultsBar({ range, total, isFetching, pageSize, onPageSizeChange }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="inline-flex items-center gap-2 font-medium text-muted-foreground">
        {isFetching && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
        يعرض {range.start}-{range.end} من {total} عميل
      </p>
      <div className="flex items-center gap-2">
        <span className="font-medium text-muted-foreground">يعرض</span>
        <SelectField
          aria-label="عدد الصفوف"
          options={PAGE_SIZE_OPTIONS}
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        />
      </div>
    </div>
  );
}
