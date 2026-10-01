import { Copy, ExternalLink, Eye, ImageIcon, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { useDownloadMedia } from '../../hooks/use-download-media';
import { getAddressImageUrl, getAddressMapsUrl, getTextAddressFields } from '../../lib/national-address-tabs';
import { CardBadge } from './detail-primitives';
import { Field } from './detail-fields';
import { MediaPreview } from './media-preview';

export function TextAddressPanel({ address }) {
  return (
    <div className="space-y-2">
      {getTextAddressFields(address).map((field) => (
        <Field key={field.label} label={field.label} value={field.value} />
      ))}
    </div>
  );
}

export function MapAddressPanel({ address }) {
  const mapsUrl = getAddressMapsUrl(address);
  if (!mapsUrl) return null;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface-muted p-3">
      <CardBadge tone="success">
        <MapPin className="size-3" />
        رابط خرائط قوقل
      </CardBadge>

      {address.embed_url && (
        <iframe
          src={address.embed_url}
          title="موقع العقار على الخريطة"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-56 w-full rounded-xl border border-border bg-surface"
        />
      )}

      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" dir="ltr" title={mapsUrl} className="block truncate text-xs font-bold text-primary underline">
        {mapsUrl}
      </a>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => copyToClipboard(mapsUrl, 'تم النسخ بنجاح')}>
          <Copy className="size-3.5" />
          نسخ الرابط
        </Button>
        <Button size="sm" asChild>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3.5" />
            فتح في الخرائط
          </a>
        </Button>
      </div>
    </div>
  );
}

export function ImageAddressPanel({ address }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { download, isDownloading } = useDownloadMedia();
  const imageUrl = getAddressImageUrl(address);
  if (!imageUrl) return null;

  return (
    <>
      <div className="space-y-3 rounded-xl border border-border bg-surface-muted p-3">
        <CardBadge tone="info">
          <ImageIcon className="size-3" />
          صورة بطاقة العنوان
        </CardBadge>

        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="flex max-h-56 w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-surface p-2"
        >
          <img src={imageUrl} alt="صورة العنوان الوطني" className="max-h-52 max-w-full object-contain" />
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setPreviewOpen(true)} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
            <Eye className="size-3.5" />
            عرض
          </button>
          <button
            type="button"
            onClick={() => download(imageUrl, address.image_name)}
            disabled={isDownloading}
            className="text-xs font-bold text-muted-foreground hover:underline disabled:opacity-60"
          >
            {isDownloading ? 'جاري التحميل...' : 'تحميل'}
          </button>
        </div>
      </div>

      <MediaPreview open={previewOpen} onOpenChange={setPreviewOpen} url={imageUrl} title="معاينة العنوان الوطني" subtitle={address.image_name} />
    </>
  );
}
