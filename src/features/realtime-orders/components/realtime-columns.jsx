import { Button } from '@/shared/components/ui/button';
import { OrderActionsMenu, OrderNumberCell, PaymentCell, ReceivedByCell } from '@/features/orders';
import { ChangeStatusMenu } from './change-status-menu';
import { CustomerPhoneCell, DocumentTypeCell, DraftBadge, OrderStatusCell, ReceivedSinceBadge } from './realtime-cells';

function toTimestamp(value) {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

/**
 * Columns of the realtime table.
 * `statusChange` = { enabled, statuses, pendingOrderId, onChange(order, status) }.
 */
export function buildRealtimeColumns({ onView, statusChange }) {
  return [
    {
      id: 'contractType',
      label: 'نوع العقد',
      hideable: false,
      cell: (order) => <span className="font-bold">{order?.contract_type || '---'}</span>,
    },
    {
      id: 'orderNumber',
      label: 'رقم الطلب',
      hideable: false,
      cell: (order) => (
        <div className="flex flex-col items-start gap-1">
          <OrderNumberCell uuid={order?.uuid} />
          {order?.is_draft && <DraftBadge />}
        </div>
      ),
    },
    { id: 'customerPhone', label: 'جوال العميل', stopRowClick: true, cell: (order) => <CustomerPhoneCell order={order} /> },
    { id: 'documentType', label: 'نوع الوثيقة', cell: (order) => <DocumentTypeCell order={order} /> },
    { id: 'payment', label: 'الدفع', cell: (order) => <PaymentCell order={order} /> },
    {
      id: 'receivedSince',
      label: 'مستلم منذ',
      sortable: true,
      defaultSortDir: 'asc',
      getSortValue: (order) => toTimestamp(order?.received_at),
      cell: (order) => <ReceivedSinceBadge order={order} />,
    },
    { id: 'orderStatus', label: 'حالة الطلب', cell: (order) => <OrderStatusCell order={order} /> },
    { id: 'receivedBy', label: 'مستلم من', cell: (order) => <ReceivedByCell order={order} /> },
    {
      id: 'actions',
      label: 'الإجراءات',
      hideable: false,
      sticky: 'end',
      stopRowClick: true,
      cell: (order) => (
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="outline" onClick={() => onView(order)}>
            عرض
          </Button>
          {statusChange.enabled && (
            <ChangeStatusMenu
              order={order}
              statuses={statusChange.statuses}
              isPending={statusChange.pendingOrderId != null && statusChange.pendingOrderId === order.id}
              onChangeStatus={statusChange.onChange}
            />
          )}
          <OrderActionsMenu order={order} />
        </div>
      ),
    },
  ];
}
