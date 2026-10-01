import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/shared/lib/cn';

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }) {
  return <TabsPrimitive.List className={cn('inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1', className)} {...props} />;
}

export function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors data-[state=active]:bg-surface data-[state=active]:text-primary data-[state=active]:shadow-card',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }) {
  return <TabsPrimitive.Content className={cn('mt-4 focus-visible:outline-none', className)} {...props} />;
}
