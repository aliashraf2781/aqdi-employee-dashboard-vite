import { Navigate, useSearchParams } from 'react-router-dom';
import { legacyContentRedirectPath } from '@/features/marketing/lib/routes';

/** `/home/content` was folded into the marketing content tab; old links keep working. */
export function LegacyContentRedirect() {
  const [searchParams] = useSearchParams();
  return <Navigate to={legacyContentRedirectPath(searchParams.get('tab'))} replace />;
}
