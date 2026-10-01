import { FINANCIAL_FIELD_GROUPS } from '../../lib/contract-fields';
import { useSectionEditor } from '../details/section-editor-context';
import { ContractStepForm } from './contract-step-form';

/** Editor of the financial section: payment type, duration, start date, other conditions and tenant permissions. */
export function FinancialEditor() {
  const sectionEditor = useSectionEditor();
  return <ContractStepForm step="step6" fieldGroups={FINANCIAL_FIELD_GROUPS} onCancel={sectionEditor?.onClose} />;
}
