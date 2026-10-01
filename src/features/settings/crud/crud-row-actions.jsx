import { Button } from '@/shared/components/ui/button';
import { CRUD_DELETE_LABEL, CRUD_EDIT_LABEL, CRUD_VIEW_LABEL } from '@/features/settings/crud/crud-config';

/** The per-row buttons. A callback that is `undefined` hides its button. */
export function CrudRowActions({ row, onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      {onView && (
        <Button variant="outline" size="sm" onClick={() => onView(row)}>
          {CRUD_VIEW_LABEL}
        </Button>
      )}
      {onEdit && (
        <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
          {CRUD_EDIT_LABEL}
        </Button>
      )}
      {onDelete && (
        <Button variant="outline" size="sm" className="text-destructive" onClick={() => onDelete(row)}>
          {CRUD_DELETE_LABEL}
        </Button>
      )}
    </div>
  );
}
