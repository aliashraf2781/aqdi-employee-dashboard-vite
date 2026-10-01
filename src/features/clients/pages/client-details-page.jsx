import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { BackLink } from '@/shared/components/back-link';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { PageHeader } from '@/shared/components/page-header';
import { PageLoader } from '@/shared/components/page-loader';
import { ClientHeaderActions } from '@/features/clients/components/client-header-actions';
import { ClientLoadError } from '@/features/clients/components/client-load-error';
import { ClientOrdersSection } from '@/features/clients/components/client-orders-section';
import { ClientProfileCard } from '@/features/clients/components/client-profile-card';
import { ClientPropertiesLink } from '@/features/clients/components/client-properties-link';
import { ClientStatsGrid } from '@/features/clients/components/client-stats-grid';
import { useBlockClient } from '@/features/clients/hooks/use-block-client';
import { useClientDetail } from '@/features/clients/hooks/use-client-detail';
import { useDeleteClient } from '@/features/clients/hooks/use-delete-client';
import { formatJoinedLabel } from '@/features/clients/lib/client-details-format';
import {
  CLIENTS_PATH,
  clientDiscountPath,
  clientPath,
  clientPropertiesPath,
  resolveBackPath,
  withFrom,
} from '@/features/clients/lib/client-paths';
import { withStatusKeys } from '@/features/clients/lib/order-status';

export function ClientDetailsPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const backTo = resolveBackPath(searchParams.get('from'), CLIENTS_PATH);
  // Screens opened from here come back to this page, which in turn remembers where it was opened from.
  const thisPage = withFrom(clientPath(clientId), backTo);

  const { client, contracts, isLoading, isError } = useClientDetail(clientId);
  const blockClient = useBlockClient();
  const deleteClient = useDeleteClient();

  if (isLoading) return <PageLoader />;
  if (isError || !client) {
    return <ClientLoadError backTo={backTo} backLabel="رجوع للعملاء" message="تعذر تحميل ملف العميل من الخادم" />;
  }

  const confirmDelete = () =>
    deleteClient.mutate(clientId, {
      onSuccess: () => navigate(backTo),
      onSettled: () => setIsDeleteOpen(false),
    });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <BackLink to={backTo}>رجوع للعملاء</BackLink>
        <PageHeader
          title={`ملف العميل – ${client.name}`}
          description={`${client.clientCode} · انضم ${formatJoinedLabel(client.joinedAt)}`}
          actions={
            <ClientHeaderActions
              client={client}
              isBlocking={blockClient.isPending}
              onBlock={() => blockClient.mutate(clientId)}
              onDelete={() => setIsDeleteOpen(true)}
              onDiscount={() => navigate(withFrom(clientDiscountPath(clientId), thisPage))}
            />
          }
        />
      </div>

      <ClientProfileCard client={client} />
      <ClientStatsGrid client={client} />
      <ClientOrdersSection orders={withStatusKeys(contracts)} returnTo={thisPage} />
      <ClientPropertiesLink client={client} to={withFrom(clientPropertiesPath(clientId), thisPage)} />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="حذف العميل"
        description="هل أنت متأكد من حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف"
        destructive
        isLoading={deleteClient.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
