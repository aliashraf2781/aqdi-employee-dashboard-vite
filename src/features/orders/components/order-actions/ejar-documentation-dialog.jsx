import { useMemo } from 'react';
import { FormDialog } from '@/shared/components/form-dialog';
import { TextField } from '@/shared/components/ui/text-field';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { useDocumentInEjar } from '../../hooks/use-document-in-ejar';
import { ejarDocumentationSchema } from '../../schemas/ejar-documentation-schema';
import { OrderInfoTile } from '../return-request/order-info-tile';

/** "توثيق الطلب في إيجار": the Ejar contract number and optional notes. */
export function EjarDocumentationDialog({ open, onOpenChange, orderData, queryKey }) {
  const document = useDocumentInEjar({ orderData, queryKey, onSuccess: () => onOpenChange(false) });
  const defaultValues = useMemo(() => ({ ejar_number: orderData?.ejar_contract_number ?? '', notes: '' }), [orderData]);
  const employeeName = orderData?.received_contract?.employee?.name ?? orderData?.employee_name;

  return (
    <FormDialog
      open={open}
      onOpenChange={(next) => !document.isPending && onOpenChange(next)}
      title="توثيق الطلب في إيجار"
      schema={ejarDocumentationSchema}
      defaultValues={defaultValues}
      submitLabel="تأكيد التوثيق في إيجار"
      cancelLabel="تراجع"
      onSubmit={(values) => document.mutateAsync({ ejarNumber: values.ejar_number, notes: values.notes })}
    >
      {({ register, formState: { errors } }) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <OrderInfoTile label="نوع العقد" value={orderData?.contract_type_trans} />
            <OrderInfoTile label="رقم الطلب" value={orderData?.uuid ? `#${orderData.uuid}` : null} />
            <OrderInfoTile label="تاريخ إنشاء الطلب" value={orderData?.created_at_label} />
            <OrderInfoTile label="المبلغ المدفوع" value={orderData?.amount_payment} />
            <OrderInfoTile label="الموظف المستلم" value={employeeName} className="col-span-2" />
          </div>
          <TextField
            label="رقم العقد في إيجار *"
            placeholder="أدخل العقد الموثّق في منصة إيجار (10 أرقام)"
            error={errors.ejar_number?.message}
            {...register('ejar_number')}
          />
          <TextareaField label="ملاحظات تود ذكرها" rows={3} placeholder="اكتب ملاحظاتك هنا (اختياري)..." {...register('notes')} />
        </>
      )}
    </FormDialog>
  );
}
