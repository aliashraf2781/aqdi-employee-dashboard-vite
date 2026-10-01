import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/modal';

/** Read-only popup listing label/value pairs for one row. */
export function CrudDetailsDialog({ details, row, onClose }) {
  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={details.title}
      description={details.description}
      footer={<Button onClick={onClose}>إغلاق</Button>}
    >
      <dl className="flex flex-col gap-3">
        {details.fields.map((field) => (
          <div key={field.label} className="rounded-lg border border-border bg-surface-muted px-4 py-3">
            <dt className="text-xs font-medium text-muted-foreground">{field.label}</dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-foreground">{field.render(row)}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  );
}
