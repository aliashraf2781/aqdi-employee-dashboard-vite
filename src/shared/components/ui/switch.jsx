import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/shared/lib/cn';

/** On/off toggle. Stays left-to-right inside RTL pages so the thumb moves the expected way. */
export function Switch({ className, ...props }) {
  return (
    <SwitchPrimitive.Root
      dir="ltr"
      className={cn(
        'inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-neutral-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-5 translate-x-0.5 rounded-full bg-surface shadow-card transition-transform data-[state=checked]:translate-x-5" />
    </SwitchPrimitive.Root>
  );
}
