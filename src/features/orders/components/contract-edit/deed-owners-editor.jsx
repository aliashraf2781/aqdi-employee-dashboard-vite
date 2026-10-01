import { useMemo } from 'react';
import { buildDeedFieldGroups } from '../../lib/contract-fields';
import { getInstrumentTypeLabel } from '../../lib/instrument-types';
import { getOrderDeedStep, getOrderOwnerStep, hasEndowmentNazir, pickAgentRelatedField } from '../../lib/order-detail-steps';
import { pick } from '../../lib/pick';
import { useSectionEditor } from '../details/section-editor-context';
import { ContractStepForm } from './contract-step-form';

/** First non-empty value of `keys` looked up in the summary, deed, owner, agent data and the order itself. */
function readDeedValue(order, ...keys) {
  const summary = order?.contract_summary ?? {};
  const deed = getOrderDeedStep(order);
  const owner = getOrderOwnerStep(order);
  return pick(...keys.flatMap((key) => [summary[key], deed[key], owner[key], pickAgentRelatedField(order, key), order?.[key]]));
}

/** Editor of the deed and owner section: owner, agent, endowment trustee, property and deed files. */
export function DeedOwnersEditor({ order }) {
  const sectionEditor = useSectionEditor();
  const instrumentTypeLabel = getInstrumentTypeLabel(readDeedValue(order, 'instrument_type_trans', 'instrument_type', 'instrument_type_key'));
  const showNazir = hasEndowmentNazir(order);
  const fieldGroups = useMemo(() => buildDeedFieldGroups({ instrumentTypeLabel, showNazir }), [instrumentTypeLabel, showNazir]);

  return <ContractStepForm step="step3" fieldGroups={fieldGroups} onCancel={sectionEditor?.onClose} />;
}
