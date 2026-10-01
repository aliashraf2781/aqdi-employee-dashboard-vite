import { useParams } from 'react-router-dom';
import { OrderDetailsBody } from '../components/details/order-details-body';
import { SingleOrderProvider } from '../components/details/single-order-context';

/** /home/orders/:id: one order with its data groups, actions and editors. */
export function OrderDetailsPage() {
  const { id } = useParams();

  return (
    <SingleOrderProvider contractId={id}>
      <OrderDetailsBody id={id} />
    </SingleOrderProvider>
  );
}
