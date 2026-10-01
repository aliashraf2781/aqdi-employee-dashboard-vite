import { useMemo } from 'react';
import { FormDialog } from '@/shared/components/form-dialog';
import { TextField } from '@/shared/components/ui/text-field';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { useApproveRefund } from '../hooks/use-approve-refund';
import { buildApprovalDefaults, needsRefundAmountInput, refundApprovalSchema } from '../schemas/refund-approval-schema';
import { RefundSummary } from './refund-summary';

/** The admin reviews a return request and approves it (optionally fixing the amount and adding notes). */
export function RefundReviewDialog({ open, onOpenChange, refund, order, refundsLookup, refundItems, onApproved }) {
  const approve = useApproveRefund({
    order,
    refund,
    refundsLookup,
    refundItems,
    onApproved: (approvedRefund) => {
      onApproved(approvedRefund);
      onOpenChange(false);
    },
  });

  // A stable object: FormDialog resets the form whenever its defaults change.
  const defaultValues = useMemo(() => buildApprovalDefaults(refund), [refund]);

  return (
    <FormDialog
      open={open}
      onOpenChange={(next) => !approve.isPending && onOpenChange(next)}
      title="طلب إسترجاع"
      schema={refundApprovalSchema}
      defaultValues={defaultValues}
      submitLabel={approve.isPending ? 'جاري الحفظ...' : 'حفظ'}
      onSubmit={(values) => approve.mutateAsync({ refundAmount: values.refund_amount, notes: values.notes?.trim() || null }).catch(() => {})}
    >
      {({ register, formState: { errors } }) => (
        <>
          <RefundSummary refund={refund} />
          {needsRefundAmountInput(refund) && (
            <TextField
              label="قيمة المبلغ المسترجع *"
              type="number"
              min="0"
              step="any"
              placeholder="أدخل قيمة المبلغ المسترجع ..."
              error={errors.refund_amount?.message}
              {...register('refund_amount')}
            />
          )}
          <TextareaField label="ملاحظات تود ذكرها" rows={3} placeholder="أكتب هنا ..." {...register('notes')} />
        </>
      )}
    </FormDialog>
  );
}
