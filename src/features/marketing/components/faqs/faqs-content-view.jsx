import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { DataTable } from '@/shared/components/data-table';
import { Pagination } from '@/shared/components/pagination';
import { Button } from '@/shared/components/ui/button';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { ContentPageSeoPanel } from '@/features/marketing/components/content/content-page-seo-panel';
import { FaqFormDialog } from '@/features/marketing/components/faqs/faq-form-dialog';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { useDeleteFaq, useFaqs } from '@/features/marketing/hooks/use-faqs';

const SECTION = PERMISSION_SECTIONS.faqs;

function buildColumns({ canEdit, canDelete, onEdit, onDelete }) {
  const columns = [
    { key: 'question', header: 'السؤال', className: 'min-w-48 font-bold', cell: (faq) => faq.title_ar || faq.title_trans || '—' },
    {
      key: 'answer',
      header: 'الجواب',
      className: 'max-w-md',
      cell: (faq) => <p className="line-clamp-3 whitespace-pre-wrap text-muted-foreground">{faq.answer_ar || faq.answer_trans || '—'}</p>,
    },
  ];

  if (canEdit || canDelete) {
    columns.push({
      key: 'actions',
      header: 'الإجراءات',
      cell: (faq) => (
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(faq)}>
              تعديل
            </Button>
          )}
          {canDelete && (
            <Button variant="outline" size="sm" className="text-danger" onClick={() => onDelete(faq)}>
              حذف
            </Button>
          )}
        </div>
      ),
    });
  }
  return columns;
}

/** FAQs index: page-level SEO card + the questions list with add / edit / delete. */
export function FaqsContentView() {
  const { can } = usePermissions();
  const [page, setPage] = useState(1);
  // `null` = closed, `{}` = adding, `{ faq }` = editing.
  const [dialog, setDialog] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data, isLoading } = useFaqs(page);
  const deleteFaq = useDeleteFaq(() => setDeleting(null));

  const columns = buildColumns({
    canEdit: can(SECTION, 'edit'),
    canDelete: can(SECTION, 'delete'),
    onEdit: (faq) => setDialog({ faq }),
    onDelete: setDeleting,
  });

  const addButton = can(SECTION, 'create') && (
    <Button size="sm" onClick={() => setDialog({})}>
      <Plus className="size-4" />
      إضافة
    </Button>
  );

  return (
    <div className="flex flex-col gap-4">
      <ContentPageSeoPanel pageKey="faqs" pageLabel="صفحة قائمة الأسئلة الشائعة" permissionSection={SECTION} />

      <SectionCard title="الأسئلة الشائعة" action={addButton}>
        <DataTable columns={columns} rows={data?.items ?? []} isLoading={isLoading} />
        <Pagination page={page} lastPage={data?.pagination?.last_page} onPageChange={setPage} />
      </SectionCard>

      {dialog && <FaqFormDialog open onOpenChange={(open) => !open && setDialog(null)} faq={dialog.faq} />}

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="هل أنت متأكد من حذف السؤال؟"
        description={`${deleting?.title_ar ?? ''} — هذا الإجراء لا يمكن التراجع عنه بعد الحذف.`}
        confirmLabel="تأكيـد الحـذف"
        destructive
        isLoading={deleteFaq.isPending}
        onConfirm={() => deleteFaq.mutate(deleting.id)}
      />
    </div>
  );
}
