import { Filter } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { IconButton } from '@/shared/components/icon-button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/popover';
import { CONTRACT_TYPE_OPTIONS } from '../../lib/orders-filters';

function Chip({ active, color, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={active && color ? { backgroundColor: color } : undefined}
      className={cn(
        'h-8 rounded-full border px-3 text-xs font-bold transition-colors',
        active ? 'border-transparent bg-primary text-primary-foreground' : 'border-border bg-muted hover:bg-accent',
      )}
    >
      {children}
    </button>
  );
}

/** "More filters": contract type and any contract status without its own pill. */
export function MoreFiltersPopover({ statuses, extraStatusId, onExtraStatusChange, contractType, onContractTypeChange }) {
  const hasActiveFilter = extraStatusId != null || Boolean(contractType);

  const clearAll = () => {
    onExtraStatusChange(null);
    onContractTypeChange(null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton label="فلترة إضافية" active={hasActiveFilter}>
          <Filter className="size-4" />
        </IconButton>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-black">فلاتر إضافية</p>
          {hasActiveFilter && (
            <button type="button" onClick={clearAll} className="text-xs font-bold text-primary">
              مسح
            </button>
          )}
        </div>

        <section className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground">نوع العقد</p>
          <div className="flex flex-wrap gap-1.5">
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
        </section>

        <section className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground">حالات أخرى</p>
          {statuses.length === 0 ? (
            <p className="text-xs text-muted-foreground">لا توجد حالات إضافية</p>
          ) : (
            <div className="flex max-h-56 flex-wrap gap-1.5 overflow-y-auto">
              {statuses.map((status) => {
                const isActive = String(extraStatusId) === String(status.id);
                return (
                  <Chip
                    key={status.id}
                    active={isActive}
                    color={status.color}
                    onClick={() => onExtraStatusChange(isActive ? null : status.id)}
                  >
                    {status.name}
                  </Chip>
                );
              })}
            </div>
          )}
        </section>
      </PopoverContent>
    </Popover>
  );
}
