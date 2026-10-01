import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/shared/lib/cn';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export function PopoverContent({ className, align = 'end', sideOffset = 8, ...props }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        dir="rtl"
        className={cn(
          'z-50 w-72 rounded-card border border-border bg-surface p-4 text-foreground shadow-card focus:outline-none',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
