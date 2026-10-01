import { FormDialog } from '@/shared/components/form-dialog';
import { FileField } from '@/shared/components/ui/file-field';
import { TextField } from '@/shared/components/ui/text-field';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { formatDateTimeShort } from '../../lib/format-date-time';
import { returnRequestDefaults, returnRequestSchema } from '../../schemas/return-request-schema';
import { OrderInfoTile } from './order-info-tile';

/** Step 1 of the return flow: refund amount, optional customer contract (PDF) and notes. */
export function ReturnRequestFormDialog({ open, onOpenChange, order, isPending, onSubmit }) {
  return (
    <FormDialog
      open={open}
      onOpenChange={(next) => !isPending && onOpenChange(next)}
      title="رفع طلب استرجاع"
      schema={returnRequestSchema}
      defaultValues={returnRequestDefaults}
      submitLabel={isPending ? 'جاري الإرسال...' : 'تأكيد الاسترجاع'}
      cancelLabel="تراجع"
      onSubmit={onSubmit}
    >
      {({ register, setValue, formState: { errors } }) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <OrderInfoTile label="نوع العقد" value={order?.contract_type} />
            <OrderInfoTile label="رقم الطلب" value={order?.uuid ? `#${order.uuid}` : null} />
            <OrderInfoTile label="تاريخ إنشاء الطلب" value={formatDateTimeShort(order?.created_at)} />
            <OrderInfoTile label="المبلغ المدفوع" value={order?.amount_payment} />
            <OrderInfoTile label="الموظف المستلم" value={order?.employee_name} className="col-span-2" />
          </div>

          <TextField
            label="قيمة المبلغ المسترجع *"
            type="number"
            min="0"
            step="any"
            placeholder="المبلغ بالريال"
            error={errors.refund_amount?.message}
            {...register('refund_amount')}
          />
          <FileField
            label="إرفاق عقد العميل (PDF) (اختياري)"
            accept="application/pdf"
            onFileChange={(file) => setValue('contract_file', file)}
          />
          <TextareaField label="ملاحظات تود ذكرها" rows={3} placeholder="أكتب هنا ..." {...register('notes')} />
        </>
      )}
    </FormDialog>
  );
}
