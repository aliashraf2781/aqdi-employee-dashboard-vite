import { Edit, FileText } from 'lucide-react';
import { useState } from 'react';
import { ContractStepForm } from '../contract-edit/contract-step-form';

/**
 * A titled block that shows `children` (the read-only view) and swaps to a form for the given
 * contract step and fields when the user presses "تعديل".
 */
export function InlineStepEditor({ title, step, fields, children }) {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 px-2">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-success" />
          <h3 className="text-sm font-bold">{title}</h3>
        </div>
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs font-bold text-success hover:underline">
            <span>تعديل</span>
            <Edit className="size-3.5" />
          </button>
        )}
      </div>

      {editing ? (
        <div className="rounded-card border border-border bg-muted p-6">
          <ContractStepForm step={step} fields={fields} onSaved={() => setEditing(false)} onCancel={() => setEditing(false)} />
        </div>
      ) : (
        children
      )}
    </div>
  );
}
