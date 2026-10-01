import { useState } from 'react';
import { RichTextEditor } from '@/shared/components/rich-text-editor';
import { Button } from '@/shared/components/ui/button';
import { formatDate } from '@/shared/lib/format';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';

/** Rich-text editor + save button for one content page. `content` is the page loaded from the API. */
export function ContentPageForm({ content, isSaving, onSave }) {
  const { can } = usePermissions();
  const initialHtml = content?.description_ar || content?.description || '';
  const [html, setHtml] = useState(initialHtml);

  return (
    <div className="flex flex-col gap-6">
      {content?.updated_at && (
        <p className="text-sm text-muted-foreground">
          آخر تحديث: <span className="font-medium text-foreground">{formatDate(content.updated_at)}</span>
        </p>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-foreground">المحتوى</span>
        <RichTextEditor label="المحتوى" initialContent={initialHtml} onChange={setHtml} />
      </div>

      {can(PERMISSION_SECTIONS.app_content, 'edit') && (
        <div className="flex justify-end border-t border-border pt-4">
          <Button disabled={isSaving} onClick={() => onSave(html)} className="min-w-40">
            {isSaving ? 'جاري الحفظ...' : 'حفظ المحتوى'}
          </Button>
        </div>
      )}
    </div>
  );
}
