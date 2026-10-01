import { useEffect } from 'react';
import { SelectField } from '@/shared/components/ui/select-field';
import { TextField } from '@/shared/components/ui/text-field';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { useContractPeriodsForType, usePaymentTypes } from '../../hooks/use-reference-data';
import { CONTRACT_TYPE_OPTIONS } from '../../lib/orders-filters';
import { getReferenceLabel } from '../../lib/reference-options';
import { NO_EXTRA_FEE } from '../../schemas/payment-link-schema';
import { sanitizeSaudiContactInput } from '../../lib/saudi-contact';
import { formatContractPeriodPrice } from '../../lib/contract-periods';

/** Fields of the "create payment link" form. Periods and fees depend on the chosen contract type. */
export function PaymentLinkFields({ form }) {
  const { register, watch, getValues, setValue, formState } = form;
  const { errors } = formState;
  const contractType = watch('contract_type');
  const periodId = watch('period_id');
  const extraFeeId = watch('extra_fee_id');
  const { items: periods, options: periodOptions, isLoading } = useContractPeriodsForType(contractType);
  const { items: fees } = usePaymentTypes(contractType);

  // Keep the chosen period valid for the current contract type.
  useEffect(() => {
    const isStillValid = periods.some((period) => String(period.id) === periodId);
    if (isStillValid) return;
    const firstPeriodId = periods.length ? String(periods[0].id) : '';
    if (periodId !== firstPeriodId) setValue('period_id', firstPeriodId);
  }, [periods, periodId, setValue]);

  // The chosen fee's price is kept in the form so the submitted amount can include it.
  useEffect(() => {
    const fee = fees.find((item) => String(item.id) === extraFeeId);
    const amount = Number(fee?.price ?? fee?.amount ?? 0) || 0;
    if (getValues('extra_fee_amount') !== amount) setValue('extra_fee_amount', amount);
  }, [fees, extraFeeId, getValues, setValue]);

  const feeOptions = [
    { value: NO_EXTRA_FEE, label: 'بدون' },
    ...fees.map((fee) => ({ value: String(fee.id), label: getReferenceLabel(fee) })),
  ];
  const referencePrice = formatContractPeriodPrice(periods.find((period) => String(period.id) === periodId)?.price);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="رقم جوال العميل *"
          dir="ltr"
          inputMode="numeric"
          maxLength={12}
          placeholder="05xxxxxxxx"
          error={errors.mobile?.message}
          {...register('mobile', {
            onChange: (event) => setValue('mobile', sanitizeSaudiContactInput('phone', event.target.value)),
          })}
        />
        <TextField
          label="المبلغ المطلوب (ريال) *"
          type="number"
          min="1"
          placeholder="مثال: 349"
          error={errors.amount?.message}
          {...register('amount')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField label="نوع العقد" options={CONTRACT_TYPE_OPTIONS} {...register('contract_type')} />
        <SelectField
          label="عدد سنوات العقد"
          options={periodOptions}
          placeholder={isLoading ? 'جاري التحميل...' : 'اختر المدة'}
          disabled={isLoading || periods.length === 0}
          error={errors.period_id?.message}
          {...register('period_id')}
        />
        <SelectField label="رسوم إضافية (اختياري)" options={feeOptions} {...register('extra_fee_id')} />
      </div>

      {referencePrice && (
        <p className="w-fit rounded-full bg-accent px-3.5 py-1.5 text-sm font-bold text-accent-foreground">
          سعر العقد المرجعي: {referencePrice}
        </p>
      )}

      <TextareaField
        label="ملاحظات تود ذكرها"
        placeholder="إذا كانت رسوم العقد أكثر أو أقل من المعتاد، يرجى توضيح السبب..."
        {...register('notes')}
      />
    </>
  );
}
