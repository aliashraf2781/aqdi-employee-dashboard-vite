import { FileText } from 'lucide-react';
import { OrderActionsMenu, PaymentCell, ReceivedByCell, ReceivedSinceCell } from '@/features/orders';
import { Button } from '@/shared/components/ui/button';
import { IconButton } from '@/shared/components/icon-button';
import { AdminApprovalCell } from './admin-approval-cell';
import {
  ContractTypeCell,
  CustomerMobileCell,
  InstrumentTypeCell,
  OrderNumberWithStatusDot,
  OrderStatusCell,
  SendSmsButton,
} from './return-order-cells';

function toTimestamp(value) {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

const isPaidOrder = (order) => order?.is_paid === true || order?.is_paid === 1;

/**
 * Columns of the return-orders table.
 * `onView(order)` opens the details page, `onPrint(order)` prints the contract (paid orders only),
 * `onApproved(refund)` runs after the admin approved a refund from the approval cell.
 */
export function buildReturnOrderColumns({ onView, onPrint, refundsLookup, refundItems, onApproved }) {
  return [
    { id: 'orderNumber', label: 'رقم الطلب', hideable: false, cell: (order) => <OrderNumberWithStatusDot order={order} /> },
    { id: 'customerMobile', label: 'جوال العميل', cell: (order) => <CustomerMobileCell order={order} /> },
    { id: 'contractType', label: 'نوع العقد', cell: (order) => <ContractTypeCell order={order} /> },
    { id: 'instrumentType', label: 'نوع الوثيقة', cell: (order) => <InstrumentTypeCell order={order} /> },
    { id: 'payment', label: 'الدفع', cell: (order) => <PaymentCell order={order} /> },
    {
      id: 'receivedSince',
      label: 'مستلم منذ',
      sortable: true,
      defaultSortDir: 'asc',
      getSortValue: (order) => toTimestamp(order?.received_at),
      cell: (order) => <ReceivedSinceCell order={order} />,
    },
    { id: 'orderStatus', label: 'حالة الطلب', cell: (order) => <OrderStatusCell order={order} /> },
    { id: 'receivedBy', label: 'مستلم من', cell: (order) => <ReceivedByCell order={order} /> },
    {
      id: 'adminApproval',
      label: 'موافقة الإدارة',
      stopRowClick: true,
      cell: (order) => <AdminApprovalCell row={order} refundsLookup={refundsLookup} refundItems={refundItems} onApproved={onApproved} />,
    },
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
          <OrderActionsMenu order={order} />
          <SendSmsButton order={order} />
          {isPaidOrder(order) && (
            <IconButton label="طباعة العقد" className="size-8 rounded-lg" onClick={() => onPrint(order)}>
              <FileText className="size-4" />
            </IconButton>
          )}
        </div>
      ),
    },
  ];
}
