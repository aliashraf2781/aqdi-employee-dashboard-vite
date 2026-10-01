import { FileText, ImageUp, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/shared/components/ui/button';

const isPdfFile = (file) => file?.type === 'application/pdf' || file?.name?.toLowerCase().endsWith('.pdf');
const isPdfUrl = (url) => Boolean(url) && url.split('?')[0].toLowerCase().endsWith('.pdf');
const fileNameFromUrl = (url) => (url ? url.split('?')[0].split('/').pop() : '');

/**
 * Keeps one preview object URL for the picked file. The URL is created in the
 * pick handler (an event, not an effect) and revoked when replaced or on unmount.
 */
function usePickedPreview() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const latestUrl = useRef(null);

  useEffect(() => () => {
    if (latestUrl.current) URL.revokeObjectURL(latestUrl.current);
  }, []);

  const showFile = (file) => {
    if (latestUrl.current) URL.revokeObjectURL(latestUrl.current);
    latestUrl.current = file ? URL.createObjectURL(file) : null;
    setPreviewUrl(latestUrl.current);
  };

  return [previewUrl, showFile];
}

function PreviewBox({ isPdf, previewUrl, fileName, alt }) {
  if (isPdf) {
    return (
      <div className="flex h-40 items-center gap-3 rounded-lg border border-border bg-surface-muted p-4">
        <FileText className="size-8 text-danger" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">{fileName}</p>
          <p className="text-xs text-muted-foreground">PDF</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-40 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-muted">
      <img src={previewUrl} alt={alt} className="max-h-full max-w-full object-contain" />
    </div>
  );
}

/**
 * Pick / replace / remove one image (or PDF) with a live preview.
 * Controlled and form-agnostic: the parent keeps `{ file, removed }` and the saved `existingUrl`.
 */
export function FileUploadField({
  label,
  uploadTitle,
  hint,
  error,
  accept = 'image/*',
  allowPdf = false,
  file,
  existingUrl = '',
  removed = false,
  onPick,
  onRemove,
}) {
  const [blobUrl, showFile] = usePickedPreview();
  const savedUrl = removed ? '' : existingUrl;
  const previewUrl = (file && blobUrl) || savedUrl;
  const showPdf = file ? isPdfFile(file) : isPdfUrl(savedUrl);
  const fileName = file?.name || fileNameFromUrl(savedUrl);
  const acceptTypes = allowPdf ? `${accept},application/pdf` : accept;

  const handleChange = (event) => {
    const picked = event.target.files?.[0] ?? null;
    event.target.value = '';
    if (!picked) return;
    showFile(picked);
    onPick(picked);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}

      <div className="rounded-lg border border-dashed border-border bg-surface p-3">
        {previewUrl ? (
          <div className="flex flex-col gap-3">
            <PreviewBox isPdf={showPdf} previewUrl={previewUrl} fileName={fileName} alt={label || uploadTitle || 'معاينة'} />
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border px-4 text-sm font-medium hover:bg-accent">
                <ImageUp className="size-4" />
                تغيير
                <input type="file" accept={acceptTypes} className="hidden" onChange={handleChange} />
              </label>
              <Button type="button" variant="ghost" size="sm" className="text-danger" onClick={() => {
                  showFile(null);
                  onRemove();
                }}>
                <Trash2 className="size-4" />
                حذف
              </Button>
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-2 py-6 text-center">
            {allowPdf ? <FileText className="size-6 text-primary" /> : <ImageUp className="size-6 text-primary" />}
            <span className="text-sm font-bold text-foreground">{uploadTitle}</span>
            <span className="text-xs text-muted-foreground">{hint || (allowPdf ? 'صورة أو PDF' : 'PNG, JPG, WEBP')}</span>
            <input type="file" accept={acceptTypes} className="hidden" onChange={handleChange} />
          </label>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
