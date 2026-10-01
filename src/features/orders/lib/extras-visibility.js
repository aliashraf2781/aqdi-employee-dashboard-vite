import { isReturnContractStatus } from './refund-status';

const hasValue = (value) => value != null && value !== '';
const hasAny = (values) => values.some(hasValue);

function isDocumentedStatus(order) {
  return String(order?.status_name ?? '').includes('تم التوثيق');
}

/**
 * Which "extra data" cards the details page shows. Returns null when there is nothing to show
 * (the group is only for documented, draft-sent or returned orders).
 */
export function getExtrasVisibility(order) {
  const extras = order?.extras ?? {};
  const refund = extras.refund;
  const account = extras.account;
  const invoice = extras.invoice;

  const draftSent = hasAny([extras.ejar_contract_draft_number, extras.draft_contact_number, extras.draft_contact_number_mode]);
  const inReturnStatus = isReturnContractStatus({ id: order?.status_id, name: order?.status_name });
  if (!isDocumentedStatus(order) && !draftSent && !(refund || inReturnStatus)) return null;

  const visibility = {
    ejar:
      Boolean(extras.status_case) ||
      hasAny([
        extras.ejar_contract_number,
        extras.ejar_contract_draft_number,
        extras.draft_contact_number,
        extras.draft_contact_number_mode,
        extras.ejar_status_notes,
        extras.deed_type,
        extras.deed_addition_method,
        extras.deed_number,
      ]),
    draft:
      hasAny([extras.draft_contract_status, extras.draft_contract_number, extras.draft_before_paid_url, extras.draft_after_paid_url]) ||
      hasAny([
        extras.expiry_date,
        extras.rating,
        extras.rating_note,
        extras.is_review,
        extras.notes_edits,
        extras.strong_argument_url,
      ]),
    account: account ? hasAny([account.holder_name, account.bank_name, account.account_number, account.iban]) : false,
    invoice: invoice ? hasAny([invoice.number, invoice.amount, invoice.status, invoice.date, invoice.reference]) : false,
    refund: Boolean(refund),
  };

  return Object.values(visibility).some(Boolean) ? visibility : null;
}
