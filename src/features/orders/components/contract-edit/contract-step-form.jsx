import { Loader2, Save } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import { Button } from '@/shared/components/ui/button';
import { useContractStepForm } from '../../hooks/use-contract-step-form';
import { isFieldVisible } from '../../lib/contract-form/field-visibility';
import { ContractFormField } from './contract-form-field';

const GRID_CLASS = 'grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-3';

function FieldGrid({ fields, renderField, values }) {
  return <div className={GRID_CLASS}>{fields.filter((field) => isFieldVisible(field, values)).map(renderField)}</div>;
}

/**
 * Form that edits some fields of one contract step (react-hook-form + zod, see useContractStepForm).
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
    isSaving = null,
    hideFooter = false,
    onFormChange = null,
    onSaved = null,
    onCancel = null,
  },
  ref,
) {
  const fields = useMemo(() => (fieldGroups?.length ? fieldGroups.flatMap((group) => group.fields) : (fieldsProp ?? [])), [fieldGroups, fieldsProp]);
  const editor = useContractStepForm({ step, fields, initialValues, seedFromInitialValuesOnly, payloadExtras, onSave, isSaving, onSaved });
  const { values, errors, orderData, resetKey, changeField, applyValues, save } = editor;

  useEffect(() => {
    onFormChange?.(values);
  }, [values, onFormChange]);

  useImperativeHandle(ref, () => ({
    save,
    setField: (key, value) => changeField(fields.find((field) => field.key === key) ?? { key }, value),
  }));

  const renderField = (field) => (
    <ContractFormField
      key={`${field.key}-${field.entity ?? ''}-${resetKey}`}
      field={field}
      values={values}
      errors={errors}
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
          <Button type="button" className="flex-1 bg-gold hover:bg-gold/90" size="lg" onClick={save} disabled={editor.isSaving}>
            {editor.isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            حفظ التعديلات
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" size="lg" onClick={onCancel} disabled={editor.isSaving}>
              إلغاء
            </Button>
          )}
        </div>
      )}
    </div>
  );
});
