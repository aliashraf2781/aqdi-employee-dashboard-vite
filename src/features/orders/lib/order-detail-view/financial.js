import { getOrderFinancialStep } from '../order-detail-steps';
import { pick } from '../pick';
import { resolveOtherConditionsList, resolveTenantRoleDetails } from '../frontend-contract-fields';
import { durationLabel, yesNoLabel } from './labels';
import { mapContractPayments, mapTotalPrice } from './list-mappers';

function resolvePaymentTypeName(orderData, financial) {
  return pick(
    orderData.payment_type?.name_ar,
    financial.payment_type?.name_ar,
    financial.payment_type_name,
    orderData.payment_type_name,
    orderData.payment_type?.name_trans,
    financial.payment_type?.name_trans,
  );
}

/** Rent, fees, tenant permissions, extra conditions and payment history. */
export function mapFinancialView(orderData, { paid }) {
  const summary = orderData.contract_summary ?? {};
  const financial = getOrderFinancialStep(orderData);
  const paymentType = resolvePaymentTypeName(orderData, financial);
  const fromAnywhere = (key) => pick(financial[key], orderData[key], summary[key]);

  return {
    paid,
    payment_method: paymentType,
    start_date: pick(financial.contract_starting_date, orderData.contract_starting_date),
    duration: durationLabel(financial),
    frequency: paymentType,
    rent: pick(
      financial.annual_rent_amount_for_the_unit,
      financial.contract_term_in_years?.price,
      orderData.annual_rent_amount_for_the_unit,
    ),
    fees: pick(summary.amount_payment, orderData.amount_payment, orderData.payment_amount),
    fees_paid: paid,
    daily_fine: fromAnywhere('daily_fine'),
    sub_delay: fromAnywhere('sub_delay'),
    deposit: fromAnywhere('deposit'),
    guarantee_amount: pick(
      financial.Guarantee_amount,
      orderData.Guarantee_amount,
      financial.guarantee_amount,
      orderData.guarantee_amount,
      summary.Guarantee_amount,
      summary.guarantee_amount,
    ),
    tenant_roles: resolveTenantRoleDetails(orderData),
    other_conditions: resolveOtherConditionsList(orderData),
    additional_terms: fromAnywhere('text_additional_terms'),
    premium_membership_for_free: yesNoLabel(pick(financial.premium_membership_for_free, orderData.premium_membership_for_free)),
    bank_account_number: pick(
      financial.bank_account_number,
      orderData.bank_account_number,
      orderData.account?.account_number,
      orderData.account?.iban,
    ),
    client_account_holder_name: pick(
      financial.client_account_holder_name,
      orderData.client_account_holder_name,
      orderData.account?.account_holder_name,
      orderData.account?.name,
    ),
    notes_edits: fromAnywhere('notes_edits'),
    total_price: mapTotalPrice(orderData.total_price),
    payments: mapContractPayments(orderData.contract_payments ?? orderData.payment_and_admin?.contract_payments),
  };
}
