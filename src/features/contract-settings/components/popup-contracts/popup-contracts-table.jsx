import { Badge } from '@/shared/components/badge';
import { DataTable } from '@/shared/components/data-table';
import { Button } from '@/shared/components/ui/button';
import { stripHtml } from '@/shared/lib/html';
import { popupInstrumentTypeLabel } from '@/features/contract-settings/lib/instrument-types';
import { popupStatusLabel } from '@/features/contract-settings/lib/popup-contracts';

const dash = (value) => value || '---';

function StatusBadge({ active }) {
  return <Badge tone={active ? 'success' : 'neutral'}>{popupStatusLabel(active)}</Badge>;
}

/** Popups table; `onEdit` is undefined when the user may not edit. */
export function PopupContractsTable({ items, isLoading, onEdit }) {
  const columns = [
    { key: 'type', header: 'نوع الوثيقة', className: 'font-bold', cell: (item) => popupInstrumentTypeLabel(item.instrument_type) },
    { key: 'contract', header: 'حالة بوب أب العقد', cell: (item) => <StatusBadge active={item.popup_status_contract} /> },
    { key: 'realestate', header: 'حالة بوب أب العقار', cell: (item) => <StatusBadge active={item.popup_status_realestate} /> },
    {
      key: 'content',
      header: 'محتوى البوب أب',
      cell: (item) => <p className="line-clamp-3 max-w-xs text-muted-foreground">{dash(stripHtml(item.content_popup))}</p>,
    },
    { key: 'buttonText', header: 'نص الزر الإضافي', cell: (item) => dash(item.button_text) },
    {
      key: 'buttonLink',
      header: 'رابط الزر الإضافي',
      cell: (item) =>
        item.button_link ? (
          <a href={item.button_link} target="_blank" rel="noreferrer" className="line-clamp-2 break-all text-primary hover:underline">
            {item.button_link}
          </a>
        ) : (
          '---'
        ),
    },
  ];

  if (onEdit) {
    columns.push({
      key: 'actions',
      header: 'الإجراءات',
      cell: (item) => (
        <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
          تعديل
        </Button>
      ),
    });
  }

  return (
    <DataTable
      columns={columns}
      rows={items}
      isLoading={isLoading}
      emptyMessage='لا يوجد محتوى إرشادي حالياً. اضغط على "إضافة محتوى جديد" للبدء.'
    />
  );
}
