import { QueryState } from '@/shared/components/query-state';
import { Badge } from '@/shared/components/badge';
import { SectionCard } from '@/features/marketing/components/shared/section-card';

function Field({ label, value, dir }) {
  const isEmpty = value === null || value === undefined || value === '';
  return (
    <div>
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <p className="break-words text-sm font-bold text-foreground" dir={dir}>
        {isEmpty ? '—' : value}
      </p>
    </div>
  );
}

function BoolField({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      {value === null || value === undefined ? (
        <p className="text-sm font-bold text-foreground">—</p>
      ) : (
        <Badge tone={value ? 'success' : 'danger'}>{value ? 'نعم' : 'لا'}</Badge>
      )}
    </div>
  );
}

const toSeconds = (milliseconds) => (milliseconds != null ? `${(milliseconds / 1000).toFixed(2)} ث` : null);

/** Stored technical data of one crawled page (status code, title, links, images...). */
export function PageInfoCard({ pageMeta, isLoading }) {
  return (
    <SectionCard title="بيانات الصفحة">
      <QueryState isLoading={isLoading} isEmpty={!pageMeta} emptyMessage="لا توجد بيانات صفحة مخزنة متاحة.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="رمز الاستجابة (HTTP)" value={pageMeta?.status_code} />
          <Field label="زمن التحميل" value={toSeconds(pageMeta?.load_time_ms)} />
          <Field label="نوع المحتوى" value={pageMeta?.content_type} dir="ltr" />
          <Field label="عنوان الصفحة" value={pageMeta?.title} />
          <Field label="عدد H1" value={pageMeta?.h1_count} />
          <Field label="عدد الصور" value={pageMeta?.image_count} />
          <Field label="صور بدون نص بديل" value={pageMeta?.images_missing_alt} />
          <Field label="روابط داخلية صادرة" value={pageMeta?.outbound_internal_links} />
          <Field label="روابط داخلية واردة" value={pageMeta?.inbound_internal_links} />
          <BoolField label="قابلة للفهرسة" value={pageMeta?.is_indexable} />
          <BoolField label="صفحة سليمة" value={pageMeta?.is_healthy} />
        </div>
        {pageMeta?.meta_description && (
          <div className="mt-4">
            <p className="mb-1 text-xs text-muted-foreground">وصف الميتا</p>
            <p className="text-sm text-foreground">{pageMeta.meta_description}</p>
          </div>
        )}
      </QueryState>
    </SectionCard>
  );
}
