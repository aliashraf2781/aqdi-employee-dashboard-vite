import { Download, Eye, Pencil } from 'lucide-react';
import greenRial from '@/assets/orders/green-rial.svg';
import { cn } from '@/shared/lib/cn';
import { useDownloadMedia } from '../../hooks/use-download-media';

/** Color families of the detail cards: top bar color and icon chip. */
const TONE_CLASSES = {
  brand: { bar: 'bg-primary', icon: 'bg-accent text-primary' },
  info: { bar: 'bg-info', icon: 'bg-info-soft text-info' },
  violet: { bar: 'bg-violet', icon: 'bg-violet-soft text-violet' },
  warning: { bar: 'bg-warning', icon: 'bg-warning-soft text-warning' },
  success: { bar: 'bg-success', icon: 'bg-success-soft text-success' },
  danger: { bar: 'bg-danger', icon: 'bg-danger-soft text-danger' },
  gold: { bar: 'bg-gold', icon: 'bg-gold-soft text-gold' },
  refunded: { bar: 'bg-refunded', icon: 'bg-refunded-soft text-refunded' },
};

/** Dashed container that groups several cards under one title. */
export function GroupSection({ title, end, children }) {
  return (
    <section className="space-y-3 rounded-2xl border border-dashed border-border bg-surface-muted p-3.5">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <h3 className="truncate text-sm font-black text-primary">{title}</h3>
        {end}
      </div>
      {children}
    </section>
  );
}

export function EditButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="تعديل"
      className="flex size-8 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:text-primary"
    >
      <Pencil className="size-3.5" />
    </button>
  );
}

/** Card with a colored top bar, an icon chip, a title and an optional edit button. */
export function AccentCard({ tone = 'brand', icon: Icon, title, badge, missingCount, onEdit, children }) {
  const toneClasses = TONE_CLASSES[tone];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
      <div className={cn('h-1 w-full', toneClasses.bar)} />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            {Icon && (
              <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-xl', toneClasses.icon)}>
                <Icon className="size-4" />
              </span>
            )}
            <div className="min-w-0">
              <h4 className="text-sm font-black">{title}</h4>
              {badge}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {missingCount > 0 && (
              <span className="h-6 rounded-full bg-danger-soft px-2 text-xs font-black leading-6 text-danger">{missingCount} ناقص</span>
            )}
            {onEdit && <EditButton onClick={onEdit} />}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Small colored pill used under a card title. */
export function CardBadge({ tone = 'info', children }) {
  const toneClasses = { info: 'bg-info-soft text-info', success: 'bg-success-soft text-success', violet: 'bg-violet-soft text-violet' };
  return (
    <span className={cn('mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold', toneClasses[tone])}>{children}</span>
  );
}

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
