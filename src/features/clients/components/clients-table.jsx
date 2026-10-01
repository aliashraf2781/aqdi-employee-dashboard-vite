import { ArrowDown, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { DataTable } from '@/shared/components/data-table';
import { ClientStatusBadges } from '@/features/clients/components/client-status-badges';
import { CountBadge } from '@/features/clients/components/count-badge';
import { MoneyPill } from '@/features/clients/components/money-pill';
import { splitJoinedDateTime } from '@/features/clients/lib/client-details-format';
import { CLIENTS_PATH, clientPath, withFrom } from '@/features/clients/lib/client-paths';

function JoinedDateCell({ client }) {
  const { time, date } = splitJoinedDateTime(client.joinedAt);
  return (
    <div className="flex flex-col gap-1 tabular-nums">
      <span className="font-semibold text-foreground">{time}</span>
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
  );
}

function buildColumns({ sortDirection, onToggleSort }) {
  const SortIcon = sortDirection === 'asc' ? ArrowUp : ArrowDown;
  const centered = 'text-center';

  return [
    {
      key: 'joinedAt',
      header: (
        <button
          type="button"
          onClick={onToggleSort}
          title="ترتيب حسب تاريخ الانضمام"
          className="inline-flex items-center gap-1 text-primary"
        >
          تاريخ الانضمام
          <SortIcon className="size-3" aria-hidden />
        </button>
      ),
      cell: (client) => <JoinedDateCell client={client} />,
    },
    {
      key: 'clientCode',
      header: 'رقم العميل',
      cell: (client) => <span className="font-bold tabular-nums text-primary">{client.clientCode}</span>,
    },
    {
      key: 'name',
      header: 'اسم العميل',
      cell: (client) => (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-foreground">{client.name}</span>
          <ClientStatusBadges client={client} />
        </div>
      ),
    },
    {
      key: 'mobile',
      header: 'رقم الجوال',
      cell: (client) => (
        <span dir="ltr" className="tabular-nums">
          {client.mobile}
        </span>
      ),
    },
    { key: 'completed', header: 'مكتمل', className: centered, cell: (c) => <CountBadge value={c.completed} tone="success" /> },
    { key: 'incomplete', header: 'غير مكتمل', className: centered, cell: (c) => <CountBadge value={c.incomplete} tone="warning" /> },
    { key: 'properties', header: 'عقارات', className: centered, cell: (c) => <CountBadge value={c.properties} tone="warning" /> },
    { key: 'units', header: 'وحدات', className: centered, cell: (c) => <CountBadge value={c.units} tone="success" /> },
    { key: 'refunded', header: 'مسترجع', className: centered, cell: (c) => <MoneyPill value={c.refundedAmount} /> },
    { key: 'paid', header: 'مدفوع', className: centered, cell: (c) => <MoneyPill value={c.paid} /> },
    { key: 'net', header: 'صافي', className: centered, cell: (c) => <MoneyPill value={c.net} /> },
    {
      key: 'view',
      header: 'عرض',
      className: centered,
      cell: (client) => (
        <Button asChild variant="outline" size="sm">
          <Link to={withFrom(clientPath(client.id), CLIENTS_PATH)}>عرض</Link>
        </Button>
      ),
    },
  ];
}

export function ClientsTable({ rows, isLoading, sortDirection, onToggleSort }) {
  return (
    <DataTable
      columns={buildColumns({ sortDirection, onToggleSort })}
      rows={rows}
      isLoading={isLoading}
      emptyMessage="لا يوجد عملاء مطابقون لبحثك"
    />
  );
}
