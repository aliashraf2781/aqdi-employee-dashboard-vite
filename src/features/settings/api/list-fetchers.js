import { apiClient } from '@/shared/lib/api-client';
import { pickItems, pickLastPage, pickTotal } from '@/shared/lib/list-response';
import { AUDIENCES, CONTRACT_TYPES } from '@/features/settings/lib/labels';

const BIG_PAGE_SIZE = 100;

/** Result shape every CRUD list fetcher returns: `{ rows, lastPage, total }`. */
const toListResult = (body) => {
  const rows = pickItems(body);
  return { rows, lastPage: pickLastPage(body), total: pickTotal(body) ?? rows.length };
};

/** A single, non-paginated list. */
export async function fetchPlainList(path, params) {
  const { data } = await apiClient.get(path, { params });
  return { ...toListResult(data), lastPage: null };
}

/** A paginated list; extra `params` (search, filters) are sent as query string. */
export async function fetchPagedList(path, params) {
  const { data } = await apiClient.get(path, { params });
  return toListResult(data);
}

/** Housing and commercial rows live behind a `contract_type` param: ask for both and merge. */
export async function fetchBothContractTypes(path) {
  const types = [CONTRACT_TYPES.housing, CONTRACT_TYPES.commercial];
  const bodies = await Promise.all(
    types.map((contract_type) =>
      apiClient.get(path, { params: { contract_type, per_page: BIG_PAGE_SIZE } }).then((response) => response.data),
    ),
  );
  const rows = bodies.flatMap((body, index) =>
    pickItems(body).map((item) => ({ ...item, contract_type: item.contract_type || types[index] })),
  );
  return { rows, lastPage: null, total: rows.length };
}

/** Client, employee and property rows come from three separate URLs: merge them. */
export async function fetchAllAudiences(buildPath) {
  const audiences = Object.values(AUDIENCES);
  const bodies = await Promise.all(
    audiences.map((audience) => apiClient.get(buildPath(audience)).then((response) => response.data)),
  );
  const rows = bodies.flatMap((body, index) =>
    pickItems(body).map((item) => ({ ...item, type: item.type || audiences[index] })),
  );
  return { rows, lastPage: null, total: rows.length };
}
