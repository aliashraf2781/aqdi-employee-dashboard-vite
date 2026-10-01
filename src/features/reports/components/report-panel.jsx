import { RotateCw } from 'lucide-react';
import { PageLoader } from '@/shared/components/page-loader';
import { Button } from '@/shared/components/ui/button';
import { ReportSection } from './report-section';

const UNKNOWN_COLUMN_PATTERN = /Unknown column 'order'|contract_statuses/;
const STATUS_ORDER_ERROR = 'تعذر تحميل بيانات الحالات من الخادم. يرجى تحديث ترتيب حالات العقود في النظام.';

export function reportErrorMessage(error, fallback) {
  const message = error?.response?.data?.message || error?.message || '';
  if (UNKNOWN_COLUMN_PATTERN.test(message)) return STATUS_ORDER_ERROR;
  return message || fallback;
}

/**
 * Wraps every analysis panel: shows the spinner while loading, an error card with
 * retry on failure, and otherwise calls `children(data)`.
 */
export function ReportPanel({ title, query, errorFallback, children }) {
  if (query.isLoading) return <PageLoader />;

  if (query.isError) {
    return (
      <ReportSection
        title={title}
        action={
          <Button variant="ghost" size="sm" onClick={() => query.refetch()}>
            <RotateCw className="size-3.5" />
            إعادة المحاولة
          </Button>
        }
      >
        <p className="text-sm text-danger">{reportErrorMessage(query.error, errorFallback)}</p>
      </ReportSection>
    );
  }

  return <div className="flex flex-col gap-5">{children(query.data)}</div>;
}
