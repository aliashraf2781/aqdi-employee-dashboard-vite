import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export function Spinner({ className }) {
  return <Loader2 className={cn('size-5 animate-spin text-primary', className)} aria-hidden />;
}

/** Centered spinner for a whole page or panel while data loads. */
export function PageLoader() {
  return (
    <div role="status" aria-label="جاري التحميل" className="flex min-h-64 items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}
