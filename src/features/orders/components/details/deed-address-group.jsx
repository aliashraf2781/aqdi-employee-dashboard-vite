import { MapPin } from 'lucide-react';
import { DeedCard } from './deed-card';
import { EndowmentNazirCard, LegalAgentCard } from './deed-agents-cards';
import { AccentCard, GroupSection } from './detail-primitives';
import { LinkedRealEstateCard } from './linked-real-estate-card';
import { NationalAddressContent } from './national-address-content';

/** Group 1: owner, deed, agents and the national address. `onEdit(section)` opens the section editor. */
export function DeedAddressGroup({ order, onEdit }) {
  const edit = (section) => (onEdit ? () => onEdit(section) : undefined);

  return (
    <GroupSection title="المجموعة 1 - الملاك - الصك - العنوان الوطني">
      <DeedCard deed={order.deed} onEdit={edit('deed')} />
      <LinkedRealEstateCard estate={order.real_estate} />
      <LegalAgentCard agent={order.deed?.legal_agent} onEdit={edit('deed')} />
      <EndowmentNazirCard nazir={order.deed?.endowment_nazir} onEdit={edit('deed')} />
      <AccentCard tone="info" icon={MapPin} title="العنوان الوطني" onEdit={edit('address')}>
        <NationalAddressContent address={order.national_address} />
      </AccentCard>
    </GroupSection>
  );
}
