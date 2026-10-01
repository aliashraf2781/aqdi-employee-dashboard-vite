import { BackLink } from '@/shared/components/back-link';
import { Card } from '@/shared/components/card';

/** Shown instead of a client screen when the client could not be loaded. */
export function ClientLoadError({ backTo, backLabel, message }) {
  return (
    <>
      <BackLink to={backTo}>{backLabel}</BackLink>
      <Card className="p-10 text-center font-medium text-destructive">{message}</Card>
    </>
  );
}
