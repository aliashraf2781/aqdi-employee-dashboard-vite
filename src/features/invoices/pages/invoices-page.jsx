import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/shared/components/card';
import { PageHeader } from '@/shared/components/page-header';
import { Pagination } from '@/shared/components/pagination';
import { InvoicePreviewDialog } from '../components/invoice-preview-dialog';
import { InvoiceStats } from '../components/invoice-stats';
import { InvoicesFilters } from '../components/invoices-filters';
import { InvoicesTable } from '../components/invoices-table';
import { useInvoices } from '../hooks/use-invoices';
import { filterInvoices, getInvoiceStats, paginate } from '../lib/invoice-filters';
import { exportInvoicesCsv } from '../lib/invoices-csv';

const PAGE_SIZE = 10;
const INITIAL_FILTERS = { search: '', status: 'all', contractType: 'all' };

export function InvoicesPage() {
  const { data: invoices = [], isLoading } = useInvoices();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const filtered = useMemo(() => filterInvoices(invoices, filters), [invoices, filters]);
  const stats = useMemo(() => getInvoiceStats(invoices), [invoices]);
  const lastPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Any filter change sends the user back to the first page.
  const changeFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  };

  const handleExport = () => {
    if (!filtered.length) {
      toast.error('لا توجد فواتير لتصديرها');
      return;
    }
    exportInvoicesCsv(filtered);
    toast.success('تم تصدير CSV');
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="الفواتير" description="فواتير رسوم توثيق العقود عبر بوابة الدفع" />
      <InvoiceStats stats={stats} />

      <Card className="flex flex-col gap-4">
        <InvoicesFilters filters={filters} onChange={changeFilter} onExport={handleExport} />
        <InvoicesTable
          invoices={paginate(filtered, Math.min(page, lastPage), PAGE_SIZE)}
          isLoading={isLoading}
          onSelectInvoice={setSelectedInvoice}
        />
        <Pagination page={page} lastPage={lastPage} onPageChange={setPage} />
      </Card>

      <InvoicePreviewDialog invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
    </div>
  );
}
