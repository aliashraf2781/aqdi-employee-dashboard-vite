import { Loader2, RotateCw, Search } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { QueryState } from '@/shared/components/query-state';
import { Button } from '@/shared/components/ui/button';
import { SelectField } from '@/shared/components/ui/select-field';
import { TextField } from '@/shared/components/ui/text-field';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { WebsiteImageEditDialog } from '@/features/marketing/components/website-images/website-image-edit-dialog';
import { WebsiteImagesSummary } from '@/features/marketing/components/website-images/website-images-summary';
import { WebsiteImagesTable } from '@/features/marketing/components/website-images/website-images-table';
import {
  useDeleteWebsiteImage,
  useSyncWebsiteImageDefaults,
  useUpdateWebsiteImage,
  useWebsiteImages,
} from '@/features/marketing/hooks/use-website-images';

const SEARCH_DEBOUNCE_MS = 350;
const ACTIVE_FILTER_VALUES = { all: null, active: true, inactive: false };
const ACTIVE_FILTER_OPTIONS = [
  { value: 'all', label: 'الكل' },
  { value: 'active', label: 'المفعّلة' },
  { value: 'inactive', label: 'غير المفعّلة' },
];

/** Website images SEO catalog: summary, filters, table, edit and delete dialogs. */
export function WebsiteImagesSection() {
  const { can } = usePermissions();
  const section = PERMISSION_SECTIONS.website_images;

  const [searchInput, setSearchInput] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const search = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS);
  const { data, isLoading, isFetching, error, refetch } = useWebsiteImages({ search, isActive: ACTIVE_FILTER_VALUES[activeFilter] });
  const updateImage = useUpdateWebsiteImage();
  const deleteImage = useDeleteWebsiteImage();
  const syncDefaults = useSyncWebsiteImageDefaults();

  const handleSave = (payload) => updateImage.mutateAsync({ id: editing.id, ...payload }).then(() => setEditing(null));
  const handleDelete = () => deleteImage.mutate(deleting.id, { onSuccess: () => setDeleting(null) });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-foreground">صور الموقع و الـ SEO</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            حرّر النص البديل وعنوان ووصف الميتا لكل صورة تظهر في الموقع العام. ترك الحقل فارغًا يعني الرجوع للنص الافتراضي.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="تحديث" onClick={() => refetch()}>
            <RotateCw className={isFetching ? 'size-4 animate-spin' : 'size-4'} />
          </Button>
          {can(section, 'create') && (
            <Button variant="outline" onClick={() => syncDefaults.mutate()} disabled={syncDefaults.isPending}>
              {syncDefaults.isPending && <Loader2 className="size-4 animate-spin" />}
              مزامنة الافتراضيات
            </Button>
          )}
        </div>
      </div>

      <WebsiteImagesSummary summary={data?.summary} />

      <div className="flex flex-wrap items-end gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <TextField
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="بحث بالمفتاح أو التسمية..."
            aria-label="بحث"
            className="ps-9"
          />
        </div>
        <SelectField value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)} options={ACTIVE_FILTER_OPTIONS} aria-label="الحالة" />
      </div>

      <QueryState error={error} onRetry={refetch} errorFallback="تعذر تحميل فهرس صور الموقع">
        <WebsiteImagesTable
          rows={data?.items}
          isLoading={isLoading}
          canEdit={can(section, 'edit')}
          canDelete={can(section, 'delete')}
          onEdit={setEditing}
          onDelete={setDeleting}
        />
      </QueryState>

      {editing && (
        <WebsiteImageEditDialog
          key={editing.id}
          open
          onOpenChange={(open) => !open && setEditing(null)}
          item={editing}
          canEdit={can(section, 'edit')}
          onSubmit={handleSave}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="حذف صورة من الفهرس"
        description={`سيتم حذف السجل ${deleting?.label_ar || deleting?.key || ''} من فهرس صور الموقع. لن يُحذف ملف الصورة نفسه، وسيرجع الموقع إلى النص الافتراضي. يمكنك إعادة إنشائه لاحقًا عبر «مزامنة الافتراضيات».`}
        confirmLabel="تأكيد الحذف"
        destructive
        isLoading={deleteImage.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
