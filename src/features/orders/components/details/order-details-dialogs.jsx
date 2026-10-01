import { PaymentLinkResultDialog } from '../payment-link/payment-link-result-dialog';
import { CorrectionRequestDialog } from '../order-actions/correction-request-dialog';
import { EjarDocumentationDialog } from '../order-actions/ejar-documentation-dialog';
import { PropertyUpdateDialog } from '../order-actions/property-update-dialog';
import { SectionErrorDialog } from '../order-actions/section-error-dialog';
import { SendDraftDialog } from '../order-actions/send-draft-dialog';
import { SendOrderSmsDialog } from '../order-actions/send-order-sms-dialog';
import { OrderStatusFlowDialogs } from '../status-flow/order-status-flow-dialogs';
import { DeedOwnersEditor } from '../contract-edit/deed-owners-editor';
import { FinancialEditor } from '../contract-edit/financial-editor';
import { PropertyAddressEditor } from '../contract-edit/property-address-editor';
import { TenantEditor } from '../contract-edit/tenant-editor';
import { UnitsEditor } from '../contract-edit/units-editor';
import { ContractExpandedViewDialog } from './contract-expanded-view-dialog';
import { SectionEditorDialog } from './section-editor-dialog';

const SECTION_EDITORS = {
  deed: DeedOwnersEditor,
  address: PropertyAddressEditor,
  tenant: TenantEditor,
  financial: FinancialEditor,
  units: UnitsEditor,
};

/** Every dialog of the order details page. `dialogs` is the object returned by useOrderDetailsDialogs. */
export function OrderDetailsDialogs({ orderData, view, dialogs }) {
  const { editor, sectionError, queryKey, paymentLink } = dialogs;
  const SectionEditor = SECTION_EDITORS[editor.section];

  return (
    <>
      <SectionEditorDialog open={Boolean(editor.section)} onOpenChange={(open) => !open && editor.setSection(null)} section={editor.section}>
        {SectionEditor && <SectionEditor order={orderData} />}
      </SectionEditorDialog>

      <SectionErrorDialog
        open={Boolean(sectionError.context)}
        onOpenChange={(open) => !open && sectionError.setContext(null)}
        orderData={orderData}
        context={sectionError.context}
      />

      <OrderStatusFlowDialogs flow={dialogs.statusFlow} />

      <PropertyUpdateDialog open={dialogs.propertyUpdate.open} onOpenChange={dialogs.propertyUpdate.setOpen} orderData={orderData} queryKey={queryKey} />
      <SendDraftDialog open={dialogs.sendDraft.open} onOpenChange={dialogs.sendDraft.setOpen} orderData={orderData} queryKey={queryKey} />
      <CorrectionRequestDialog open={dialogs.correctionRequest.open} onOpenChange={dialogs.correctionRequest.setOpen} order={view} />
      <EjarDocumentationDialog open={dialogs.ejarDocumentation.open} onOpenChange={dialogs.ejarDocumentation.setOpen} orderData={orderData} queryKey={queryKey} />
      <SendOrderSmsDialog open={dialogs.sms.open} onOpenChange={dialogs.sms.setOpen} order={orderData} />
      <ContractExpandedViewDialog open={dialogs.expandedView.open} onOpenChange={dialogs.expandedView.setOpen} order={view} />
      <PaymentLinkResultDialog open={paymentLink.isOpen} onOpenChange={paymentLink.setIsOpen} link={paymentLink.link} />
    </>
  );
}
