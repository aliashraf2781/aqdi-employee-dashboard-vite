import { useMemo } from 'react';
import { FormDialog } from '@/shared/components/form-dialog';
import { CrudField } from '@/features/settings/crud/crud-field';
import { CRUD_EDIT_ITEM_TITLE, CRUD_NEW_ITEM_TITLE } from '@/features/settings/crud/crud-config';
import { cn } from '@/shared/lib/cn';

/** Add / edit dialog generated from a CRUD config. `row` is null when adding. */
export function CrudFormDialog({ config, row, onClose, onSubmit }) {
  // Must stay referentially stable: FormDialog resets the form whenever it changes.
  const defaultValues = useMemo(() => (row ? config.toFormValues(row) : config.emptyValues), [config, row]);
  const isTwoColumns = config.formColumns === 2;

  return (
    <FormDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={row ? CRUD_EDIT_ITEM_TITLE : CRUD_NEW_ITEM_TITLE}
      schema={config.schema}
      defaultValues={defaultValues}
      size={config.formSize}
      onSubmit={(values) => onSubmit(values, row)}
    >
      {(form) => (
        <div className={cn('grid gap-4', isTwoColumns && 'sm:grid-cols-2')}>
          {config.fields.map((field) => (
            <div key={field.name} className={cn(field.fullWidth && 'sm:col-span-2')}>
              <CrudField field={field} form={form} row={row} />
            </div>
          ))}
        </div>
      )}
    </FormDialog>
  );
}
