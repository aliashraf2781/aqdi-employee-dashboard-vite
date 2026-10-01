import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/dropdown-menu';
import { cn } from '@/shared/lib/cn';
import { openDialogAfterMenuClose } from '@/shared/lib/open-dialog-after-menu-close';
import { getSelectableStatuses, isDocumentedStatus } from '../../../lib/order-header-rules';
import { isSendContractDraftStatus } from '../../../lib/order-status-payload';

/** The current status of the order as a menu of the statuses it can move to. */
export function HeaderStatusSelect({ view, orderData, statuses, disabled, onStatusChange, onSendDraft, onEjarDocumentation }) {
  const selectable = getSelectableStatuses(statuses, view, orderData);

  const choose = (status) => {
    // Some statuses have a dialog of their own instead of the plain confirmation.
    if (isDocumentedStatus(status)) openDialogAfterMenuClose(onEjarDocumentation);
    else if (isSendContractDraftStatus(status)) openDialogAfterMenuClose(onSendDraft);
    else onStatusChange(status);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-muted px-3 text-xs font-bold disabled:opacity-60"
        >
          {view.status_name}
          <ChevronDown className="size-3.5 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-72 min-w-56 overflow-y-auto">
        {selectable.length === 0 ? (
          <p className="px-3 py-2 text-xs text-muted-foreground">لا توجد حالات</p>
        ) : (
          selectable.map((status) => {
            const label = status.name ?? status.label;
            const isCurrent = String(status.id) === String(view.status_id) || label === view.status_name;
            return (
              <DropdownMenuItem
                key={status.id}
                disabled={disabled || isCurrent}
                onSelect={() => !isCurrent && choose(status)}
                className={cn(isCurrent && 'bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground')}
              >
                {label}
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
