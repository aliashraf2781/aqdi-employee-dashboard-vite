import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { QueryState } from '@/shared/components/query-state';
import { Button } from '@/shared/components/ui/button';
import { SelectField } from '@/shared/components/ui/select-field';
import { TextField } from '@/shared/components/ui/text-field';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { buildTaggedUrl, buildUtmSeed } from '@/features/marketing/lib/utm';

const EMPTY_SOURCE_OPTION = { value: '', label: '—' };

/** Builds a campaign link with UTM tags. Nothing is saved: it only prepares a url to copy. */
export function UtmBuilderCard({ utm }) {
  const seed = useMemo(() => buildUtmSeed(utm.example, utm.sources), [utm.example, utm.sources]);
  const { register, control } = useForm({ values: seed });
  const taggedUrl = buildTaggedUrl(useWatch({ control }));

  const sourceOptions = [
    EMPTY_SOURCE_OPTION,
    ...utm.sources.map((source) => ({ value: source.source, label: source.label_ar ? `${source.source} — ${source.label_ar}` : source.source })),
  ];

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(taggedUrl);
      toast.success('تم نسخ الرابط');
    } catch {
      toast.error('تعذر النسخ');
    }
  };

  return (
    <SectionCard title="مولّد روابط UTM لوسم الحملات" className="mt-4">
      <QueryState isLoading={utm.isLoading} error={utm.error} onRetry={utm.refetch}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <TextField {...register('url')} dir="ltr" label="الرابط" placeholder="https://aqdi.sa" />
          <SelectField {...register('source')} label="المصدر (source)" options={sourceOptions} />
          <TextField {...register('medium')} dir="ltr" label="الوسيط (medium)" />
          <TextField {...register('campaign')} dir="ltr" label="الحملة (campaign)" />
          <TextField {...register('content')} dir="ltr" label="المحتوى (content)" />
          <TextField {...register('term')} dir="ltr" label="الكلمة (term)" />
        </div>

        {utm.template && (
          <p dir="ltr" className="mt-3 text-start text-xs text-muted-foreground">
            القالب المعتمد: <code>{utm.template}</code>
          </p>
        )}

        <div dir="ltr" className="mt-3 min-h-10 break-all rounded-md border border-border bg-surface-muted px-3 py-2 text-start text-xs font-medium">
          {taggedUrl || 'أدخل الرابط والمصدر لتوليد الرابط الموسوم'}
        </div>

        <Button variant="outline" size="sm" className="mt-3" onClick={copyUrl} disabled={!taggedUrl}>
          نسخ الرابط الموسوم
        </Button>

        {utm.clickIds.length > 0 && (
          <p dir="ltr" className="mt-3 text-start text-xs text-muted-foreground">
            معرّفات النقر المتتبَّعة تلقائيًا: {utm.clickIds.join(', ')}
          </p>
        )}
      </QueryState>
    </SectionCard>
  );
}
