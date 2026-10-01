import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/dropdown-menu';
import { TextField } from '@/shared/components/ui/text-field';
import { openDialogAfterMenuClose } from '@/shared/lib/open-dialog-after-menu-close';
import { useActiveDraftStatuses, useUpdateDraftContract } from '../../hooks/use-draft-transfer';
import { getOrderDraftContractNumber, getOrderDraftStatusFromDetail } from '../../lib/draft-order';
import { ConfirmOrderStatusChangeDialog } from '../status-flow/confirm-status-change-dialog';

const draftNumberSchema = z.object({ draft_number: z.string().trim().min(1, 'يرجى إدخال رقم مسودة العقد') });

/** The status chip of the draft transfer. Colors come from the API; without one a neutral style is used. */
function StatusChip({ status, isUpdating, disabled }) {
  const hasColors = status?.color || status?.colorText;
  return (
    <button
      type="button"
      disabled={disabled}
      style={hasColors ? { backgroundColor: status.color, borderColor: status.color, color: status.colorText } : undefined}
      className="flex w-full items-center justify-between gap-2 rounded-2xl border border-danger bg-danger-soft px-4 py-3 text-xs font-bold text-danger transition-opacity disabled:opacity-70"
    >
      <span className="flex min-w-0 items-center gap-2">
        {isUpdating && <Loader2 className="size-4 shrink-0 animate-spin" />}
        <span className="truncate">{status?.name || 'اختر حالة التحويل'}</span>
      </span>
      <ChevronLeft className="size-4 shrink-0" />
    </button>
  );
}

/** Lease renewal: move the order to a draft status (with confirmation) and save the draft contract number. */
export function DraftTransfer({ orderId, orderData }) {
  const { statuses, isLoading } = useActiveDraftStatuses();
  const [selected, setSelected] = useState(() => getOrderDraftStatusFromDetail(orderData));
  const [pending, setPending] = useState(null);

  const numberForm = useForm({
    resolver: zodResolver(draftNumberSchema),
    defaultValues: { draft_number: getOrderDraftContractNumber(orderData) },
  });

  // When the order is reloaded (after a save) the form shows what the server now has.
  const [syncedOrder, setSyncedOrder] = useState(orderData);
  if (orderData !== syncedOrder) {
    setSyncedOrder(orderData);
    setSelected(getOrderDraftStatusFromDetail(orderData));
    numberForm.reset({ draft_number: getOrderDraftContractNumber(orderData) });
  }

  const updateStatus = useUpdateDraftContract({
    orderId,
    successMessage: 'تم تحديث حالة التحويل',
    errorMessage: 'حدث خطأ أثناء تحديث حالة التحويل',
    onSuccess: () => {
      if (pending) setSelected(pending);
      setPending(null);
    },
  });
  const saveNumber = useUpdateDraftContract({
    orderId,
    successMessage: 'تم حفظ رقم مسودة العقد',
    errorMessage: 'حدث خطأ أثناء حفظ رقم مسودة العقد',
  });

  // The confirmation opens after the menu has closed, otherwise focus is not restored properly.
  const choose = (item) =>
    openDialogAfterMenuClose(() => setPending({ id: item.id, name: item.name, color: item.color, colorText: item.color_text }));

  const submitNumber = ({ draft_number: draftNumber }) => {
    const body = { draft_contract_number: draftNumber };
    if (selected?.id) body.draft_contract_status_id = selected.id;
    return saveNumber.mutateAsync(body);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-sm font-black">تحويل الطلب :</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <StatusChip status={selected} isUpdating={updateStatus.isPending} disabled={isLoading || updateStatus.isPending} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {statuses.length ? (
              statuses.map((item) => (
                <DropdownMenuItem key={item.id} onSelect={() => choose(item)}>
                  <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: item.color, color: item.color_text }}>
                    {item.name}
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <p className="py-4 text-center text-xs text-muted-foreground">لا توجد حالات مسودة نشطة</p>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <form onSubmit={numberForm.handleSubmit(submitNumber)} className="flex flex-col gap-2 sm:flex-row sm:items-end" noValidate>
        <div className="flex-1">
          <TextField
            label="رقم مسودة العقد :"
            placeholder="أدخل رقم مسودة العقد هنا..."
            error={numberForm.formState.errors.draft_number?.message}
            {...numberForm.register('draft_number')}
          />
        </div>
        <Button type="submit" disabled={saveNumber.isPending}>
          {saveNumber.isPending ? <Loader2 className="size-4 animate-spin" /> : 'حفظ'}
        </Button>
      </form>

      <ConfirmOrderStatusChangeDialog
        open={Boolean(pending)}
        onOpenChange={(next) => !next && setPending(null)}
        title="تأكيد تغيير حالة التحويل"
        statusName={pending?.name}
        orderLabel={orderData?.uuid ?? orderId}
        isPending={updateStatus.isPending}
        onConfirm={() => updateStatus.mutate({ draft_contract_status_id: pending.id })}
      />
    </div>
  );
}
