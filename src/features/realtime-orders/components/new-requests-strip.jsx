import { ChevronLeft, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { NewRequestCard } from './new-request-card';

const SKELETON_COUNT = 7;

function CardsRow({ orders, isLoading, canReceive, onReceive, receivingId }) {
  if (isLoading) {
    return Array.from({ length: SKELETON_COUNT }, (_, index) => (
      <div key={index} className="h-32 min-w-48 shrink-0 animate-pulse rounded-xl border border-border bg-surface" />
    ));
  }

  if (orders.length === 0) {
    return <p className="w-full py-6 text-center text-sm font-medium text-muted-foreground">لا توجد طلبات جديدة بانتظار الاستلام</p>;
  }

  return orders.map((order) => (
    <NewRequestCard
      key={order.id}
      order={order}
      onReceive={canReceive ? onReceive : undefined}
      receiving={receivingId != null && receivingId === order.id}
    />
  ));
}

/** Always-visible strip with the first new orders and the entry to the full dialog. */
export function NewRequestsStrip({ preview, total, isLoading, canReceive, onReceive, receivingId, onExpand }) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-accent p-3">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Plus className="size-4" />
          </span>
          <h2 className="truncate text-base font-black text-accent-foreground">
            طلبات جديدة
            <span className="mx-1.5 font-bold text-muted-foreground">–</span>
            <span className="font-bold text-muted-foreground">{total} طلب</span>
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-xs font-bold text-muted-foreground sm:inline">إجمالي الطلبات : {total}</span>
          <Button size="sm" className="rounded-full" onClick={onExpand}>
            عرض المزيد
            <ChevronLeft className="size-4" />
          </Button>
        </div>
      </div>

      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        <CardsRow orders={preview} isLoading={isLoading} canReceive={canReceive} onReceive={onReceive} receivingId={receivingId} />
      </div>
    </section>
  );
}
