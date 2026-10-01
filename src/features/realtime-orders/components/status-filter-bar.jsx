import { CONTRACT_TYPE_OPTIONS } from '@/features/orders';
import { cn } from '@/shared/lib/cn';

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-extrabold transition-colors',
        active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-surface hover:bg-accent',
      )}
    >
      {children}
    </button>
  );
}

/** Inline chips under the toolbar: contract status (with the total) and contract type. */
export function StatusFilterBar({ statusChips, statusId, onStatusChange, contractType, onContractTypeChange, totalCount }) {
  const isAllStatuses = statusId == null || statusId === '';

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Chip active={isAllStatuses} onClick={() => onStatusChange(null)}>
        الكل
        {totalCount != null && <span className="opacity-70">({totalCount})</span>}
      </Chip>

      {statusChips.map((status) => {
        const isActive = String(statusId) === String(status.id);
        return (
          <Chip key={status.id} active={isActive} onClick={() => onStatusChange(isActive ? null : status.id)}>
            {status.color && <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: status.color }} />}
            {status.name}
          </Chip>
        );
      })}

      <span className="mx-1 h-5 w-px shrink-0 bg-border" aria-hidden />

      <Chip active={!contractType} onClick={() => onContractTypeChange(null)}>
        الكل
      </Chip>
      {CONTRACT_TYPE_OPTIONS.map((option) => (
        <Chip
          key={option.value}
          active={contractType === option.value}
          onClick={() => onContractTypeChange(contractType === option.value ? null : option.value)}
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );
}
