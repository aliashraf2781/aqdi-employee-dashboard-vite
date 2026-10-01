import { Button } from '@/shared/components/ui/button';

export function KpiNotice({ children }) {
  return <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{children}</div>;
}

export function KpiError({ children, onRetry, retryLabel }) {
  return (
    <div className="rounded-lg border border-danger bg-danger-soft p-4 text-sm text-danger">
      {children}{' '}
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry} className="underline">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
