import { getExtrasVisibility } from '../../lib/extras-visibility';
import { AccountInvoiceCard, DraftCard, EjarCard, RefundCard } from './extras-cards';
import { GroupSection } from './detail-primitives';

/** "بيانات إضافية": Ejar documentation, draft, account/invoice and refund data, only when relevant. */
export function ExtrasGroup({ order }) {
  const visibility = getExtrasVisibility(order);
  if (!visibility) return null;

  const { extras } = order;
  return (
    <GroupSection title="بيانات إضافية">
      {visibility.ejar && <EjarCard extras={extras} />}
      {visibility.draft && <DraftCard extras={extras} />}
      {(visibility.account || visibility.invoice) && (
        <AccountInvoiceCard account={extras.account} invoice={extras.invoice} showAccount={visibility.account} showInvoice={visibility.invoice} />
      )}
      {visibility.refund && <RefundCard refund={extras.refund} />}
    </GroupSection>
  );
}
