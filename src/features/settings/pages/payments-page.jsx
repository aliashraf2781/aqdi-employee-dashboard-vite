import { useState } from 'react';
import { Card } from '@/shared/components/card';
import { Pagination } from '@/shared/components/pagination';
import { FilterButtonGroup } from '@/features/settings/components/filter-button-group';
import { PaymentsTable } from '@/features/settings/components/payments-table';
import { SettingsPageHeader } from '@/features/settings/components/settings-page-header';
import { usePayments } from '@/features/settings/hooks/use-payments';
import { PERIOD_FILTERS, STATUS_FILTERS, filterByStatus } from '@/features/settings/lib/payment-filters';

const FIRST_PAGE = 1;
const DEFAULT_PERIOD = 'month';

export function PaymentsPage() {
  const [page, setPage] = useState(FIRST_PAGE);
  const [period, setPeriod] = useState(DEFAULT_PERIOD);
  const [status, setStatus] = useState('');

  const { data, isLoading } = usePayments({ page, period });
  const payments = filterByStatus(data?.rows ?? [], status);

  const changePeriod = (next) => {
    setPeriod(next);
    setPage(FIRST_PAGE);
  };

  return (
    <div className="flex flex-col gap-4">
      <SettingsPageHeader
        title="المدفوعات"
        description={data?.total != null ? `إجمالي ${data.total} عملية` : 'سجل العمليات'}
      />

      <Card className="flex flex-col gap-6 md:flex-row md:items-end">
        <FilterButtonGroup label="الفترة الزمنية" options={PERIOD_FILTERS} value={period} onChange={changePeriod} />
        <FilterButtonGroup label="حالة الدفع" options={STATUS_FILTERS} value={status} onChange={setStatus} />
      </Card>

      <PaymentsTable payments={payments} isLoading={isLoading} />
      <Pagination page={page} lastPage={data?.lastPage} onPageChange={setPage} />
    </div>
  );
}
