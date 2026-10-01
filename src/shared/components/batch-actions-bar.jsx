import { Printer, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

/** Bar shown above a table while rows are selected. Offers "print selected" and "clear". */
export function BatchActionsBar({ count, onPrint, onClear, isPrinting = false, label = 'عقد محدد' }) {
  if (!count) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5">
      <span className="flex items-center gap-2 text-sm font-bold">
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-success-soft px-2 text-xs text-success">
          {count}
        </span>
        {label}
      </span>
      <Button size="sm" onClick={onPrint} disabled={isPrinting}>
        <Printer className="size-4" />
        {isPrinting ? 'جاري التحضير…' : 'طباعة المحدد'}
      </Button>
      <Button size="sm" variant="outline" onClick={onClear}>
        <X className="size-4" />
        إلغاء التحديد
      </Button>
    </div>
  );
}
