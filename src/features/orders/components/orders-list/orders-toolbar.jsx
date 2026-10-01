import { Link2, Tags } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { IconButton } from '@/shared/components/icon-button';
import { PageHeader } from '@/shared/components/page-header';
import { SearchInput } from '@/shared/components/search-input';
import { TableSettingsPopover } from '@/shared/components/controllable-table';
import { FilterPills } from './filter-pills';
import { MoreFiltersPopover } from './more-filters-popover';

/**
 * Title and controls above an orders table: quick filters, search, table settings,
 * more filters, status management, export and the payment-link generator.
 * Optional controls (export, manage statuses, payment link) only render when their handler is given.
 */
export function OrdersToolbar({
  title,
  searchPlaceholder = 'بحث: رقم الطلب / الجوال / الاسم...',
  search,
  filters,
  table,
  onExport,
  isExporting = false,
  onManageStatuses,
  onOpenPaymentLink,
}) {
  return (
    <PageHeader
      title={title}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <FilterPills pills={filters.pills} activeFilters={filters.activeFilters} onToggle={filters.onTogglePill} />

          <SearchInput value={search.value} onChange={search.onChange} placeholder={searchPlaceholder} className="max-w-xs" />

          <TableSettingsPopover
            columns={table.columns}
            density={table.density}
            onDensityChange={table.setDensity}
            isColumnVisible={table.isColumnVisible}
            onToggleColumn={table.toggleColumn}
          />

          <MoreFiltersPopover
            statuses={filters.extraStatuses}
            extraStatusId={filters.extraStatusId}
            onExtraStatusChange={filters.onExtraStatusChange}
            contractType={filters.contractType}
            onContractTypeChange={filters.onContractTypeChange}
          />

          {onManageStatuses && (
            <IconButton label="إدارة الحالات" onClick={onManageStatuses}>
              <Tags className="size-4" />
            </IconButton>
          )}

          {onExport && (
            <Button variant="outline" onClick={onExport} disabled={isExporting}>
              {isExporting ? 'جاري التصدير...' : 'تصدير CSV'}
            </Button>
          )}

          {onOpenPaymentLink && (
            <IconButton label="توليد رابط دفع — طلب واتساب" onClick={onOpenPaymentLink}>
              <Link2 className="size-4" />
            </IconButton>
          )}
        </div>
      }
    />
  );
}
