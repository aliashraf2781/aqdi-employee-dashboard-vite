import { Modal } from '@/shared/components/modal';
import { OrderGroupsLayout } from './order-groups-layout';

/** Read-only, larger view of all the order data ("عرض مكبّر"). */
export function ContractExpandedViewDialog({ open, onOpenChange, order }) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={`عرض مكبّر — عقد #${order?.uuid ?? '—'}`}
      description={order ? `${order.contract_type} — ${order.instrument_type}` : undefined}
    >
      {order && <OrderGroupsLayout order={order} />}
    </Modal>
  );
}
