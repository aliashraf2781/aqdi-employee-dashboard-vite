import { useMemo } from 'react';
import { FormDialog } from '@/shared/components/form-dialog';
import { ChoiceCards } from '@/shared/components/ui/choice-cards';
import { TextField } from '@/shared/components/ui/text-field';
import { useUpdateOrder } from '../../hooks/use-update-order';
import { DEED_ADDITION_METHODS, propertyUpdateSchema, resolveDeedNumber } from '../../schemas/property-update-schema';

/** "رفع تحديث بيانات العقار": how the deed was added and its number. */
export function PropertyUpdateDialog({ open, onOpenChange, orderData, queryKey }) {
  const update = useUpdateOrder({ queryKey, successMessage: 'تم رفع تحديث العقار بنجاح', onSuccess: () => onOpenChange(false) });
  // FormDialog resets the form when this object changes, so it must keep its identity between renders.
  const defaultValues = useMemo(() => ({ method: '', deed_number: resolveDeedNumber(orderData) }), [orderData]);

  return (
    <FormDialog
      open={open}
      onOpenChange={(next) => !update.isPending && onOpenChange(next)}
      title="رفع تحديث بيانات العقار"
      schema={propertyUpdateSchema}
      defaultValues={defaultValues}
      submitLabel="تأكيد رفع العقار ✓"
      cancelLabel="تراجع"
      onSubmit={(values) =>
        update.mutateAsync({ orderId: orderData?.id, body: { deed_addition_method: values.method, deed_number: values.deed_number } })
      }
    >
      {({ watch, setValue, register, formState: { errors } }) => (
        <>
          <ChoiceCards
            label="الرجاء تحديد طريقة الإضافة *"
            options={DEED_ADDITION_METHODS}
            value={watch('method')}
            onChange={(method) => setValue('method', method, { shouldValidate: true })}
            error={errors.method?.message}
          />
          <TextField label="الرجاء إدخال رقم الصك *" placeholder="رقم الصك" error={errors.deed_number?.message} {...register('deed_number')} />
        </>
      )}
    </FormDialog>
  );
}
