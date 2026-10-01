import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { displayValue, EMPTY_VALUE } from '@/features/real-estates/lib/real-estate-labels';

async function copyToClipboard(value) {
  try {
    await navigator.clipboard.writeText(String(value));
    toast.success('تم النسخ بنجاح');
  } catch {
    toast.error('تعذر النسخ');
  }
}

/** One labelled value, optionally with a copy button. */
export function DetailCard({ label, value, copyable = false }) {
  const text = displayValue(value);
  const canCopy = copyable && text !== EMPTY_VALUE;

  return (
    <div className="rounded-lg border border-border border-s-4 border-s-primary bg-surface p-4">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <p className="flex items-center gap-2 text-sm font-bold text-foreground">
        {canCopy && (
          <button
            type="button"
            onClick={() => copyToClipboard(text)}
            aria-label="نسخ"
            className="text-muted-foreground hover:text-primary"
          >
            <Copy className="size-3.5" />
          </button>
        )}
        <span>{text}</span>
      </p>
    </div>
  );
}
