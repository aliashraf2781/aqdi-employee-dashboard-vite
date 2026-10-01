import { CreditCard, Filter, Link2, Tags } from 'lucide-react';
import { FilterPills } from '@/features/orders';
import { IconButton } from '@/shared/components/icon-button';
import { SearchInput } from '@/shared/components/search-input';
import { Button } from '@/shared/components/ui/button';
import { TableSettingsPopover } from '@/shared/components/controllable-table';
import { LiveClockBadge } from './live-clock-badge';

/**
 * Title and controls of the realtime screen: quick filter pills, search, table settings,
 * the status-chips toggle, status management, export, payments panel and payment-link generator.
 * `filters` = { pills, activeFilters, onTogglePill, open, onToggleOpen, hasActive }.
 */
export function RealtimeToolbar({ search, filters, table, onExport, isExporting, onManageStatuses, onOpenPayments, onOpenPaymentLink }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="mb-2 text-xl font-bold text-foreground">الطلبات مباشر</h1>
        <LiveClockBadge />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterPills pills={filters.pills} activeFilters={filters.activeFilters} onToggle={filters.onTogglePill} />

        <SearchInput value={search.value} onChange={search.onChange} placeholder="بحث: رقم الطلب / الجوال / الاسم…" className="max-w-xs" />

        <TableSettingsPopover
          columns={table.columns}
          density={table.density}
          onDensityChange={table.setDensity}
          isColumnVisible={table.isColumnVisible}
          onToggleColumn={table.toggleColumn}
        />

        <IconButton label="فلاتر" active={filters.open} onClick={filters.onToggleOpen} className="relative">
          <Filter className="size-4" />
          {filters.hasActive && <span className="absolute start-1.5 top-1.5 size-2 rounded-full border-2 border-surface bg-danger" />}
        </IconButton>

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

        <IconButton label="إشعارات الدفع" onClick={onOpenPayments}>
          <CreditCard className="size-4" />
        </IconButton>

        <IconButton label="توليد رابط دفع — طلب واتساب" onClick={onOpenPaymentLink}>
          <Link2 className="size-4" />
        </IconButton>
      </div>
    </div>
  );
}
