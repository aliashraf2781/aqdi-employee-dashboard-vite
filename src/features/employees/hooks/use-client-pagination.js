import { useMemo, useState } from 'react';

const DEFAULT_PAGE_SIZE = 8;

/** Pages an array that is already in memory (salaries, notes, contracts of one employee). */
export function useClientPagination(items, pageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const list = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const lastPage = Math.max(1, Math.ceil(list.length / pageSize));
  const currentPage = Math.min(page, lastPage);

  const pageItems = useMemo(
    () => list.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [list, currentPage, pageSize],
  );

  return { pageItems, page: currentPage, lastPage, total: list.length, setPage };
}
