import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Pagination } from '@/shared/components/pagination';
import { Button } from '@/shared/components/ui/button';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { PanelHeader } from '@/features/contract-settings/components/panel-header';
import { PopupContractFormDialog } from '@/features/contract-settings/components/popup-contracts/popup-contract-form-dialog';
import { PopupContractsTable } from '@/features/contract-settings/components/popup-contracts/popup-contracts-table';
import { usePopupContracts, useUsedPopupTypes } from '@/features/contract-settings/hooks/use-popup-contracts';
import { availablePopupTypeOptions } from '@/features/contract-settings/lib/popup-contracts';

const FIRST_PAGE = 1;

/** "Guidance content for contracts": one popup per document type. */
export function PopupContractsPanel() {
  const { can } = usePermissions();
  const [page, setPage] = useState(FIRST_PAGE);
  const [dialogItem, setDialogItem] = useState(undefined); // undefined = closed, null = add
  const { data, isLoading } = usePopupContracts(page);
  const usedTypes = useUsedPopupTypes();

  const canCreate = can(PERMISSION_SECTIONS.popup_contracts, 'create');
  const canEdit = can(PERMISSION_SECTIONS.popup_contracts, 'edit');
  const hasFreeTypes = availablePopupTypeOptions({ usedTypes }).length > 0;

  return (
    <div className="flex flex-col gap-6">
      <PanelHeader
        title="محتوى إرشادي للعقود"
        description={`إدارة محتوى البوب أب حسب نوع الوثيقة${data?.total != null ? ` (${data.total} عنصر)` : ''}`}
        actions={
          canCreate && (
            <Button disabled={!hasFreeTypes} onClick={() => setDialogItem(null)}>
              <Plus className="size-4" />
              إضافة محتوى جديد
            </Button>
          )
        }
      />

      <PopupContractsTable items={data?.rows} isLoading={isLoading} onEdit={canEdit ? setDialogItem : undefined} />
      <Pagination page={page} lastPage={data?.lastPage} onPageChange={setPage} />

      {dialogItem !== undefined && (
        <PopupContractFormDialog item={dialogItem} usedTypes={usedTypes} onClose={() => setDialogItem(undefined)} />
      )}
    </div>
  );
}
