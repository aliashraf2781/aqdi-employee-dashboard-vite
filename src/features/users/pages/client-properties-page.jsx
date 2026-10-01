import { useParams } from 'react-router-dom';
import { clientPropertiesPath } from '@/features/clients';
import { ClientFilePage } from '@/features/users/pages/client-file-page';

export function ClientPropertiesPage() {
  const { userId } = useParams();
  return <ClientFilePage to={clientPropertiesPath(userId)} />;
}
