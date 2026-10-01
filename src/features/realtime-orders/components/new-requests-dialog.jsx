import { Plus, RefreshCw } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { ExpandableDialog } from '@/shared/components/expandable-dialog';
import { NewRequestCard } from './new-request-card';
import { NewRequestStatCard } from './new-request-stat-card';

const CARD_TONE = { total_new_orders: 'primary', exceeded_15_minutes: 'warning', exceeded_30_minutes: 'danger' };
const SKELETON_COUNT = 10;

function SummaryCards({ cards, total }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((card, index) => {
        const isTotal = card.key === 'total_new_orders' || index === 0;
        const count = card.count ?? 0;
        return (
          <NewRequestStatCard
            key={card.key || card.label}
            value={count}
            total={isTotal ? Math.max(count, 1) : total}
            label={card.label}
            hint={isTotal ? 'بانتظار الاستلام' : `${count} من ${total} طلباً`}
            tone={isTotal ? 'primary' : (CARD_TONE[card.key] ?? 'warning')}
          />
        );
      })}
    </div>
  );
}

function OrdersGrid({ orders, isLoading, canReceive, onReceive, receivingId }) {
  if (isLoading) {
    return Array.from({ length: SKELETON_COUNT }, (_, index) => (
      <div key={index} className="h-32 animate-pulse rounded-xl border border-border bg-surface" />
    ));
  }

  if (orders.length === 0) {
    return <p className="col-span-full py-10 text-center text-sm font-medium text-muted-foreground">لا توجد طلبات جديدة بانتظار الاستلام</p>;
  }

  return orders.map((order) => (
    <NewRequestCard
      key={order.id}
      order={order}
      dense
      className="min-w-0"
      onReceive={canReceive ? onReceive : undefined}
      receiving={receivingId != null && receivingId === order.id}
    />
  ));
}

/** Every new order as a card, with the summary counters and the auto-refresh switch. */
export function NewRequestsDialog({ open, onOpenChange, orders, total, cards, isLoading, autoRefresh, onAutoRefreshChange, ...cardActions }) {
  const refreshButton = (
    <button
      type="button"
      onClick={() => onAutoRefreshChange(!autoRefresh)}
      className={cn(
        'flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-colors',
        autoRefresh ? 'bg-surface text-primary' : 'bg-sidebar-hover text-sidebar-foreground hover:bg-sidebar-dark',
      )}
    >
      <RefreshCw className={cn('size-3.5', autoRefresh && 'animate-spin')} />
      تحديث تلقائي
    </button>
  );

  return (
    <ExpandableDialog
      open={open}
      onOpenChange={onOpenChange}
      title="الطلبات الجديدة"
      description={`${total} طلب بانتظار الاستلام`}
      icon={<Plus className="size-4" />}
      headerActions={refreshButton}
    >
      <SummaryCards cards={cards} total={total} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        <OrdersGrid orders={orders} isLoading={isLoading} {...cardActions} />
      </div>
    </ExpandableDialog>
  );
}
