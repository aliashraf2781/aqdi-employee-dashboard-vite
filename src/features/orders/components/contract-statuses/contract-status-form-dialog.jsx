import { useMemo } from 'react';
import { FormDialog } from '@/shared/components/form-dialog';
import { ColorField } from '@/shared/components/ui/color-field';
import { TextField } from '@/shared/components/ui/text-field';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { useSaveContractStatus } from '../../hooks/use-save-contract-status';
import {
  buildContractStatusPayload,
  contractStatusToForm,
  EMPTY_CONTRACT_STATUS_FORM,
} from '../../lib/contract-status-form';
import { contractStatusSchema } from '../../schemas/contract-status-schema';

/** Add (no `status`) or edit (`status`) one contract status. */
export function ContractStatusFormDialog({ open, onOpenChange, status }) {
  const save = useSaveContractStatus({ onSuccess: () => onOpenChange(false) });
  // FormDialog resets the form when this object changes, so it must keep its identity between renders.
  const defaultValues = useMemo(() => (status ? contractStatusToForm(status) : EMPTY_CONTRACT_STATUS_FORM), [status]);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={status ? 'تعديل حالة العقد' : 'إضافة حالة العقد'}
      schema={contractStatusSchema}
      defaultValues={defaultValues}
      submitLabel={status ? 'حفظ التغييرات' : 'إضافة الحالة'}
      cancelLabel="رجوع"
      onSubmit={(values) => save.mutateAsync({ id: status?.id, payload: buildContractStatusPayload(values) })}
    >
      {({ register, watch, setValue, formState: { errors } }) => (
        <>
          <TextField label="اسم الحالة *" placeholder="ادخل اسم الحالة هنــا ..." error={errors.name?.message} {...register('name')} />
          <TextareaField label="شرح للعميل" rows={3} placeholder="شرح يظهر للعميل عند هذه الحالة..." {...register('client_explanation')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField
              label="لون النص"
              value={watch('color_text')}
              onPick={(color) => setValue('color_text', color)}
              {...register('color_text')}
            />
            <ColorField
              label="لون الخلفية *"
              value={watch('color')}
              onPick={(color) => setValue('color', color)}
              error={errors.color?.message}
              {...register('color')}
            />
          </div>
          <label className="flex items-center justify-between gap-3 text-sm font-bold">
            الحالة نشطة
            <input type="checkbox" className="size-5 accent-primary" {...register('is_active')} />
          </label>
        </>
      )}
    </FormDialog>
  );
}
