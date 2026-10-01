import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { buildOrderRedirectPath } from '../lib/order-redirect';

/** The details page lives in the orders feature: this route only forwards there. */
export function RealtimeOrderRedirectPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  return <Navigate to={buildOrderRedirectPath(id, searchParams)} replace />;
}
