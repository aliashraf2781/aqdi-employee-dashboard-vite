import { LeaseRenewalFeatures } from '../lease-renewal/lease-renewal-features';
import { DeedAddressGroup } from './deed-address-group';
import { ExtrasGroup } from './extras-group';
import { StatusTimeline } from './status-timeline';
import { TenantFinancialGroup } from './tenant-financial-group';
import { UnitsGroup } from './units-group';

/**
 * All data groups of an order. Without `onEdit` (the expanded view) the cards are read-only.
 * `order` is the mapped view, `orderData` the API order.
 */
export function OrderGroupsLayout({ order, orderData, onEdit, isLeaseRenewal = false }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <DeedAddressGroup order={order} onEdit={onEdit} />
        <TenantFinancialGroup order={order} orderData={orderData} onEdit={onEdit} />
        <UnitsGroup order={order} onEdit={onEdit} />
      </div>

      <ExtrasGroup order={order} />
      {isLeaseRenewal && <LeaseRenewalFeatures orderData={orderData} />}
      <StatusTimeline timeline={order?.status_timeline} />
    </div>
  );
}
