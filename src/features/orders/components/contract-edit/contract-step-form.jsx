import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { useTenantRoles } from '../../hooks/use-reference-data';
import { applyFieldChange } from '../../lib/contract-form/field-changes';
import { isFieldVisible } from '../../lib/contract-form/field-visibility';
import { buildEditorSavePayload } from '../../lib/contract-form/save-payload';
import { buildContractFormSchema, describeValidationFailure, mapServerErrorsToFields } from '../../lib/contract-form/validation';
import { buildContractFormSeed } from '../../lib/contract-form/seed-values';
import { useSingleOrderContext } from '../details/single-order-context';
import { useSectionEditor } from '../details/section-editor-context';
import { ContractFormField } from './contract-form-field';

const GRID_CLASS = 'grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-3';

function FieldGrid({ fields, renderField, values }) {
  return <div className={GRID_CLASS}>{fields.filter((field) => isFieldVisible(field, values)).map(renderField)}</div>;
}

/**
 * Form that edits some fields of one contract step (react-hook-form + zod).
 * Give it `fields` or titled `fieldGroups`; it seeds itself from the order, validates, sends only
 * the changed fields and keeps itself open after saving.
 *
 *  - `initialValues` / `seedFromInitialValuesOnly`: seed from other values (e.g. one unit);
 *  - `payloadExtras`: keys always sent with the save (e.g. the unit id);
 *  - `onSave(payload)`: custom save instead of the contract update (units);
 *  - `isSaving`: overrides the saving state; `hideFooter`: an outside control calls `ref.save()`;
 *  - `onFormChange(values)`: called on every change (to keep an outside preview in sync);
 *  - `onSaved()` / `onCancel()`: called after a successful save and when the user cancels.
 * Ref: `{ save(), setField(key, value) }`.
 */
export const ContractStepForm = forwardRef(function ContractStepForm(
  {
    step,
    fields: fieldsProp,
    fieldGroups = null,
    initialValues = null,
    seedFromInitialValuesOnly = false,
    payloadExtras = null,
    onSave = null,
    isSaving: isSavingProp = null,
    hideFooter = false,
    onFormChange = null,
    onSaved = null,
    onCancel = null,
  },
  ref,
) {
  const fields = useMemo(() => (fieldGroups?.length ? fieldGroups.flatMap((group) => group.fields) : (fieldsProp ?? [])), [fieldGroups, fieldsProp]);
  const { orderData, updateContract, isSaving: contextSaving } = useSingleOrderContext();
  const isSaving = isSavingProp ?? contextSaving;
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

  useEffect(() => {
    onFormChange?.(values);
  }, [values, onFormChange]);

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

  const save = () =>
    handleSubmit(submit, (errors) => toast.error(describeValidationFailure(Object.fromEntries(Object.entries(errors).map(([key, error]) => [key, error.message])))))();

  useImperativeHandle(ref, () => ({
    save,
    setField: (key, value) => changeField(fields.find((field) => field.key === key) ?? { key }, value),
  }));

  const renderField = (field) => (
    <ContractFormField
      key={`${field.key}-${field.entity ?? ''}-${resetKey}`}
      field={field}
      values={values}
      errors={formState.errors}
      orderData={orderData}
      resetKey={resetKey}
      onChange={(value) => changeField(field, value)}
      onPatch={applyValues}
    />
  );

  return (
    <div className="space-y-6">
      {fieldGroups?.length ? (
        fieldGroups.map((group, index) => {
          const hasVisibleField = group.fields.some((field) => isFieldVisible(field, values));
          if (!hasVisibleField) return null;
          return (
            <div key={group.title ?? index} className="space-y-4">
              {group.title && <h4 className="border-b border-border pb-2 text-sm font-bold text-muted-foreground">{group.title}</h4>}
              <FieldGrid fields={group.fields} renderField={renderField} values={values} />
            </div>
          );
        })
      ) : (
        <FieldGrid fields={fields} renderField={renderField} values={values} />
      )}

      {!hideFooter && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" className="flex-1 bg-gold hover:bg-gold/90" size="lg" onClick={save} disabled={isSaving}>
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            حفظ التعديلات
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" size="lg" onClick={onCancel} disabled={isSaving}>
              إلغاء
            </Button>
          )}
        </div>
      )}
    </div>
  );
});
