import { AlertTriangle, Clock, Hand, Loader2, Plus } from 'lucide-react';
import { getWaitingMinutes } from '@/features/orders';
import { cn } from '@/shared/lib/cn';
import { formatWaiting, getWaitingSeverity } from '../lib/waiting-time';

const CONTRACT_TYPE_CLASS = {
  housing: 'bg-violet-soft text-violet',
  commercial: 'bg-info-soft text-info',
};

const STATUS_KIND_CLASS = {
  draft: 'bg-gold-soft text-gold',
  new: 'bg-success-soft text-success',
};

const WAITING_TEXT_CLASS = {
  critical: 'text-danger',
  warning: 'text-warning',
  ok: 'text-muted-foreground',
};

/** One order waiting to be received: type, number, how long it waits and the "receive" button. */
export function NewRequestCard({ order, onReceive, receiving = false, dense = false, className }) {
  const severity = getWaitingSeverity(getWaitingMinutes(order));
  const WaitingIcon = severity === 'ok' ? Clock : AlertTriangle;

  return (
    <div
      className={cn(
        'relative flex min-w-48 shrink-0 flex-col overflow-hidden rounded-xl border border-t-4 border-border border-t-primary bg-surface',
        dense ? 'gap-2.5 p-3' : 'gap-3 p-3.5',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-1.5">
        <span
          className={cn(
            'whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-bold',
            CONTRACT_TYPE_CLASS[order?.contract_type_key] ?? CONTRACT_TYPE_CLASS.commercial,
          )}
        >
          {order?.contract_type}
        </span>

        <span className="text-sm font-black tabular-nums text-primary">#{order?.uuid}</span>

        <span
          className={cn(
            'inline-flex items-center gap-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-bold',
            STATUS_KIND_CLASS[order?.status_kind] ?? STATUS_KIND_CLASS.new,
          )}
        >
          <Plus className="size-2.5" />
          {order?.status_label}
        </span>
      </div>

      <div className={cn('flex items-center justify-center gap-1.5 text-xs', WAITING_TEXT_CLASS[severity])}>
        <WaitingIcon className="size-3.5 shrink-0" />
        <span>{formatWaiting(getWaitingMinutes(order))}</span>
      </div>

      {onReceive && (
        <button
          type="button"
          onClick={() => onReceive(order)}
          disabled={receiving}
          className="mt-auto flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-70"
        >
          {receiving ? <Loader2 className="size-3.5 animate-spin" /> : <Hand className="size-3.5" />}
          استلام
        </button>
      )}
    </div>
  );
}
