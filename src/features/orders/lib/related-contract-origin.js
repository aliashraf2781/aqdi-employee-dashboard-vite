const STORAGE_KEY = 'aqdi-related-contract-origin';

export function readRelatedContractSession() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!parsed?.originId) return null;
    return {
      originId: String(parsed.originId),
      groupIds: Array.isArray(parsed.groupIds) ? parsed.groupIds.map(String) : [],
    };
  } catch {
    return null;
  }
}

function writeRelatedContractSession({ originId, groupIds }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ originId: String(originId), groupIds: groupIds.map(String) }));
  } catch {
    // storage unavailable: the "back to first contract" link simply is not remembered
  }
}

export function clearRelatedContractOrigin() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nothing to clear
  }
}

/**
 * A client can have several contracts. The first one opened in a group is remembered as the
 * "origin", so the other contracts of the group can link back to it.
 */
export function syncRelatedContractOrigin(orderData) {
  const contracts = Array.isArray(orderData?.user_contracts) ? orderData.user_contracts : [];
  const currentId = orderData?.id ?? orderData?.contract_summary?.id ?? null;
  if (!currentId || !contracts.length) return null;

  const current = String(currentId);
  const groupIds = contracts.map((contract) => contract?.id).filter((id) => id != null).map(String);
  const session = readRelatedContractSession();
  if (session?.originId && session.groupIds.includes(current)) return session.originId;

  writeRelatedContractSession({ originId: current, groupIds });
  return current;
}

export function getRelatedContractOriginId() {
  return readRelatedContractSession()?.originId ?? null;
}
