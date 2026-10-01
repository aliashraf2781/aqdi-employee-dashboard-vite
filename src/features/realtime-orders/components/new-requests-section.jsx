import { useMemo } from 'react';
import { buildSummaryCards, getNewOrdersTotal } from '../lib/new-requests-summary';
import { NewRequestsDialog } from './new-requests-dialog';
import { NewRequestsStrip } from './new-requests-strip';

const PREVIEW_COUNT = 7;

/** The "new requests" strip plus the full dialog opened by "عرض المزيد". */
export function NewRequestsSection({ newOrders, receive, canReceive, autoRefresh, onAutoRefreshChange }) {
  const { requests, summary, isLoading, expanded, setExpanded } = newOrders;
  const total = getNewOrdersTotal({ summary, totalCount: newOrders.total, orders: requests });
  const cards = useMemo(() => buildSummaryCards({ summary, orders: requests, total }), [summary, requests, total]);

  const cardActions = { canReceive, onReceive: receive.receiveOrder, receivingId: receive.receivingId };

  return (
    <>
      <NewRequestsStrip
        preview={requests.slice(0, PREVIEW_COUNT)}
        total={total}
        isLoading={isLoading}
        onExpand={() => setExpanded(true)}
        {...cardActions}
      />
      <NewRequestsDialog
        open={expanded}
        onOpenChange={setExpanded}
        orders={requests}
        total={total}
        cards={cards}
        isLoading={isLoading}
        autoRefresh={autoRefresh}
        onAutoRefreshChange={onAutoRefreshChange}
        {...cardActions}
      />
    </>
  );
}
