import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { applyFieldChange } from '../lib/contract-form/field-changes';
import { buildEditorSavePayload } from '../lib/contract-form/save-payload';
import { buildContractFormSeed } from '../lib/contract-form/seed-values';
import { buildContractFormSchema, describeValidationFailure, mapServerErrorsToFields } from '../lib/contract-form/validation';
import { useSingleOrderContext } from '../components/details/single-order-context';
import { useSectionEditor } from '../components/details/section-editor-context';
import { useTenantRoles } from './use-reference-data';

/**
 * State and actions of a contract editor form (react-hook-form + zod).
 * It seeds itself from the order, re-seeds when the order changes or the dialog opens again,
 * validates on save and sends only the fields that changed (see ContractStepForm for the options).
 */
export function useContractStepForm({ step, fields, initialValues, seedFromInitialValuesOnly, payloadExtras, onSave, isSaving: isSavingProp, onSaved }) {
  const { orderData, updateContract, isSaving: contextSaving } = useSingleOrderContext();
  const resetKey = useSectionEditor()?.resetKey ?? 0;

  const { items: tenantRoles } = useTenantRoles(fields.some((field) => field.type === 'tenant-roles'));
  const schema = useMemo(() => buildContractFormSchema(fields, tenantRoles), [fields, tenantRoles]);
  const seed = useMemo(
    () => buildContractFormSeed({ orderData, step, fields, initialValues, seedFromInitialValuesOnly }),
    [orderData, step, fields, initialValues, seedFromInitialValuesOnly],
  );

  const form = useForm({ resolver: zodResolver(schema), defaultValues: seed });
  const { control, getValues, setValue, setError, reset, handleSubmit, formState } = form;
  const values = useWatch({ control });

  // What the form had when it opened or was last saved; changes are computed against it.
  const [initial, setInitial] = useState(seed);
  const [seededWith, setSeededWith] = useState({ seed, resetKey });
  if (seededWith.seed !== seed || seededWith.resetKey !== resetKey) {
    setSeededWith({ seed, resetKey });
    setInitial(seed);
  }

  // Re-seed when the order changes (after a save) or the dialog opens again.
  useEffect(() => {
    reset(seed);
  }, [seed, resetKey, reset]);

  const applyValues = (next) => {
    const current = getValues();
    Object.entries(next).forEach(([key, value]) => {
      if (current[key] !== value) setValue(key, value, { shouldDirty: true });
    });
  };
  const changeField = (field, value) => applyValues(applyFieldChange(getValues(), field, value));

  const submit = async (formValues) => {
    const { payload, hasChanges } = buildEditorSavePayload({
      fields,
      step,
      form: formValues,
      initial,
      payloadExtras,
      customSave: typeof onSave === 'function',
    });
    if (!hasChanges) {
      toast.info('لا توجد تغييرات للحفظ');
      return;
    }

    try {
      if (typeof onSave === 'function') await onSave(payload);
      else await updateContract(payload);
      setInitial({ ...formValues });
      onSaved?.();
    } catch (error) {
      if (!error?.fieldErrors) return;
      const fieldErrors = mapServerErrorsToFields(error.fieldErrors, fields, formValues);
      Object.entries(fieldErrors).forEach(([key, message]) => setError(key, { type: 'server', message }));
    }
  };

  const reportInvalid = (errors) => {
    const messages = Object.fromEntries(Object.entries(errors).map(([key, error]) => [key, error.message]));
    toast.error(describeValidationFailure(messages));
  };

  return {
    orderData,
    resetKey,
    values,
    errors: formState.errors,
    isSaving: isSavingProp ?? contextSaving,
    changeField,
    applyValues,
    save: () => handleSubmit(submit, reportInvalid)(),
  };
}
