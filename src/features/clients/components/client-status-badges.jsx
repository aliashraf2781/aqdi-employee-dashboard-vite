import { Badge } from '@/shared/components/badge';

/** Platform, verification and account-state pills shown next to a client's name. */
export function ClientStatusBadges({ client }) {
  const isSuspended = !client.isActive && !client.blocked;

  return (
    <>
      {client.platformLabel && <Badge tone="success">{client.platformLabel}</Badge>}
      <Badge tone={client.verified ? 'success' : 'neutral'}>{client.verified ? 'موثّق' : 'غير موثّق'}</Badge>
      {isSuspended && <Badge tone="warning">موقوف</Badge>}
      {client.blocked && <Badge tone="danger">محظور</Badge>}
    </>
  );
}
