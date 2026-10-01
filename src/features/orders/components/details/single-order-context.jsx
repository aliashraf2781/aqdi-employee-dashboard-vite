import { createContext, useContext, useEffect } from 'react';
import { useSingleOrder } from '../../hooks/use-single-order';
import { syncRelatedContractOrigin } from '../../lib/related-contract-origin';

const SingleOrderContext = createContext(null);

/** Loads one order and shares it (and the edit mutations) with every component of the details page. */
export function SingleOrderProvider({ contractId, children }) {
  const value = useSingleOrder(contractId);
  const { orderData } = value;

  useEffect(() => {
    if (orderData) syncRelatedContractOrigin(orderData);
  }, [orderData, contractId]);

  return <SingleOrderContext.Provider value={value}>{children}</SingleOrderContext.Provider>;
}

export function useSingleOrderContext() {
  const context = useContext(SingleOrderContext);
  if (!context) throw new Error('useSingleOrderContext must be used inside SingleOrderProvider');
  return context;
}
