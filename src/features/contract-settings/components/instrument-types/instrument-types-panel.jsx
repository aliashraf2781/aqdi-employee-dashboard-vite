import { useState } from 'react';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { EditLabelDialog } from '@/features/contract-settings/components/instrument-types/edit-label-dialog';
import { InstrumentTypesTable } from '@/features/contract-settings/components/instrument-types/instrument-types-table';
import { PanelHeader } from '@/features/contract-settings/components/panel-header';
import { useInstrumentSettings, useUpdateInstrumentSetting } from '@/features/contract-settings/hooks/use-instrument-settings';

/** Which deed types appear on properties / contracts, and how they are named. */
export function InstrumentTypesPanel() {
  const { can } = usePermissions();
  const [editedItem, setEditedItem] = useState(null);
  const { data: items, isLoading } = useInstrumentSettings();
  const toggle = useUpdateInstrumentSetting({
    successMessage: 'تم تحديث إظهار نوع الصك بنجاح',
    failureMessage: 'تعذر تحديث إظهار نوع الصك',
  });

  return (
    <div className="flex flex-col gap-6">
      <PanelHeader
        title="أنواع الصكوك"
        description={`قائمة أنواع الصكوك ثابتة ولا يمكن حذفها. تحكم في الإظهار في العقار والعقد، وعدّل الاسم الظاهر (label) لكل نوع.${items ? ` (${items.length} نوع)` : ''}`}
      />

      <InstrumentTypesTable
        items={items}
        isLoading={isLoading}
        canEdit={can(PERMISSION_SECTIONS.instrument_settings, 'edit')}
        isSaving={toggle.isPending}
        onToggle={(item, field, value) => toggle.mutate({ item, changes: { [field]: value } })}
        onEditLabel={setEditedItem}
      />

      {editedItem && <EditLabelDialog item={editedItem} onClose={() => setEditedItem(null)} />}
    </div>
  );
}
