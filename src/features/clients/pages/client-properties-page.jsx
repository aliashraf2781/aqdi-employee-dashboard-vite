import { useParams, useSearchParams } from 'react-router-dom';
import { BackLink } from '@/shared/components/back-link';
import { Card } from '@/shared/components/card';
import { EmptyState } from '@/shared/components/empty-state';
import { PageHeader } from '@/shared/components/page-header';
import { PageLoader } from '@/shared/components/page-loader';
import { ClientLoadError } from '@/features/clients/components/client-load-error';
import { PropertyCard } from '@/features/clients/components/property-card';
import { useClientDetail } from '@/features/clients/hooks/use-client-detail';
import { buildClientProperties } from '@/features/clients/lib/client-properties';
import { CLIENTS_PATH, clientPath, resolveBackPath, withFrom } from '@/features/clients/lib/client-paths';

export function ClientPropertiesPage() {
  const { clientId } = useParams();
  const [searchParams] = useSearchParams();
  const { user, client, isLoading, isError } = useClientDetail(clientId);

  const fallbackBack = withFrom(clientPath(clientId), CLIENTS_PATH);
  const backTo = resolveBackPath(searchParams.get('from'), fallbackBack);

  if (isLoading) return <PageLoader />;
  if (isError || !client) {
    return <ClientLoadError backTo={backTo} backLabel="رجوع لملف العميل" message="لم يتم العثور على عقارات هذا العميل" />;
  }

  const { properties, totals } = buildClientProperties(user);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <BackLink to={backTo}>رجوع لملف العميل</BackLink>
        <PageHeader
          title={`عقارات العميل – ${client.name}`}
          description="استعراض بنفس مدخلات الموقع – عرض فقط"
          actions={
            <p className="text-sm font-bold tabular-nums text-muted-foreground">
              {totals.properties} عقار · {totals.units} وحدة
            </p>
          }
        />
      </div>

      {properties.length === 0 ? (
        <Card>
          <EmptyState message="لا توجد عقارات مسجّلة لهذا العميل" />
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {properties.map((property, index) => (
            <PropertyCard key={property.id} property={property} defaultOpen={index === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
