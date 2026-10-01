import { useParams } from 'react-router-dom';
import { clientDiscountPath } from '@/features/clients';
import { ClientFilePage } from '@/features/users/pages/client-file-page';

export function ClientDiscountPage() {
  const { userId } = useParams();
  return <ClientFilePage to={clientDiscountPath(userId)} />;
}
