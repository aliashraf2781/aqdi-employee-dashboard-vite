import { apiClient } from '@/shared/lib/api-client';
import { pickItems, pickLastPage, pickTotal } from '@/shared/lib/list-response';

const POPUP_CONTRACTS_PATH = '/admin/popup-contracts';
export const POPUP_CONTRACTS_PER_PAGE = 10;
const USED_TYPES_PAGE_SIZE = 100;

export async function fetchPopupContracts({ page, perPage }) {
  const { data } = await apiClient.get(POPUP_CONTRACTS_PATH, { params: { per_page: perPage, page } });
  return { rows: pickItems(data), lastPage: pickLastPage(data), total: pickTotal(data) };
}

/** Every popup, so the form can hide document types that already have one. */
export async function fetchAllPopupContracts() {
  const { rows } = await fetchPopupContracts({ page: 1, perPage: USED_TYPES_PAGE_SIZE });
  return rows;
}

export async function savePopupContract({ id, payload }) {
  const path = id ? `${POPUP_CONTRACTS_PATH}/${id}` : POPUP_CONTRACTS_PATH;
  const { data } = await apiClient.post(path, payload);
  return data;
}
