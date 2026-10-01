import { FileText } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/shared/components/card';
import { DataTable } from '@/shared/components/data-table';
import { Pagination } from '@/shared/components/pagination';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { orderPath, withFrom } from '@/features/clients/lib/client-paths';
import { ORDER_FILTER_TABS, countOrdersByStatus } from '@/features/clients/lib/order-status';
import { paginate } from '@/features/clients/lib/pagination';

const ORDERS_PAGE_SIZE = 10;

function StatusCell({ order }) {
  const name = order.status?.name || order.status_name || '—';
  // The status color is data configured in the back office, so it can only be applied inline.
  const dynamicColor = order.status?.color ? { color: order.status.color } : undefined;

  return (
    <span className="font-bold text-muted-foreground" style={dynamicColor}>
      {name}
    </span>
  );
}

function buildColumns(returnTo) {
  return [
    { key: 'id', header: 'الطلب', cell: (order) => <span className="font-bold tabular-nums">#{order.id}</span> },
    { key: 'type', header: 'النوع', cell: (order) => order.contract_type || '—' },
    { key: 'status', header: 'الحالة', cell: (order) => <StatusCell order={order} /> },
    { key: 'payment', header: 'حالة الدفع', cell: (order) => order.payment_label_ar || '—' },
    {
      key: 'open',
      header: '',
      cell: (order) => (
        <Button asChild variant="outline" size="sm">
          <Link to={withFrom(orderPath(order.id), returnTo)}>فتح</Link>
        </Button>
      ),
    },
  ];
}

/** The client's contracts, filterable by status tab and paged locally (the API returns them all at once). */
export function ClientOrdersSection({ orders, returnTo }) {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const counts = countOrdersByStatus(orders);
  const filtered = filter === 'all' ? orders : orders.filter((order) => order.statusKey === filter);
  const pageWindow = paginate(filtered, page, ORDERS_PAGE_SIZE);

  const changeFilter = (nextFilter) => {
    setFilter(nextFilter);
    setPage(1);
  };

  return (
    <Card className="p-0">
      <div className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="inline-flex items-center gap-2 font-bold text-foreground">
          <FileText className="size-4 text-primary" aria-hidden />
          طلبات العميل
        </h3>
        <p className="text-xs font-medium text-muted-foreground">
          إجمالي طلبات العميل: <span className="font-bold tabular-nums text-foreground">{orders.length}</span>
        </p>
      </div>

      <div className="overflow-x-auto px-5 pb-4">
        <Tabs value={filter} onValueChange={changeFilter}>
          <TabsList>
            {ORDER_FILTER_TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label} <span className="tabular-nums">({counts[tab.id]})</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <DataTable columns={buildColumns(returnTo)} rows={pageWindow.items} emptyMessage="لا توجد طلبات في هذا التصنيف" />

      {filtered.length > 0 && (
        <div className="px-5 pb-4">
          <p className="mt-3 text-center text-sm text-muted-foreground">
            يعرض {pageWindow.start}-{pageWindow.end} من {filtered.length} طلب
          </p>
          <Pagination page={pageWindow.currentPage} lastPage={pageWindow.lastPage} onPageChange={setPage} />
        </div>
      )}
    </Card>
  );
}
