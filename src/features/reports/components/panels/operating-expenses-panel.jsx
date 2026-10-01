import { Pencil, Plus, Trash2, Wallet, FileText } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { DataTable } from '@/shared/components/data-table';
import { KpiGrid } from '@/shared/components/kpi-card';
import { Pagination } from '@/shared/components/pagination';
import { Button } from '@/shared/components/ui/button';
import { SelectField } from '@/shared/components/ui/select-field';
import { TextField } from '@/shared/components/ui/text-field';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { formatDate } from '@/shared/lib/format';
import { useDeleteOperatingExpense, useOperatingExpenses } from '../../hooks/use-operating-expenses';
import { formatMoneyOrDash } from '../../lib/report-format';
import { OperatingExpenseDialog } from '../operating-expense-dialog';
import { ReportPanel } from '../report-panel';
import { ReportSection } from '../report-section';

const PAGE_SIZE = 20;

const CREATED_AT_OPTIONS = [
  { value: 'all', label: 'كل الفترات' },
  { value: 'today', label: 'اليوم' },
  { value: 'week', label: 'هذا الأسبوع' },
  { value: 'month', label: 'هذا الشهر' },
  { value: 'year', label: 'هذه السنة' },
];

function buildKpis(summary, items) {
  const total = summary.total_amount ?? items.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
  return [
    { key: 'count', label: 'عدد المصروفات', value: summary.count ?? items.length, icon: FileText },
    { key: 'total', label: 'إجمالي المصروفات', value: formatMoneyOrDash(total), icon: Wallet, tone: 'danger' },
  ];
}

function ExpenseRowActions({ expense, canEdit, canDelete, onEdit, onDelete }) {
  if (!canEdit && !canDelete) return <span className="text-muted-foreground">—</span>;

  return (
    <div className="flex items-center gap-2">
      {canEdit && (
        <Button variant="outline" size="icon" aria-label="تعديل" onClick={() => onEdit(expense)}>
          <Pencil className="size-4" />
        </Button>
      )}
      {canDelete && (
        <Button
          variant="outline"
          size="icon"
          aria-label="حذف"
          className="text-danger"
          onClick={() => onDelete(expense)}
        >
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  );
}

export function OperatingExpensesPanel() {
  const [search, setSearch] = useState('');
  const [createdAt, setCreatedAt] = useState('all');
  const [page, setPage] = useState(1);
  const [dialogState, setDialogState] = useState({ open: false, expense: null });
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const query = useOperatingExpenses({ search, createdAt, page, perPage: PAGE_SIZE });
  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteOperatingExpense();
  const { can } = usePermissions();
  const canCreate = can(PERMISSION_SECTIONS.analytics, 'create');
  const canEdit = can(PERMISSION_SECTIONS.analytics, 'edit');
  const canDelete = can(PERMISSION_SECTIONS.analytics, 'delete');

  const changeFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  const columns = [
    { key: 'expense', header: 'المصروف', cell: (item) => <span className="font-semibold">{item.expense}</span> },
    { key: 'amount', header: 'المبلغ', cell: (item) => formatMoneyOrDash(item.amount) },
    { key: 'createdAt', header: 'تاريخ الإضافة', cell: (item) => formatDate(item.created_at) },
    {
      key: 'actions',
      header: 'إجراءات',
      cell: (item) => (
        <ExpenseRowActions
          expense={item}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={(expense) => setDialogState({ open: true, expense })}
          onDelete={setExpenseToDelete}
        />
      ),
    },
  ];

  const confirmDelete = () => {
    deleteExpense(expenseToDelete.id, { onSuccess: () => setExpenseToDelete(null) });
  };

  return (
    <>
      <ReportPanel title="المصروفات التشغيلية" query={query} errorFallback="تعذّر تحميل المصروفات التشغيلية من الخادم.">
        {(data) => {
          const items = data?.items ?? data?.data ?? [];

          return (
            <>
              <KpiGrid
                items={buildKpis(data?.summary ?? {}, items)}
                className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
              />

              <ReportSection
                title="المصروفات التشغيلية"
                action={
                  canCreate && (
                    <Button size="sm" onClick={() => setDialogState({ open: true, expense: null })}>
                      <Plus className="size-4" />
                      إضافة مصروف
                    </Button>
                  )
                }
              >
                <div className="flex flex-wrap items-end gap-3">
                  <TextField placeholder="بحث باسم المصروف..." value={search} onChange={changeFilter(setSearch)} />
                  <SelectField value={createdAt} options={CREATED_AT_OPTIONS} onChange={changeFilter(setCreatedAt)} />
                </div>
                <DataTable columns={columns} rows={items} emptyMessage="لا توجد مصروفات لعرضها." />
                <Pagination page={page} lastPage={data?.pagination?.last_page} onPageChange={setPage} />
              </ReportSection>
            </>
          );
        }}
      </ReportPanel>

      <OperatingExpenseDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((current) => ({ ...current, open }))}
        expense={dialogState.expense}
      />
      <ConfirmDialog
        open={Boolean(expenseToDelete)}
        onOpenChange={(open) => !open && setExpenseToDelete(null)}
        title="حذف المصروف"
        description={`هل أنت متأكد من حذف المصروف ${expenseToDelete?.expense ?? ''}؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        destructive
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
