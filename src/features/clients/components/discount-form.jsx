import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { CheckboxField } from '@/shared/components/ui/checkbox-field';
import { SelectField } from '@/shared/components/ui/select-field';
import { Spinner } from '@/shared/components/page-loader';
import { TextField } from '@/shared/components/ui/text-field';
import { DiscountTypeToggle } from '@/features/clients/components/discount-type-toggle';
import { APPLIES_TO_OPTIONS } from '@/features/clients/lib/client-discount';
import { DEFAULT_DISCOUNT_VALUES, discountSchema } from '@/features/clients/schemas/discount-schema';

/**
 * "Set up a custom discount" form. `onPreviewChange` reports the three fields that
 * drive the impact preview so the page can show it live next to the form.
 */
export function DiscountForm({ onSubmit, isSubmitting = false, onPreviewChange }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(discountSchema), defaultValues: DEFAULT_DISCOUNT_VALUES });

  const [type, value, appliesTo] = useWatch({ control, name: ['type', 'value', 'appliesTo'] });
  const notifyOnLogin = useWatch({ control, name: 'notifyOnLogin' });

  useEffect(() => {
    onPreviewChange?.({ type, value, appliesTo });
  }, [type, value, appliesTo, onPreviewChange]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">نوع الخصم</span>
        <Controller
          control={control}
          name="type"
          render={({ field }) => <DiscountTypeToggle value={field.value} onChange={field.onChange} />}
        />
      </div>

      <div>
        <TextField
          label="القيمة"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          error={errors.value?.message}
          {...register('value')}
        />
        <p className="mt-1 text-xs text-muted-foreground">على رسوم السنة الأولى</p>
      </div>

      <SelectField label="ينطبق على" options={APPLIES_TO_OPTIONS} {...register('appliesTo')} />

      <TextField label="ساري حتى (اختياري)" type="date" {...register('expiresAt')} />

      <TextField
        label="السبب"
        placeholder="مثال: عميل مميز / تعويض"
        error={errors.reason?.message}
        {...register('reason')}
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">إشعار العميل</span>
        <CheckboxField label="إشعاره عند تسجيل الدخول بأنه حصل على خصم" {...register('notifyOnLogin')} />
      </div>

      <TextField
        label="نص الرسالة"
        placeholder="تهانينا! حصلت على خصم خاص على رسوم السنة الأولى"
        disabled={!notifyOnLogin}
        error={errors.notificationMessage?.message}
        {...register('notificationMessage')}
      />

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? <Spinner className="size-4 text-primary-foreground" /> : 'حفظ الخصم (بالرمز السري)'}
      </Button>
    </form>
  );
}
