import { getStatusCaseFields } from '../../lib/order-status-payload';
import { ReturnRequestDialog } from '../return-request/return-request-dialog';
import { ChangeOrderStatusFieldsDialog } from './status-fields-dialog';
import { ConfirmOrderStatusChangeDialog } from './confirm-status-change-dialog';

/** The three dialogs of the status-change flow. `flow` is the object returned by useOrderStatusFlow. */
export function OrderStatusFlowDialogs({ flow }) {
  const { confirm, statusFields, returnDialog } = flow;
  const pendingStatus = confirm.pendingConfirm?.status;

  const submitExtraFields = (extraValues) => {
    const { pending } = statusFields;
    if (!pending) return;
    flow.changeStatus({
      orderId: pending.orderId,
      statusId: pending.status.id,
      extraValues,
      fields: getStatusCaseFields(pending.status),
    });
  };

  return (
    <>
      <ReturnRequestDialog
        open={returnDialog.open}
        onOpenChange={returnDialog.setOpen}
        order={returnDialog.order}
        orderId={returnDialog.order?.id}
        queryKey={flow.queryKey}
      />

      <ConfirmOrderStatusChangeDialog
        open={confirm.confirmOpen}
        onOpenChange={confirm.handleConfirmOpenChange}
        statusName={pendingStatus?.name ?? pendingStatus?.label}
        orderLabel={confirm.pendingConfirm?.orderLabel}
        isPending={flow.isChangingStatus && !confirm.pendingConfirm?.requiresFields}
        onConfirm={confirm.confirmStatusChange}
      />

      <ChangeOrderStatusFieldsDialog
        open={statusFields.open}
        onOpenChange={statusFields.setOpen}
        status={statusFields.pending?.status}
        isPending={flow.isChangingStatus}
        onSubmit={submitExtraFields}
      />
    </>
  );
}
