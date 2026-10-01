import { Download, Minus, Plus, Share2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { IconButton } from '@/shared/components/icon-button';
import { Modal } from '@/shared/components/modal';
import { useImageZoomPan } from '@/shared/hooks/use-image-zoom-pan';
import { cn } from '@/shared/lib/cn';

/**
 * Previews an image (zoom, pan, share) or a PDF, with a download button.
 * `onDownload(url, filename)` performs the download and resolves true on success.
 */
export function MediaPreviewDialog({ open, onOpenChange, url, isPdf = false, title = 'معاينة الملف', subtitle, onDownload }) {
  const [downloading, setDownloading] = useState(false);
  const zoom = useImageZoomPan({ enabled: open && !isPdf, resetKey: `${open}-${url}` });
  const { attachContainer } = zoom;

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      // the user cancelled the share sheet: fall through to opening the file
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const download = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const ok = await onDownload(url, subtitle);
      if (ok) toast.success('تم التحميل بنجاح');
      else toast.error('تعذر تحميل الملف');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={subtitle}
      size="lg"
      footer={
        <>
          {url && onDownload && (
            <Button variant="outline" onClick={download} disabled={downloading}>
              <Download className="size-4" />
              {downloading ? 'جاري التحميل...' : 'تحميل'}
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>إغلاق</Button>
        </>
      }
    >
      {open && url ? (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-muted">
          <div className="absolute start-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2">
            <IconButton label="مشاركة" onClick={share}>
              <Share2 className="size-4" />
            </IconButton>
            <IconButton label="تصغير" onClick={zoom.zoomOut} disabled={isPdf}>
              <Minus className="size-4" />
            </IconButton>
            <IconButton label="تكبير" onClick={zoom.zoomIn} disabled={isPdf}>
              <Plus className="size-4" />
            </IconButton>
          </div>

          <div
            ref={attachContainer}
            onMouseDown={zoom.handleMouseDown}
            onDoubleClick={zoom.resetTransform}
            className={cn('flex min-h-96 w-full items-center justify-center overflow-hidden p-4', !isPdf && zoom.cursorClass)}
          >
            {isPdf ? (
              <iframe src={url} title={title} className="h-96 w-full rounded-xl border-0 bg-surface" />
            ) : (
              <div
                className="relative will-change-transform"
                style={{
                  transform: `translate(${zoom.position.x}px, ${zoom.position.y}px) scale(${zoom.scale})`,
                  transition: zoom.isDragging ? 'none' : 'transform 0.15s ease-out',
                }}
              >
                <img src={url} alt={title} draggable={false} className="h-auto max-h-96 w-auto max-w-full select-none object-contain" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-muted-foreground">لا يوجد ملف للمعاينة</p>
      )}
    </Modal>
  );
}
