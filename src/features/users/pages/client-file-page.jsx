import { Navigate, useLocation } from 'react-router-dom';

/**
 * The old app served client files under /home/users/:userId. They now live in the
 * clients feature, so legacy links are redirected there (query string kept).
 */
export function ClientFilePage({ to }) {
  const { search } = useLocation();
  return <Navigate to={`${to}${search}`} replace />;
}
