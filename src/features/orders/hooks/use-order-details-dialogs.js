import { useState } from 'react';
import { useOpenState } from '@/shared/hooks/use-open-state';
import { SINGLE_ORDER_QUERY_KEY } from '../lib/order-query-keys';
import { useOrderPaymentLink } from './use-order-payment-link';
import { useOrderStatusFlow } from './use-order-status-flow';

/**
 * Every dialog of the order details page and the actions that open them:
 * section editors, the "send error to client" message, property update, send draft, correction request,
 * Ejar documentation, SMS, the expanded view, the payment link and the status-change / return flow.
 */
export function useOrderDetailsDialogs({ orderData, id, canReturn, refetch }) {
  const [editorSection, setEditorSection] = useState(null);
  const [sectionErrorContext, setSectionErrorContext] = useState(null);

  const queryKey = [SINGLE_ORDER_QUERY_KEY, id];
  const statusFlow = useOrderStatusFlow({ queryKey, canReturn, onChanged: refetch });
  const paymentLink = useOrderPaymentLink();

  return {
    queryKey,
    editor: { section: editorSection, setSection: setEditorSection },
    sectionError: { context: sectionErrorContext, setContext: setSectionErrorContext },
    propertyUpdate: useOpenState(),
    sendDraft: useOpenState(),
    correctionRequest: useOpenState(),
    ejarDocumentation: useOpenState(),
    sms: useOpenState(),
    expandedView: useOpenState(),
    statusFlow,
    paymentLink,
    changeStatus: (status) => statusFlow.requestStatusChange(orderData, status),
    openReturn: () => statusFlow.openReturn(orderData, id),
  };
}
