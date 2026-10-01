import { useMemo } from 'react';
import { FormDialog } from '@/shared/components/form-dialog';
import { RichTextEditor } from '@/shared/components/rich-text-editor';
import { SelectField } from '@/shared/components/ui/select-field';
import { SwitchField } from '@/shared/components/ui/switch-field';
import { TextField } from '@/shared/components/ui/text-field';
import { useSavePopupContract } from '@/features/contract-settings/hooks/use-popup-contracts';
import {
  EMPTY_POPUP_FORM,
  buildPopupPayload,
  popupToFormValues,
  popupTypeOptionsFor,
} from '@/features/contract-settings/lib/popup-contracts';
import { popupContractSchema } from '@/features/contract-settings/schemas/popup-contract-schema';

/** Add (`item` is null) or edit one popup. `usedTypes` are document types that already have a popup. */
export function PopupContractFormDialog({ item, usedTypes, onClose }) {
  const save = useSavePopupContract({ onSaved: onClose });
  const defaultValues = useMemo(() => (item ? popupToFormValues(item) : EMPTY_POPUP_FORM), [item]);
  const typeOptions = popupTypeOptionsFor({ usedTypes, editedType: item?.instrument_type });

  const submit = async (values) => {
    try {
      await save.mutateAsync({ id: item?.id, payload: buildPopupPayload(values) });
    } catch {
      // The mutation already showed the error toast; the dialog stays open.
    }
  };

  return (
    <FormDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={item ? 'تعديل المحتوى الإرشادي' : 'إضافة محتوى إرشادي'}
      size="lg"
      schema={popupContractSchema}
      defaultValues={defaultValues}
      submitLabel={item ? 'حفظ' : 'إضافة'}
      onSubmit={submit}
    >
      {({ register, watch, setValue, formState: { errors } }) => (
        <>
          <SelectField
            label="نوع الوثيقة"
            placeholder={typeOptions.length === 0 ? 'لا توجد أنواع متاحة للإضافة' : 'اختر نوع الوثيقة'}
            options={typeOptions}
            value={watch('instrumentType')}
            onChange={(event) => setValue('instrumentType', event.target.value)}
            error={errors.instrumentType?.message}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <SwitchField
              label="بوب أب العقد"
              checked={watch('popupStatusContract')}
              onCheckedChange={(checked) => setValue('popupStatusContract', checked)}
            />
            <SwitchField
              label="بوب أب العقار"
              checked={watch('popupStatusRealestate')}
              onCheckedChange={(checked) => setValue('popupStatusRealestate', checked)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">محتوى البوب أب</span>
            <RichTextEditor
              label="محتوى البوب أب"
              placeholder="اكتب محتوى البوب أب هنا ..."
              initialContent={defaultValues.contentPopup}
              onChange={(html) => setValue('contentPopup', html)}
            />
            {errors.contentPopup && <p className="text-xs text-destructive">{errors.contentPopup.message}</p>}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="نص الزر" placeholder="مثال: ابدأ الآن" {...register('buttonText')} />
            <TextField label="رابط الزر" dir="ltr" placeholder="https://example.com" {...register('buttonLink')} />
          </div>
        </>
      )}
    </FormDialog>
  );
}
