import { Download, Eye } from 'lucide-react';
import greenRial from '@/assets/orders/green-rial.svg';
import { cn } from '@/shared/lib/cn';
import { useDownloadMedia } from '../../hooks/use-download-media';

const isMissing = (value) => value === '' || value == null;

/** "label ........ value" row. Renders nothing for an empty value. */
export function Field({ label, value }) {
  if (isMissing(value)) return null;
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="shrink-0 font-medium text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-start font-bold">{value}</span>
    </div>
  );
}

/** Label above value, for compact grids. */
export function GridField({ label, value }) {
  if (isMissing(value) || value === '—') return null;
  return (
    <div className="min-w-0">
      <p className="mb-0.5 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="truncate text-xs font-bold">{value}</p>
    </div>
  );
}

export function Money({ value, className }) {
  const amount = Number(typeof value === 'string' ? value.replace(/,/g, '').trim() : value);
  const text = Number.isFinite(amount) ? amount.toLocaleString('en-US') : '—';

  return (
    <span className={cn('inline-flex items-center gap-1 font-black text-success', className)}>
      {text}
      <img src={greenRial} alt="" className="size-3" />
    </span>
  );
}

/** Label + amount row; renders nothing for an empty or zero amount. */
export function MoneyField({ label, value, strong = false }) {
  const amount = Number(typeof value === 'string' ? value.replace(/,/g, '').trim() : value);
  if (!Number.isFinite(amount) || amount === 0) return null;

  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className={strong ? 'font-black' : 'font-medium text-muted-foreground'}>{label}</span>
      <Money value={value} className={strong ? 'text-sm' : undefined} />
    </div>
  );
}

/** A file of the order: name plus view (opens a preview) and download actions. */
export function FileRow({ label, fileName, fileUrl, onPreview }) {
  const { download, isDownloading } = useDownloadMedia();

  return (
    <div className="space-y-1.5 rounded-xl bg-muted px-3 py-2.5">
      {label && <p className="text-xs font-bold text-muted-foreground">{label}</p>}
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-bold text-muted-foreground">{fileName || 'لا يوجد مرفق'}</span>
        {fileUrl && (
          <div className="flex shrink-0 items-center gap-3">
            {onPreview && (
              <button type="button" onClick={onPreview} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                <Eye className="size-3.5" />
                عرض
              </button>
            )}
            <button
              type="button"
              onClick={() => download(fileUrl, fileName)}
              disabled={isDownloading}
              className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:underline disabled:opacity-60"
            >
              <Download className="size-3.5" />
              {isDownloading ? '...' : 'تحميل'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** A file with a single download action (no preview). */
export function DownloadLink({ label, url, name }) {
  const { download, isDownloading } = useDownloadMedia();
  if (!url) return null;

  return (
    <div className="space-y-1 rounded-xl bg-muted px-3 py-2.5">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <button
        type="button"
        onClick={() => download(url, name)}
        disabled={isDownloading}
        className="inline-flex max-w-full items-center gap-1.5 text-xs font-bold text-primary hover:underline disabled:opacity-60"
      >
        <Download className="size-3.5 shrink-0" />
        <span className="truncate">{isDownloading ? 'جاري التحميل...' : name || 'تحميل المرفق'}</span>
      </button>
    </div>
  );
}
