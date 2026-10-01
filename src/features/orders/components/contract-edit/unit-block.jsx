import { Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { UNIT_FIELD_GROUPS } from '../../lib/contract-fields';
import { getUnitFormValues, getUnitFormVersion, getUnitFullPayload, isSelectedUnit } from '../../lib/unit-form-values';
import { useSingleOrderContext } from '../details/single-order-context';
import { ContractStepForm } from './contract-step-form';

/**
 * The form of one unit plus its header and the "detach from contract" action.
 * `formRef` receives the form's `{ save }` handle so a parent can save all units at once.
 */
export function UnitBlock({ unit, order, index, formRef, canDetach }) {
  const { updateUnit, deleteUnit, isSavingUnit, isDeletingUnit } = useSingleOrderContext();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const unitLabel = unit?.unit_number != null && unit.unit_number !== '' ? `الوحدة رقم ${unit.unit_number}` : `وحدة #${unit?.id ?? index + 1}`;

  // The seed stays the same object until a value the form shows changes, so edits are not wiped by refetches.
  const version = getUnitFormVersion(unit);
  const [seedState, setSeedState] = useState({ version, values: getUnitFormValues(unit) });
  if (seedState.version !== version) setSeedState({ version, values: getUnitFormValues(unit) });

  const saveUnit = useCallback(
    async (payload) => {
      if (unit?.id == null) {
        toast.error('معرف الوحدة غير موجود');
        return;
      }
      await updateUnit(unit.id, { ...getUnitFullPayload(unit), ...payload });
    },
    [unit, updateUnit],
  );

  const detach = async () => {
    setConfirmOpen(false);
    try {
      await deleteUnit(unit.id);
    } catch {
      // the mutation already showed the error
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-base font-bold">{unitLabel}</h3>
          {isSelectedUnit(unit, order) && <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">الوحدة المختارة في العقد</span>}
          {unit?.id != null && (
            <span dir="ltr" className="text-xs font-medium text-muted-foreground">
              ID: {unit.id}
            </span>
          )}
        </div>
        {canDetach && unit?.id != null && (
          <Button type="button" size="sm" variant="outline" onClick={() => setConfirmOpen(true)} disabled={isDeletingUnit}>
            <Trash2 className="size-3.5 text-danger" />
            فصل عن العقد
          </Button>
        )}
      </div>

      <ContractStepForm
        ref={formRef}
        step="step5"
        fieldGroups={UNIT_FIELD_GROUPS}
        initialValues={seedState.values}
        seedFromInitialValuesOnly
        onSave={saveUnit}
        isSaving={isSavingUnit}
        hideFooter
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="فصل الوحدة عن العقد"
        description={`فصل الوحدة ${unitLabel} عن هذا العقد؟ لن تُحذف الوحدة من العقار.`}
        confirmLabel="فصل"
        destructive
        isLoading={isDeletingUnit}
        onConfirm={detach}
      />
    </div>
  );
}
