import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { DataTable } from '@/shared/components/data-table';
import { Pagination } from '@/shared/components/pagination';
import { Button } from '@/shared/components/ui/button';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { usePermissions } from '@/features/permissions';
import { SettingsPageHeader } from '@/features/settings/components/settings-page-header';
import { CRUD_ADD_LABEL } from '@/features/settings/crud/crud-config';
import { CrudDetailsDialog } from '@/features/settings/crud/crud-details-dialog';
import { CrudFilters } from '@/features/settings/crud/crud-filters';
import { CrudFormDialog } from '@/features/settings/crud/crud-form-dialog';
import { CrudRowActions } from '@/features/settings/crud/crud-row-actions';
import { useCrudList } from '@/features/settings/crud/use-crud-list';
import { useCrudMutations } from '@/features/settings/crud/use-crud-mutations';

const FIRST_PAGE = 1;
const DEFAULT_DELETE_TITLE = 'هل أنت متأكد من الحذف؟';

/**
 * One generic admin list: table + filters + pagination + add/edit dialog + delete confirmation.
 * Everything specific to a resource lives in its config (see crud-config.js).
 */
export function CrudPage({ config }) {
  const { can } = usePermissions();
  const [page, setPage] = useState(FIRST_PAGE);
  const [filterValues, setFilterValues] = useState({});
  const [formTarget, setFormTarget] = useState(null); // null = closed, { row: null } = add
  const [viewedRow, setViewedRow] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);

  const filters = useDebouncedValue(filterValues);
  const list = useCrudList(config, { page, filters });
  const { save, remove } = useCrudMutations(config, {
    onSaved: () => setFormTarget(null),
    onDeleted: () => setRowToDelete(null),
  });

  const deleteTitle = rowToDelete && config.deleteTitle ? config.deleteTitle(rowToDelete) : DEFAULT_DELETE_TITLE;

  const canCreate = can(config.section, 'create');
  const canEdit = can(config.section, 'edit');
  const canDelete = Boolean(config.api.remove) && can(config.section, 'delete');
  const showActions = Boolean(config.details) || canEdit || canDelete;

  const columns = useMemo(() => {
    if (!showActions) return config.columns;
    const actionsColumn = {
      key: 'actions',
      header: 'الإجراءات',
      cell: (row) => (
        <CrudRowActions
          row={row}
          onView={config.details ? setViewedRow : undefined}
          onEdit={canEdit ? (target) => setFormTarget({ row: target }) : undefined}
          onDelete={canDelete ? setRowToDelete : undefined}
        />
      ),
    };
    return [...config.columns, actionsColumn];
  }, [config, showActions, canEdit, canDelete]);

  const changeFilter = (name, value) => {
    setFilterValues((current) => ({ ...current, [name]: value }));
    setPage(FIRST_PAGE);
  };

  const submitForm = async (values, row) => {
    try {
      await save.mutateAsync({ row, values });
    } catch {
      // The mutation already showed an error toast; keep the dialog open for a retry.
    }
  };

  return (
    <div>
      <SettingsPageHeader
        title={config.title}
        description={config.subtitle}
        actions={
          canCreate && (
            <Button onClick={() => setFormTarget({ row: null })}>
              <Plus className="size-4" />
              {CRUD_ADD_LABEL}
            </Button>
          )
        }
      />

      {config.filters && <CrudFilters filters={config.filters} values={filterValues} onChange={changeFilter} />}

      <DataTable
        columns={columns}
        rows={list.data?.rows}
        isLoading={list.isLoading}
        getRowKey={config.getRowKey}
      />
      <Pagination page={page} lastPage={list.data?.lastPage} onPageChange={setPage} />

      {formTarget && (
        <CrudFormDialog config={config} row={formTarget.row} onClose={() => setFormTarget(null)} onSubmit={submitForm} />
      )}

      {viewedRow && <CrudDetailsDialog details={config.details} row={viewedRow} onClose={() => setViewedRow(null)} />}

      <ConfirmDialog
        open={Boolean(rowToDelete)}
        onOpenChange={(open) => !open && setRowToDelete(null)}
        title={deleteTitle}
        description="هذا الإجراء لا يمكن التراجع عنه بعد الحذف! سيتم فقدان كافة البيانات المرتبطة بهذا العنصر."
        confirmLabel="تأكيد الحذف"
        destructive
        isLoading={remove.isPending}
        onConfirm={() => remove.mutate(rowToDelete)}
      />
    </div>
  );
}
