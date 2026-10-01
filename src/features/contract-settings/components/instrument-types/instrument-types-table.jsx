import { Pencil } from 'lucide-react';
import { DataTable } from '@/shared/components/data-table';
import { Switch } from '@/shared/components/ui/switch';

/**
 * Fixed list of deed types with two visibility switches and an editable label.
 * `canEdit` turns the switches and the label button off for read-only users.
 */
export function InstrumentTypesTable({ items, isLoading, canEdit, isSaving, onToggle, onEditLabel }) {
  const columns = [
    { key: 'name', header: 'اسم الصك', className: 'font-bold', cell: (item) => item.type_name },
    {
      key: 'label',
      header: 'الاسم الظاهر',
      cell: (item) => (
        <button
          type="button"
          disabled={!canEdit}
          onClick={() => onEditLabel(item)}
          className="inline-flex items-center gap-1.5 font-bold hover:text-primary"
        >
          <span className="max-w-56 truncate">{item.label || '—'}</span>
          {canEdit && <Pencil className="size-3.5 shrink-0 text-muted-foreground" />}
        </button>
      ),
    },
    {
      key: 'realestate',
      header: 'إظهار في العقار',
      cell: (item) => (
        <Switch
          checked={item.realestate}
          disabled={!canEdit || isSaving}
          onCheckedChange={(value) => onToggle(item, 'realestate', value)}
          aria-label={`إظهار ${item.type_name} في العقار`}
        />
      ),
    },
    {
      key: 'contract',
      header: 'إظهار في العقد',
      cell: (item) => (
        <Switch
          checked={item.contract}
          disabled={!canEdit || isSaving}
          onCheckedChange={(value) => onToggle(item, 'contract', value)}
          aria-label={`إظهار ${item.type_name} في العقد`}
        />
      ),
    },
  ];

  return <DataTable columns={columns} rows={items} isLoading={isLoading} getRowKey={(item) => item.instrument_type} />;
}
