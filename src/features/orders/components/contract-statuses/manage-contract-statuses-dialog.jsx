import { Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { EmptyState } from '@/shared/components/empty-state';
import { Modal } from '@/shared/components/modal';
import { PageLoader } from '@/shared/components/page-loader';
import { useContractStatuses } from '../../hooks/use-contract-statuses';
import { ContractStatusFormDialog } from './contract-status-form-dialog';

function StatusRow({ status, canEdit, onEdit }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
      <span className="size-4 shrink-0 rounded-full" style={{ backgroundColor: status.color }} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{status.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {status.is_active === false ? 'غير نشطة' : 'نشطة'}
          {status.client_explanation ? ` — ${status.client_explanation}` : ''}
        </p>
      </div>
      {canEdit && (
        <Button variant="ghost" size="icon" className="size-9 rounded-full" aria-label="تعديل الحالة" onClick={() => onEdit(status)}>
          <Pencil className="size-4" />
        </Button>
      )}
    </li>
  );
}

/** Lists the contract statuses and opens the add/edit form. */
export function ManageContractStatusesDialog({ open, onOpenChange, canCreate = false, canEdit = false }) {
  const all = useContractStatuses({ enabled: open, activeOnly: false });
  const active = useContractStatuses({ enabled: open });
  const [form, setForm] = useState({ open: false, status: null });

  const statuses = all.items.length > 0 ? all.items : active.items;
  const openForm = (status = null) => setForm({ open: true, status });
  const closeForm = (isOpen) => setForm((previous) => ({ ...previous, open: isOpen }));

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="حالات العقود"
        size="lg"
        footer={
          canCreate && (
            <Button onClick={() => openForm()}>
              <Plus className="size-4" />
              إضافة حالة
            </Button>
          )
        }
      >
        {all.isLoading ? (
          <PageLoader />
        ) : statuses.length === 0 ? (
          <EmptyState message="لا توجد حالات حالياً" />
        ) : (
          <ul className="max-h-96 space-y-2 overflow-y-auto">
            {statuses.map((status) => (
              <StatusRow key={status.id} status={status} canEdit={canEdit} onEdit={openForm} />
            ))}
          </ul>
        )}
      </Modal>

      <ContractStatusFormDialog open={form.open} onOpenChange={closeForm} status={form.status} />
    </>
  );
}
