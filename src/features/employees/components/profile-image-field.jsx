import { useEffect, useState } from 'react';
import { ImageUp } from 'lucide-react';

/**
 * Click-to-choose photo box. `onChange` receives the FileList (what the schema expects);
 * the preview shows the chosen file, else the current photo.
 */
export function ProfileImageField({ currentImage, onChange, error }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(event) {
    const files = event.target.files;
    onChange(files);
    setPreviewUrl(files?.[0] ? URL.createObjectURL(files[0]) : null);
  }

  const shownImage = previewUrl ?? currentImage;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">الصورة الشخصية</span>
      <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-border p-3 hover:border-primary">
        {shownImage ? (
          <img src={shownImage} alt="معاينة" className="size-14 shrink-0 rounded-full border border-border object-cover" />
        ) : (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted text-muted-foreground">
            <ImageUp className="size-6" />
          </span>
        )}
        <span className="text-sm text-muted-foreground">إضغط هنا لاختيار الصورة (PNG / JPEG)</span>
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
