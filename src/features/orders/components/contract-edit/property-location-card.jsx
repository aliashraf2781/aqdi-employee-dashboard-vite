import { Copy, ExternalLink, MapPin } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { copyToClipboard } from '@/shared/lib/clipboard';

/** The saved map link (or coordinates) of the property with copy / open actions. */
export function PropertyLocationCard({ location }) {
  if (!location) return null;
  const { maps_url: mapsUrl, address_url: addressUrl, lat, lng } = location;
  const shownUrl = addressUrl || mapsUrl;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <MapPin className="size-4 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="text-sm font-bold">رابط الموقع</p>
          {addressUrl ? (
            <a href={addressUrl} target="_blank" rel="noopener noreferrer" dir="ltr" title={addressUrl} className="block truncate text-xs text-primary underline">
              {addressUrl}
            </a>
          ) : (
            lat != null &&
            lng != null && (
              <p dir="ltr" className="text-xs text-muted-foreground">
                {lat}, {lng}
              </p>
            )
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {shownUrl && (
          <Button type="button" size="sm" variant="outline" onClick={() => copyToClipboard(shownUrl, 'تم النسخ بنجاح')}>
            <Copy className="size-3.5" />
            نسخ
          </Button>
        )}
        {mapsUrl && (
          <Button size="sm" asChild>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5" />
              فتح الخريطة
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
