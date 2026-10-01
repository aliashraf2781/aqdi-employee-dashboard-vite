const ALL = 'all';

/** Search by invoice, contract or mobile number; status and type must match when set. */
export function filterInvoices(invoices, { search, status, contractType }) {
  const query = search.trim().toLowerCase();

  return invoices.filter((invoice) => {
    if (status !== ALL && invoice.status !== status) return false;
    if (contractType !== ALL && invoice.contractType !== contractType) return false;
    if (!query) return true;

    return [invoice.invoiceNo, invoice.orderNo, invoice.mobile]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });
}

export function getInvoiceStats(invoices) {
  const paid = invoices.filter((invoice) => invoice.status === 'success');

  return {
    paidCount: paid.length,
    refundedCount: invoices.filter((invoice) => invoice.status === 'failed').length,
    totalCount: invoices.length,
    collected: paid.reduce((sum, invoice) => sum + invoice.amount, 0),
  };
}

export function paginate(items, page, pageSize) {
  return items.slice((page - 1) * pageSize, page * pageSize);
}
