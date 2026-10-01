import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { DataTable } from '@/shared/components/data-table';
import { QueryState } from '@/shared/components/query-state';
import { StatCardRow } from '@/shared/components/stat-card';
import { Button } from '@/shared/components/ui/button';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { ContentPageSeoPanel } from '@/features/marketing/components/content/content-page-seo-panel';
import { PublishStatusBadge } from '@/features/marketing/components/shared/chips';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { ServicePageFormDialog } from '@/features/marketing/components/services/service-page-form-dialog';
import { useDeleteServicePage, useServicePages } from '@/features/marketing/hooks/use-service-pages';
import { formatInt } from '@/features/marketing/lib/format';

const SECTION = PERMISSION_SECTIONS.analytics;
const DASH = '—';

function buildColumns({ canEdit, canDelete, onEdit, onDelete }) {
  const columns = [
    { key: 'title', header: 'العنوان', cell: (row) => <b>{row.title}</b> },
    {
      key: 'path',
      header: 'الرابط',
      cell: (row) =>
        row.url ? (
          <a dir="ltr" href={row.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            {row.path}
          </a>
        ) : (
          <span dir="ltr">{row.path}</span>
        ),
    },
    { key: 'keyword', header: 'الكلمة المستهدفة', cell: (row) => row.target_keyword || DASH },
    { key: 'meta', header: 'عنوان الميتا', className: 'max-w-48 truncate', cell: (row) => row.meta_title || DASH },
    { key: 'status', header: 'الحالة', cell: (row) => <PublishStatusBadge status={row.status_label_ar || row.status} /> },
    { key: 'updated', header: 'آخر تحديث', cell: (row) => row.updated_at || DASH },
  ];

  if (canEdit || canDelete) {
    columns.push({
      key: 'actions',
      header: '',
      cell: (row) => (
        <div className="flex gap-2">
          {canEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
              تحرير
            </Button>
          )}
          {canDelete && (
            <Button variant="outline" size="sm" className="text-danger" onClick={() => onDelete(row)}>
              حذف
            </Button>
          )}
        </div>
      ),
    });
  }
  return columns;
}

/** Service pages: index-page SEO, counters and the CRUD list. */
export function ServicePagesView() {
  const { can } = usePermissions();
  const { summary, items, isLoading, error, refetch } = useServicePages();
  // `null` = closed, `{}` = adding, `{ page }` = editing.
  const [dialog, setDialog] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const deletePage = useDeleteServicePage(() => setDeleting(null));

  const cards = [
    { value: formatInt(summary?.total ?? 0), label: 'إجمالي الصفحات', tone: 'primary' },
    { value: formatInt(summary?.published ?? 0), label: 'منشورة', tone: 'success' },
    { value: formatInt(summary?.drafts ?? 0), label: 'مسودات', tone: 'warning' },
  ];

  const columns = buildColumns({
    canEdit: can(SECTION, 'edit'),
    canDelete: can(SECTION, 'delete'),
    onEdit: (page) => setDialog({ page }),
    onDelete: setDeleting,
  });

  const addButton = can(SECTION, 'create') && (
    <Button size="sm" onClick={() => setDialog({})}>
      <Plus className="size-4" />
      صفحة جديدة
    </Button>
  );

  return (
    <div className="flex flex-col gap-4">
      <ContentPageSeoPanel pageKey="services" pageLabel="صفحة قائمة الخدمات" permissionSection={SECTION} />
      <StatCardRow items={cards} className="xl:grid-cols-3" />

      <SectionCard title="صفحات الخدمات والصفحات الثابتة للموقع" action={addButton}>
        <QueryState isLoading={isLoading} error={error} onRetry={refetch}>
          <DataTable columns={columns} rows={items} emptyMessage="لا توجد صفحات خدمات بعد." />
        </QueryState>
      </SectionCard>

      {dialog && <ServicePageFormDialog open onOpenChange={(open) => !open && setDialog(null)} page={dialog.page} />}

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="حذف الصفحة"
        description={`حذف «${deleting?.title ?? ''}»؟`}
        confirmLabel="حذف"
        destructive
        isLoading={deletePage.isPending}
        onConfirm={() => deletePage.mutate(deleting.id)}
      />
    </div>
  );
}
