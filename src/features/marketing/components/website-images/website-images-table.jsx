import { Badge } from '@/shared/components/badge';
import { Button } from '@/shared/components/ui/button';
import { DataTable } from '@/shared/components/data-table';
import { resolveImageUrl } from '@/features/marketing/lib/website-images';

const DASH = '—';

function ImageThumb({ row }) {
  const url = resolveImageUrl(row);
  return (
    <div className="size-11 overflow-hidden rounded-lg border border-border bg-surface">
      {url && <img src={url} alt="" loading="lazy" className="size-full object-contain" />}
    </div>
  );
}

function buildColumns({ canEdit, canDelete, onEdit, onDelete }) {
  return [
    { key: 'image', header: 'الصورة', cell: (row) => <ImageThumb row={row} /> },
    {
      key: 'label',
      header: 'التسمية',
      cell: (row) => (
        <>
          <div className="font-bold text-foreground">{row.label_ar || DASH}</div>
          {row.label_en && (
            <div dir="ltr" className="text-xs text-muted-foreground">
              {row.label_en}
            </div>
          )}
        </>
      ),
    },
    {
      key: 'key',
      header: 'المفتاح',
      cell: (row) => (
        <code dir="ltr" className="rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-accent-foreground">
          {row.key}
        </code>
      ),
    },
    { key: 'alt', header: 'النص البديل', className: 'max-w-xs truncate', cell: (row) => row.alt_ar || DASH },
    { key: 'meta', header: 'عنوان الميتا', className: 'max-w-xs truncate', cell: (row) => row.meta_title_ar || DASH },
    {
      key: 'status',
      header: 'الحالة',
      cell: (row) => <Badge tone={row.is_active === false ? 'neutral' : 'success'}>{row.is_active === false ? 'غير مفعّلة' : 'مفعّلة'}</Badge>,
    },
    {
      key: 'actions',
      header: 'الإجراءات',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
            {canEdit ? 'تعديل' : 'عرض'}
          </Button>
          {canDelete && (
            <Button variant="outline" size="sm" className="text-danger" onClick={() => onDelete(row)}>
              حذف
            </Button>
          )}
        </div>
      ),
    },
  ];
}

export function WebsiteImagesTable({ rows, isLoading, ...actions }) {
  return (
    <DataTable
      columns={buildColumns(actions)}
      rows={rows}
      isLoading={isLoading}
      emptyMessage="لا توجد صور مطابقة. جرّب «مزامنة الافتراضيات» لإنشاء الفهرس."
    />
  );
}
