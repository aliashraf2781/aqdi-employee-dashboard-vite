import { getContractTypeLabel } from '../contract-periods';
import { getOrderClientPhone } from '../order-contact';
import {
  getOrderFinancialStep,
  getOrderUnits,
  getOrderUnitsCount,
  normalizeContractTypeKey,
  resolveOrderContractTypeKey,
} from '../order-detail-steps';
import { resolveNationalAddress } from '../national-address';
import { pick } from '../pick';
import { mapDeedView, resolveInstrumentTypeLabel } from './deed';
import { mapExtrasView } from './extras';
import { mapFinancialView } from './financial';
import { appOrWebLabel, isPaidValue } from './labels';
import { mapStatusTimeline } from './list-mappers';
import { mapRealEstateView } from './real-estate';
import { mapTenantView } from './tenant';
import { mapUnitsView } from './units';

function resolveContractTypeLabel(orderData, summary, contractTypeKey) {
  const raw = pick(
    summary.contract_type_trans,
    orderData.contract_type_trans,
    summary.contract_type,
    orderData.contract_type,
    contractTypeKey,
  );
  const normalized = normalizeContractTypeKey(raw);
  const isKnownType = normalized === 'housing' || normalized === 'commercial';
  return isKnownType ? getContractTypeLabel(normalized) : raw || '—';
}

function resolvePaid(orderData, summary) {
  return isPaidValue(
    pick(summary.is_paid, orderData.is_paid, summary.payment_status, orderData.payment_status, orderData.payment_label_ar),
  );
}

function resolveStatus(orderData, summary) {
  return {
    status_id: pick(summary.contract_status_id, orderData.contract_status_id, orderData.status_id, orderData.status?.id),
    status_name: pick(
      summary.contract_status_name,
      orderData.status_label,
      orderData.status?.name,
      orderData.contract_status_name,
      'قيد المعالجة',
    ),
    status_color: pick(
      summary.contract_status_color,
      orderData.status_color,
      orderData.status?.color,
      orderData.contract_status_color,
    ),
  };
}

/** Shapes GET /admin/orders/:id into the view the order details header and groups read. */
export function mapOrderDetailView(orderData = {}) {
  const summary = orderData.contract_summary ?? {};
  const financial = getOrderFinancialStep(orderData);
  const contractTypeKey = resolveOrderContractTypeKey(orderData);
  const paid = resolvePaid(orderData, summary);

  return {
    id: orderData.id ?? summary.id,
    uuid: pick(orderData.uuid, summary.uuid, orderData.id),
    contract_type: resolveContractTypeLabel(orderData, summary, contractTypeKey),
    contract_type_key: contractTypeKey ?? pick(summary.contract_type_key, orderData.contract_type_key),
    instrument_type: resolveInstrumentTypeLabel(orderData),
    ...resolveStatus(orderData, summary),
    is_paid: paid,
    amount_payment: pick(summary.amount_payment, orderData.amount_payment, orderData.payment_amount),
    user_mobile: pick(getOrderClientPhone(orderData), orderData.user_mobile, summary.user_mobile),
    employee_name: pick(summary.employee_name, orderData.employee_name, '—'),
    received_at: pick(orderData.received_at, summary.received_at),
    received_since: pick(orderData.received_since, summary.received_since),
    documentation_deadline_at: pick(orderData.documentation_deadline_at, summary.documentation_deadline_at),
    app_or_web: appOrWebLabel(pick(orderData.app_or_web, summary.app_or_web, financial.app_or_web, orderData.start?.app_or_web)),
    banner: pick(summary.notes_edits, financial.notes_edits, orderData.notes_edits, summary.client_explanation),
    status_timeline: mapStatusTimeline(orderData.status_timeline),
    deed: mapDeedView(orderData),
    national_address: resolveNationalAddress(orderData),
    tenant: mapTenantView(orderData),
    real_estate: mapRealEstateView(orderData),
    extras: mapExtrasView(orderData),
    financial: mapFinancialView(orderData, { paid }),
    units: mapUnitsView(getOrderUnits(orderData)),
    units_count: getOrderUnitsCount(orderData),
  };
}
