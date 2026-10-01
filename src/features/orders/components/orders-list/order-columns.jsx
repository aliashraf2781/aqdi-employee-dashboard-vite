import { FileText } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { IconButton } from '@/shared/components/icon-button';
import { OrderActionsMenu } from './order-actions-menu';
import { OrderNumberCell, PaymentCell, ReceivedByCell, ReceivedSinceCell } from './order-table-cells';

function toTimestamp(value) {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

/**
 * Columns of the all-orders table.
 * `onView(order)` opens the details page, `onPrint(order)` prints the contract (paid orders only).
 */
export function buildOrderColumns({ onView, onPrint }) {
  return [
    {
      id: 'contractType',
      label: 'نوع العقد',
      hideable: false,
      sticky: 'start',
      cell: (order) => <span className="font-bold">{order?.contract_type || '---'}</span>,
    },
    {
      id: 'orderNumber',
      label: 'رقم الطلب',
      hideable: false,
      cell: (order) => <OrderNumberCell uuid={order?.uuid} />,
    },
    { id: 'payment', label: 'الدفع', cell: (order) => <PaymentCell order={order} /> },
    {
      id: 'receivedSince',
      label: 'مستلم منذ',
      sortable: true,
      defaultSortDir: 'asc',
      getSortValue: (order) => toTimestamp(order?.received_at),
      cell: (order) => <ReceivedSinceCell order={order} />,
    },
    { id: 'receivedBy', label: 'مستلم من', cell: (order) => <ReceivedByCell order={order} /> },
    {
      id: 'actions',
      label: 'الإجراءات',
      hideable: false,
      sticky: 'end',
      stopRowClick: true,
      cell: (order) => {
        const canPrint = order?.is_paid === true || order?.is_paid === 1;
        return (
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="outline" onClick={() => onView(order)}>
              عرض
            </Button>
            <OrderActionsMenu order={order} />
            {canPrint && (
              <IconButton label="طباعة العقد" className="size-8 rounded-lg" onClick={() => onPrint(order)}>
                <FileText className="size-4" />
              </IconButton>
            )}
          </div>
        );
      },
    },
  ];
}
