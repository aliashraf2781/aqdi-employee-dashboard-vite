import { GroupSection } from './detail-primitives';
import { FinancialCard } from './financial-card';
import { PaymentsCard } from './payments-card';
import { TenantCard } from './tenant-card';

/** Group 2: tenant, finances, terms and payment history. */
export function TenantFinancialGroup({ order, orderData, onEdit }) {
  const edit = (section) => (onEdit ? () => onEdit(section) : undefined);

  return (
    <GroupSection title="المجموعة 2 - المستأجر، المالية، الشروط">
      <TenantCard tenant={order.tenant} onEdit={edit('tenant')} />
      <FinancialCard order={order} orderData={orderData} onEdit={edit('financial')} />
      <PaymentsCard payments={order.financial?.payments} />
    </GroupSection>
  );
}
