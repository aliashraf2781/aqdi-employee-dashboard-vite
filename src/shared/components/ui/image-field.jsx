import { ImageUp, Trash2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Button } from '@/shared/components/ui/button';

/**
 * Pick-an-image control with a live preview.
 * `file` is the newly picked File (or null); `savedUrl` is the image already stored on the server.
 */
export function ImageField({ label, file, savedUrl, onFileChange, onRemove, isRemoving = false }) {
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const shownUrl = previewUrl || savedUrl || null;
  const canRemove = Boolean(file || (savedUrl && onRemove));

  const handlePick = (event) => {
    onFileChange(event.target.files?.[0] ?? null);
    event.target.value = '';
  };

  const handleRemove = () => {
    if (file) onFileChange(null);
    else onRemove?.();
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      <div className="flex items-center gap-4">
        <label className="flex h-11 cursor-pointer items-center gap-2 rounded-md border border-dashed border-input bg-surface-muted px-4 text-sm text-muted-foreground hover:bg-accent">
          <ImageUp className="size-4" />
          اختر صورة
          <input type="file" accept="image/*" className="sr-only" onChange={handlePick} />
        </label>

        {shownUrl && (
          <div className="flex items-center gap-2">
            <img src={shownUrl} alt={label || 'معاينة'} className="size-16 rounded-lg border border-border object-contain" />
            {canRemove && (
              <Button type="button" variant="ghost" size="icon" disabled={isRemoving} onClick={handleRemove} aria-label="حذف الصورة">
                <Trash2 className="size-4 text-destructive" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
