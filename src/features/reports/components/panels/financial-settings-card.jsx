import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '@/shared/components/ui/text-field';
import { useProfitSettings, useUpdateProfitSettings } from '../../hooks/use-profit-settings';
import { financialSettingsSchema } from '../../schemas/financial-settings-schema';
import { ReportSection } from '../report-section';

export const PROFIT_SETTING_FIELDS = [
  { name: 'moyasar_fee_percent', label: 'رسوم موياسر (%)', step: '0.05' },
  { name: 'meter_fee', label: 'رسوم نقل العداد باسم المستأجر (ريال)', step: '1' },
  { name: 'monthly_salaries', label: 'الرواتب الشهرية (ريال)', step: '500' },
  { name: 'operating_budget', label: 'المصاريف التشغيلية الشهرية (ريال)', step: '500' },
  { name: 'marketing_budget', label: 'الميزانية التسويقية الشهرية (ريال)', step: '500' },
];

/** Financial assumptions behind the profit reports. Each valid field is saved when the user leaves it. */
export function FinancialSettingsCard({ fieldNames, columnsClassName = 'grid-cols-1 gap-3', note }) {
  const { data: settings } = useProfitSettings();
  const { mutate: saveSettings } = useUpdateProfitSettings();
  const fields = PROFIT_SETTING_FIELDS.filter((field) => fieldNames.includes(field.name));

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(financialSettingsSchema), defaultValues: {} });

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const saveAll = handleSubmit((values) => saveSettings({ ...settings, ...values }));

  return (
    <ReportSection title="الإعدادات المالية (تُحفظ تلقائيًا)">
      <form className={`grid ${columnsClassName}`} onBlur={saveAll} noValidate>
        {fields.map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            type="number"
            min="0"
            step={field.step}
            error={errors[field.name]?.message}
            {...register(field.name)}
          />
        ))}
      </form>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </ReportSection>
  );
}
