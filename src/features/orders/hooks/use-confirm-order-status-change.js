import { useState } from 'react';
import { openDialogAfterMenuClose } from '@/shared/lib/open-dialog-after-menu-close';
import { normalizeMenuStatus, statusRequiresExtraFields } from '../lib/order-status-payload';

function resolveOrderLabel({ orderLabel, order, orderId }) {
  return orderLabel ?? order?.uuid ?? order?.order_number ?? orderId ?? order?.id ?? null;
}

/**
 * Confirmation gate before applying a status change.
 * - `requestConfirm` opens the "are you sure" dialog,
 * - `confirmStatusChange` then calls `onNeedsFields` (status asks for extra inputs)
 *   or `onDirectChange` (apply right away).
 * Return-status flows must be handled by the caller before calling requestConfirm.
 */
export function useConfirmOrderStatusChange({ onDirectChange, onNeedsFields } = {}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(null);

  const clearConfirm = () => {
    setConfirmOpen(false);
    setPendingConfirm(null);
  };

  const requestConfirm = ({ orderId, order, status, orderLabel }) => {
    const menuStatus = normalizeMenuStatus(status);
    setPendingConfirm({
      orderId: orderId ?? order?.id,
      order: order ?? null,
      status: menuStatus,
      orderLabel: resolveOrderLabel({ orderLabel, order, orderId }),
      requiresFields: statusRequiresExtraFields(menuStatus),
    });
    openDialogAfterMenuClose(() => setConfirmOpen(true));
  };

  const handleConfirmOpenChange = (next) => {
    setConfirmOpen(next);
    if (!next) setPendingConfirm(null);
  };

  const confirmStatusChange = () => {
    if (!pendingConfirm) return;

    if (pendingConfirm.requiresFields) {
      onNeedsFields?.(pendingConfirm);
      clearConfirm();
      return;
    }
    onDirectChange?.(pendingConfirm);
  };

  return { confirmOpen, pendingConfirm, requestConfirm, confirmStatusChange, clearConfirm, handleConfirmOpenChange };
}
