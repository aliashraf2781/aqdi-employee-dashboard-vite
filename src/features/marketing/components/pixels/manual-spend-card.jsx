import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { Button } from '@/shared/components/ui/button';
import { SelectField } from '@/shared/components/ui/select-field';
import { TextField } from '@/shared/components/ui/text-field';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { useImportAdSpend } from '@/features/marketing/hooks/use-marketing-integrations';
import { buildAdSpendRow } from '@/features/marketing/lib/ad-spend';
import { PLATFORM_OPTIONS } from '@/features/marketing/lib/platforms';
import { adSpendSchema, EMPTY_AD_SPEND } from '@/features/marketing/schemas/ad-spend-schema';

/** Enter one day of ad spend by hand (when an account is not synced automatically). */
export function ManualSpendCard() {
  const { register, handleSubmit, reset, formState } = useForm({ resolver: zodResolver(adSpendSchema), defaultValues: EMPTY_AD_SPEND });
  const importSpend = useImportAdSpend();
  const { errors } = formState;

  const onSubmit = (values) => {
    importSpend.mutate([buildAdSpendRow(values)], {
      onSuccess: (data) => {
        toast.success(`تم استيراد ${data?.synced ?? 1} صف`);
        // Keep date and platform: the next row is usually for the same day.
        reset({ ...values, campaign_name: '', spend: '', impressions: '', clicks: '' });
      },
      onError: (error) => toast.error(getErrorMessage(error, 'تعذّر استيراد صرف الإعلانات')),
    });
  };

  return (
    <SectionCard title="إدخال صرف إعلاني يدوي" className="mt-4">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <TextField {...register('spent_on')} type="date" label="التاريخ" error={errors.spent_on?.message} />
        <SelectField {...register('platform')} label="المنصة" options={PLATFORM_OPTIONS} error={errors.platform?.message} />
        <TextField {...register('campaign_name')} label="اسم الحملة" />
        <TextField {...register('spend')} type="number" min="0" step="0.01" label="الصرف (﷼)" error={errors.spend?.message} />
        <TextField {...register('impressions')} type="number" min="0" label="ظهور" />
        <TextField {...register('clicks')} type="number" min="0" label="نقرات" />
        <div className="flex items-end sm:col-span-2 xl:col-span-4">
          <Button type="submit" disabled={importSpend.isPending}>
            {importSpend.isPending ? 'جارٍ الحفظ…' : 'استيراد'}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
