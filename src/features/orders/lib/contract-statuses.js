import { findOrdersPageStatusIdByLabel } from './orders-page-statuses';

// Ids the backend uses when the status list has not loaded (or has no match by name).
export const NEW_CONTRACT_STATUS_ID = 1;
export const RETURN_CONTRACT_STATUS_ID = 2;
export const CANCELED_CONTRACT_STATUS_ID = 4;
export const RECEIVED_CONTRACT_STATUS_ID = 6;

/** The list endpoint answers in several shapes depending on the backend version. */
export function extractContractStatusItems(body) {
  if (Array.isArray(body?.data?.items)) return body.data.items;
  if (Array.isArray(body?.data?.data?.items)) return body.data.data.items;
  if (Array.isArray(body?.items)) return body.items;
  if (Array.isArray(body?.data)) return body.data;
  return [];
}

function findExactStatusId(statusItems, name) {
  const found = statusItems.find((item) => String(item?.name ?? '').trim() === name);
  return found?.id ?? null;
}

export function resolveNewContractStatusId(statusItems = []) {
  return (
    findExactStatusId(statusItems, 'جديد') ??
    findOrdersPageStatusIdByLabel(statusItems, 'جديد') ??
    NEW_CONTRACT_STATUS_ID
  );
}

export function resolveReceivedContractStatusId(statusItems = []) {
  return (
    findExactStatusId(statusItems, 'مستلم') ??
    findOrdersPageStatusIdByLabel(statusItems, 'مستلم') ??
    RECEIVED_CONTRACT_STATUS_ID
  );
}

export function resolveReturnedContractStatusId(statusItems = []) {
  return (
    findExactStatusId(statusItems, 'استرجاع') ??
    findOrdersPageStatusIdByLabel(statusItems, 'استرجاع') ??
    RETURN_CONTRACT_STATUS_ID
  );
}

export function resolveCanceledContractStatusId(statusItems = []) {
  return (
    findExactStatusId(statusItems, 'ملغى') ??
    findExactStatusId(statusItems, 'ملغي') ??
    findOrdersPageStatusIdByLabel(statusItems, 'ملغى') ??
    CANCELED_CONTRACT_STATUS_ID
  );
}

function isReturnedStatusName(name) {
  return name.includes('استرجاع') || name.includes('مسترجع');
}

function isCanceledStatusName(name) {
  return name.includes('ملغ');
}

/** Statuses that already have their own button on the realtime-orders screen. */
function isRealtimePillStatus(name) {
  return !name || name === 'جديد' || name === 'مستلم' || isCanceledStatusName(name) || isReturnedStatusName(name);
}

/** Realtime-orders "more filters": every status without a dedicated button. */
export function getRealtimeExtraFilterStatuses(statusItems = []) {
  return statusItems.filter((item) => !isRealtimePillStatus(String(item?.name ?? '').trim()));
}

/** Realtime-orders status chips: "received" first, then the in-pipeline statuses. */
export function getRealtimeStatusChipStatuses(statusItems = [], receivedStatusId) {
  const received = statusItems.find((item) => String(item?.id) === String(receivedStatusId));
  const others = getRealtimeExtraFilterStatuses(statusItems).filter(
    (item) => String(item?.id) !== String(receivedStatusId),
  );
  return received ? [received, ...others] : others;
}

/** All-orders "more filters": everything except returned/canceled, which are quick pills there. */
export function getAllOrdersExtraFilterStatuses(statusItems = []) {
  return statusItems.filter((item) => {
    const name = String(item?.name ?? '').trim();
    return name && !isReturnedStatusName(name) && !isCanceledStatusName(name);
  });
}
