import { MediaPreviewDialog } from '@/shared/components/media-preview-dialog';
import { absolutizeMediaUrl, downloadMedia, fileNameFromMediaUrl, isPdfMediaUrl } from '../../lib/media-url';

/** Preview of an order file (deed image, attachment, address card...). Accepts API or absolute urls. */
export function MediaPreview({ open, onOpenChange, url, title, subtitle }) {
  const mediaUrl = absolutizeMediaUrl(url);

  return (
    <MediaPreviewDialog
      open={open}
      onOpenChange={onOpenChange}
      url={mediaUrl}
      isPdf={isPdfMediaUrl(mediaUrl)}
      title={title || 'معاينة المرفق'}
      subtitle={subtitle}
      onDownload={(fileUrl, name) => downloadMedia(fileUrl, name || fileNameFromMediaUrl(fileUrl))}
    />
  );
}
