import { Loader2, Repeat } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/dropdown-menu';
import { IconButton } from '@/shared/components/icon-button';

/** Row menu listing every status; picking one starts the status-change flow of the page. */
export function ChangeStatusMenu({ order, statuses, isPending, onChangeStatus }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <IconButton label="تغيير الحالة" className="size-8 rounded-lg" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Repeat className="size-4" />}
        </IconButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-h-72 w-56 overflow-y-auto">
        {statuses.map((status) => (
          <DropdownMenuItem key={status.id} onSelect={() => onChangeStatus(order, status)}>
            {status.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
