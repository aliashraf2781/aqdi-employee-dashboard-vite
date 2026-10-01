import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLoader } from '@/shared/components/page-loader';
import { useContractStatuses } from '../../hooks/use-contract-statuses';
import { useOrderDetailsDialogs } from '../../hooks/use-order-details-dialogs';
import { useOrderNotesPanel } from '../../hooks/use-order-notes-panel';
import { useOrdersPermissions } from '../../hooks/use-orders-permissions';
import { isLeaseRenewalOrder, resolveBackLink } from '../../lib/back-link';
import { HEADER_ACTIONS } from '../../lib/order-header-rules';
import { mapOrderDetailView } from '../../lib/order-detail-view';
import { clearRelatedContractOrigin } from '../../lib/related-contract-origin';
import { OrderDetailsDialogs } from './order-details-dialogs';
import { OrderDetailsHeader } from './header/order-details-header';
import { OrderGroupsLayout } from './order-groups-layout';
import { useSingleOrderContext } from './single-order-context';

/** Header, data groups and dialogs of one order (the order comes from SingleOrderProvider). */
export function OrderDetailsBody({ id }) {
  const [searchParams] = useSearchParams();
  const { orderData, isLoading, isError, refetch } = useSingleOrderContext();
  const { canChangeStatus, canReturn } = useOrdersPermissions();
  const { activeItems: statuses } = useContractStatuses();
  const notes = useOrderNotesPanel();
  const dialogs = useOrderDetailsDialogs({ orderData, id, canReturn, refetch });

  const view = useMemo(() => (orderData ? mapOrderDetailView(orderData) : null), [orderData]);

  // The "related contracts" memory only lives while the user stays on order pages.
  useEffect(() => clearRelatedContractOrigin, []);

  if (isLoading) return <PageLoader />;
  if (isError || !orderData || !view) return <div className="p-6 text-center text-muted-foreground">تعذر تحميل بيانات الطلب</div>;

  const actions = {
    [HEADER_ACTIONS.VIEW_FILE]: dialogs.expandedView.show,
    [HEADER_ACTIONS.PROPERTY_UPDATE]: dialogs.propertyUpdate.show,
    [HEADER_ACTIONS.SEND_DRAFT]: dialogs.sendDraft.show,
    [HEADER_ACTIONS.MISSING_ATTACHMENT]: dialogs.correctionRequest.show,
    [HEADER_ACTIONS.REFUND]: dialogs.openReturn,
    [HEADER_ACTIONS.EJAR_DOCUMENTATION]: dialogs.ejarDocumentation.show,
    [HEADER_ACTIONS.PAY_LINK]: () => dialogs.paymentLink.show(orderData),
    changeStatus: dialogs.changeStatus,
    sms: dialogs.sms.show,
    sendSectionError: dialogs.sectionError.setContext,
  };

  return (
    <div className="flex flex-col gap-5">
      <OrderDetailsHeader
        view={view}
        orderData={orderData}
        back={resolveBackLink(searchParams.get('from'))}
        statuses={statuses}
        canChangeStatus={canChangeStatus}
        isStatusPending={dialogs.statusFlow.isChangingStatus}
        actions={actions}
        onOpenNotes={notes.isAvailable ? () => notes.openOrderNotes(id) : undefined}
        payLink={dialogs.paymentLink}
      />

      <OrderGroupsLayout order={view} orderData={orderData} onEdit={dialogs.editor.setSection} isLeaseRenewal={isLeaseRenewalOrder(orderData)} />

      <OrderDetailsDialogs orderData={orderData} view={view} dialogs={dialogs} />
    </div>
  );
}
