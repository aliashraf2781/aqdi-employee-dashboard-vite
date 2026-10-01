import { ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@/shared/components/badge';
import { PageHeader } from '@/shared/components/page-header';
import { QueryState } from '@/shared/components/query-state';
import { RealEstateDetails } from '@/features/real-estates/components/real-estate-details';
import { useRealEstate } from '@/features/real-estates/hooks/use-real-estate';

const REPORTS_PROPERTIES_PATH = '/home/reports?tab=properties';

export function RealEstateDetailsPage() {
  const { id } = useParams();
  const { data: estate, isLoading, error, refetch } = useRealEstate(id);
  const title = estate?.name_real_estate || `عقار #${id}`;

  return (
    <div className="flex flex-col gap-6">
      <Link to={REPORTS_PROPERTIES_PATH} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ChevronRight className="size-4" />
        التقارير
      </Link>

      <QueryState
        isLoading={isLoading}
        error={error}
        isEmpty={!estate}
        onRetry={refetch}
        errorFallback="تعذر تحميل بيانات العقار"
        emptyMessage="تعذر تحميل بيانات العقار"
      >
        <PageHeader
          title={title}
          description={`رقم العقار: ${estate?.id}`}
          actions={<Badge tone="neutral">{estate?.property_type_name || 'عقار'}</Badge>}
        />
        <RealEstateDetails estate={estate} />
      </QueryState>
    </div>
  );
}
