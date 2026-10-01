import { RotateCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { EmptyState } from '@/shared/components/empty-state';
import { PageLoader } from '@/shared/components/page-loader';
import { getErrorMessage } from '@/shared/lib/api-client';

/**
 * Renders the three non-happy states of a request (loading, failed, empty)
 * and only shows `children` when there is something to display.
 *
 *   <QueryState isLoading={q.isLoading} error={q.error} onRetry={q.refetch}>
 *     <MyTable />
 *   </QueryState>
 */
export function QueryState({
  isLoading,
  error,
  isEmpty = false,
  onRetry,
  errorFallback = 'تعذّر تحميل البيانات',
  emptyMessage,
  children,
}) {
  if (isLoading) return <PageLoader />;

  if (error) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 py-2" role="alert">
        <p className="text-sm text-danger">{getErrorMessage(error, errorFallback)}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={() => onRetry()}>
            <RotateCw className="size-3.5" />
            إعادة المحاولة
          </Button>
        )}
      </div>
    );
  }

  if (isEmpty) return <EmptyState message={emptyMessage} />;
  return children;
}
