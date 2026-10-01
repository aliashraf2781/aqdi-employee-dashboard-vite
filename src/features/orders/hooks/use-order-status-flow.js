import { useState } from 'react';
import { toast } from 'sonner';
import { openDialogAfterMenuClose } from '@/shared/lib/open-dialog-after-menu-close';
import { normalizeMenuStatus } from '../lib/order-status-payload';
import {
  canOfferClosureActions,
  getReturnRequestExistsMessage,
  hasReturnRequest,
  isOrderPaid,
  isReturnContractStatus,
  UNPAID_ORDER_RETURN_MESSAGE,
} from '../lib/refund-status';
import { normalizeOrderForReturnRequest } from '../lib/return-request-order';
import { useChangeOrderStatus } from './use-change-order-status';
import { useConfirmOrderStatusChange } from './use-confirm-order-status-change';

/**
 * Everything needed to change the status of an order from a menu:
 *  - "return" statuses open the return-request flow (after permission and payment checks),
 *  - statuses with extra inputs ask for them first,
 *  - every other status asks for a confirmation and is then applied.
 *
 * Call `requestStatusChange(order, status)` from the menu and render
 * `<OrderStatusFlowDialogs flow={flow} />` once in the page.
 *
 * Options: `queryKey` (a cache key, or key array, to refresh), `canReturn` (permission), `onChanged` (after a successful change),
 * `requirePaymentForReturn` (true: only paid orders may be returned; false: paid or completed ones).
 */
export function useOrderStatusFlow({ queryKey, canReturn, onChanged, requirePaymentForReturn = false } = {}) {
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [returnOrder, setReturnOrder] = useState(null);
  const [statusFieldsOpen, setStatusFieldsOpen] = useState(false);
  const [pendingFieldsChange, setPendingFieldsChange] = useState(null);
  const changeStatus = useChangeOrderStatus({
    queryKey,
    onSuccess: () => {
      setStatusFieldsOpen(false);
      setPendingFieldsChange(null);
      confirm.clearConfirm();
      onChanged?.();
    },
  });

  const confirm = useConfirmOrderStatusChange({
    onDirectChange: (pending) => changeStatus.mutate({ orderId: pending.orderId, statusId: pending.status.id }),
    onNeedsFields: (pending) => {
      setPendingFieldsChange({ orderId: pending.orderId, status: pending.status });
      setStatusFieldsOpen(true);
    },
  });

  const openReturn = (source, fallbackId) => {
    if (!canReturn) {
      toast.error('ليست لديك صلاحية طلب الاسترجاع');
      return;
    }
    const normalized = normalizeOrderForReturnRequest(source, source?.id ?? fallbackId);
    const isEligible = requirePaymentForReturn ? isOrderPaid(normalized) : canOfferClosureActions(normalized, source);
    if (!isEligible) {
      toast.error(UNPAID_ORDER_RETURN_MESSAGE);
      return;
    }
    if (hasReturnRequest(normalized)) {
      toast.info(getReturnRequestExistsMessage(normalized));
      return;
    }
    setReturnOrder(normalized);
    openDialogAfterMenuClose(() => setReturnDialogOpen(true));
  };

  const requestStatusChange = (order, status) => {
    const menuStatus = normalizeMenuStatus(status);
    if (isReturnContractStatus(menuStatus)) {
      openReturn(order);
      return;
    }
    confirm.requestConfirm({ order, orderId: order.id, status: menuStatus, orderLabel: order?.uuid ?? order?.id });
  };

  return {
    queryKey,
    isChangingStatus: changeStatus.isPending,
    changingOrderId: changeStatus.isPending ? changeStatus.variables?.orderId : null,
    requestStatusChange,
    openReturn,
    changeStatus: changeStatus.mutate,
    confirm,
    returnDialog: { open: returnDialogOpen, setOpen: setReturnDialogOpen, order: returnOrder },
    statusFields: {
      open: statusFieldsOpen,
      pending: pendingFieldsChange,
      setOpen: (next) => {
        setStatusFieldsOpen(next);
        if (!next) setPendingFieldsChange(null);
      },
    },
  };
}
