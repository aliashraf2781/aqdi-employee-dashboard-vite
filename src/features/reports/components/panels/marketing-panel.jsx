import { EmptyNote } from '../empty-note';
import { ReportSection } from '../report-section';

/** The server has no marketing-source data yet, so we say so instead of inventing numbers. */
export function MarketingPanel() {
  return (
    <ReportSection title="المصادر والتسويق">
      <EmptyNote>
        بيانات مصادر الطلبات والإنفاق الإعلاني غير متاحة حالياً من الخادم، لذلك لم يتم عرض أرقام تقديرية.
      </EmptyNote>
    </ReportSection>
  );
}
