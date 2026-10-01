import { ImagePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useImageZoomPan } from '@/shared/hooks/use-image-zoom-pan';
import { cn } from '@/shared/lib/cn';

/** Local preview URL for a picked File (revoked when replaced); a string source is used as it is. */
function usePreviewUrl(source) {
  const isFile = typeof File !== 'undefined' && source instanceof File;
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!isFile) return undefined;
    const url = URL.createObjectURL(source);
    // An object URL is an external resource: it is created and revoked in the same effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview({ file: source, url });
    return () => URL.revokeObjectURL(url);
  }, [isFile, source]);

  if (isFile) return preview?.file === source ? preview.url : null;
  return typeof source === 'string' && source.trim() ? source : null;
}

/** The address card image with zoom/pan and a "replace image" button. */
export function AddressImageViewer({ source, onReplace }) {
  const src = usePreviewUrl(source);
  const zoom = useImageZoomPan({ enabled: Boolean(src), resetKey: src });
  const { attachContainer } = zoom;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
      <div
        ref={attachContainer}
        onMouseDown={zoom.handleMouseDown}
        onDoubleClick={zoom.resetTransform}
        className={cn('flex min-h-64 items-center justify-center overflow-hidden p-4', zoom.cursorClass)}
      >
        {src && (
          <div
            className="relative will-change-transform"
            style={{
              transform: `translate(${zoom.position.x}px, ${zoom.position.y}px) scale(${zoom.scale})`,
              transition: zoom.isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <img src={src} alt="صورة العنوان" draggable={false} className="h-auto max-h-96 w-auto max-w-full select-none object-contain" />
          </div>
        )}
      </div>

      {onReplace && (
        <label className="absolute start-3 top-3 z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-bold shadow-card">
          <ImagePlus className="size-3.5" />
          تغيير الصورة
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              event.target.value = '';
              if (file) onReplace(file);
            }}
          />
        </label>
      )}
    </div>
  );
}
