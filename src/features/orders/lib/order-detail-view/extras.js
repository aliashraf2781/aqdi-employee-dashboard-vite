import { hasExistingReturnRequest, isReturnContractStatus } from '../refund-status';
import { fileNameFromUrl, resolveImageUrl } from '../national-address';
import { pick } from '../pick';
import { draftContactModeLabel, translateStatus, yesNoLabel } from './labels';

function mapStatusCaseView(statusCase) {
  if (!statusCase || typeof statusCase !== 'object') return null;
  const mapped = {
    deed_type: statusCase.deed_type,
    deed_addition_method: statusCase.deed_addition_method,
    deed_number: statusCase.deed_number,
    ejar_contract_number: statusCase.ejar_contract_number,
    ejar_contract_draft_number: statusCase.ejar_contract_draft_number,
    ejar_status_notes: pick(statusCase.ejar_status_notes, statusCase.notes),
    contact_number_mode: statusCase.contact_number_mode,
    contact_number: pick(statusCase.contact_number, statusCase.current_contact_number),
    attachment: resolveImageUrl(
      pick(statusCase.attachment, statusCase.status_attachment)
    ),
  };
  const hasAny = Object.values(mapped).some((value) => value != null && value !== '');
  return hasAny ? mapped : null;
}

function mapInvoiceView(invoice) {
  if (!invoice || typeof invoice !== 'object') return null;
  return {
    number: pick(invoice.invoice_number, invoice.invoiceNo, invoice.number, invoice.id),
    amount: pick(invoice.amount, invoice.total, invoice.total_amount),
    status: translateStatus(pick(invoice.status_label, invoice.status_name, invoice.status)),
    date: pick(invoice.date, invoice.invoice_date, invoice.created_at),
    reference: pick(invoice.reference_number, invoice.referenceNo, invoice.reference),
  };
}

function mapAccountView(account) {
  if (!account || typeof account !== 'object') return null;
  return {
    holder_name: pick(
      account.account_holder_name,
      account.client_account_holder_name,
      account.name
    ),
    bank_name: pick(account.bank_name, account.bank),
    account_number: pick(account.account_number, account.bank_account_number, account.iban),
    iban: account.iban,
  };
}

function isAlreadyRefunded(orderData = {}) {
  const status = String(
    pick(
      orderData.return_request_status,
      orderData.return_status,
      orderData.contract_summary?.return_request_status
    ) ?? ''
  ).toLowerCase();
  return (
    status === 'refunded' ||
    orderData.customer_refunded === true ||
    orderData.customer_refunded === 1 ||
    orderData.is_refunded === true ||
    orderData.is_refunded === 1 ||
    orderData.refunded === true ||
    orderData.refunded === 1
  );
}

function isReturnStatusOrderData(orderData = {}) {
  const summary = orderData.contract_summary ?? {};
  return isReturnContractStatus({
    id: pick(
      summary.contract_status_id,
      orderData.contract_status_id,
      orderData.status_id,
      orderData.status?.id
    ),
    name: pick(
      summary.contract_status_name,
      orderData.status_label,
      orderData.status?.name,
      orderData.contract_status_name
    ),
  });
}

function mapRefundView(orderData = {}) {
  const inReturnStatus = isReturnStatusOrderData(orderData);
  if (
    !hasExistingReturnRequest(orderData) &&
    !isAlreadyRefunded(orderData) &&
    !inReturnStatus
  ) {
    return null;
  }

  const refund = orderData.refund ?? orderData.refundable_contract ?? null;
  const mapped = {
    return_status: translateStatus(
      pick(orderData.return_request_status, orderData.return_status, refund?.status)
    ),
    refund_amount: pick(orderData.refund_amount, refund?.amount, refund?.refund_amount),
    refund_id: pick(orderData.refund_id, refund?.id),
    reference_number: pick(orderData.reference_number, refund?.reference_number),
    refund_notes: pick(orderData.refund_notes, refund?.notes),
    accept_return: yesNoLabel(orderData.accept_retrun_contract),
    accept_return_employee: pick(
      orderData.accept_retrun_contract_employee?.name,
      orderData.accept_retrun_contract_employee_id
    ),
  };
  if (inReturnStatus && !mapped.return_status) {
    mapped.return_status = 'استرجاع';
  }
  const hasAny = Object.values(mapped).some((value) => value != null && value !== '');
  return hasAny ? mapped : null;
}

export function mapExtrasView(orderData = {}) {
  const statusCase = mapStatusCaseView(orderData.status_case);
  const invoice = mapInvoiceView(orderData.invoice);
  const account = mapAccountView(orderData.account);
  const refund = mapRefundView(orderData);
  const draftBefore = resolveImageUrl(
    pick(orderData.draft_before_paid, orderData.draft_before_paid_path)
  );
  const draftAfter = resolveImageUrl(
    pick(orderData.draft_after_paid, orderData.draft_after_paid_path)
  );
  const strongArgument = resolveImageUrl(
    pick(orderData.strong_argument_photo_path, orderData.strong_argument_photo)
  );

  return {
    ejar_contract_number: pick(
      orderData.ejar_contract_number,
      statusCase?.ejar_contract_number
    ),
    ejar_contract_draft_number: pick(
      orderData.ejar_contract_draft_number,
      orderData.draft_sent?.ejar_contract_draft_number,
      statusCase?.ejar_contract_draft_number
    ),
    draft_contact_number: pick(
      orderData.draft_contact_number,
      orderData.draft_sent?.draft_contact_number
    ),
    draft_contact_number_mode: draftContactModeLabel(
      pick(
        orderData.draft_contact_number_mode,
        orderData.draft_sent?.draft_contact_number_mode
      )
    ),
    ejar_status_notes: pick(orderData.ejar_status_notes, statusCase?.ejar_status_notes),
    deed_type: pick(orderData.deed_type, statusCase?.deed_type),
    deed_addition_method: pick(
      orderData.deed_addition_method,
      statusCase?.deed_addition_method
    ),
    deed_number: pick(orderData.deed_number, statusCase?.deed_number),
    draft_contract_status: pick(
      orderData.draft_contract_status?.name,
      orderData.draft_contract_status_name,
      orderData.relation_labels?.draft_contract_status
    ),
    draft_contract_number: orderData.draft_contract_number,
    expiry_date: orderData.expiry_date,
    rating: orderData.rating,
    rating_note: orderData.rating_note,
    is_review: yesNoLabel(orderData.is_review),
    notes_edits: pick(
      orderData.contract_summary?.notes_edits,
      orderData.notes_edits
    ),
    draft_before_paid_url: draftBefore,
    draft_before_paid_name: fileNameFromUrl(draftBefore),
    draft_after_paid_url: draftAfter,
    draft_after_paid_name: fileNameFromUrl(draftAfter),
    strong_argument_url: strongArgument,
    strong_argument_name: fileNameFromUrl(strongArgument),
    status_case: statusCase,
    invoice,
    account,
    refund,
  };
}
