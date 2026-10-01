import { Settings2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { IconButton } from '@/shared/components/icon-button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/popover';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { TABLE_DENSITIES } from './density';

/** Gear popover: table density plus which optional columns are shown. */
export function TableSettingsPopover({ columns, density, onDensityChange, isColumnVisible, onToggleColumn }) {
  const hideableColumns = columns.filter((column) => column.hideable !== false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton label="إعدادات الجدول">
          <Settings2 className="size-4" />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent className="space-y-4">
        <section className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground">كثافة الجدول</p>
          <div className="flex overflow-hidden rounded-lg border border-border">
            {TABLE_DENSITIES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onDensityChange(option.id)}
                className={cn(
                  'flex-1 py-2 text-xs font-bold transition-colors',
                  density === option.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground">الأعمدة الظاهرة</p>
          <ul className="space-y-2">
            {hideableColumns.map((column) => (
              <li key={column.id} className="flex items-center gap-2.5">
                <Checkbox
                  id={`column-${column.id}`}
                  checked={isColumnVisible(column)}
                  onCheckedChange={() => onToggleColumn(column.id)}
                />
                <label htmlFor={`column-${column.id}`} className="flex-1 cursor-pointer text-sm font-medium">
                  {column.label}
                </label>
              </li>
            ))}
          </ul>
        </section>
      </PopoverContent>
    </Popover>
  );
}
