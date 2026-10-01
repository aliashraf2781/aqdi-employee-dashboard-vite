import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@/shared/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        outline: 'border border-border bg-surface hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: { sm: 'h-8 px-3', md: 'h-10 px-4', lg: 'h-12 px-6 text-base', icon: 'size-10' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export const Button = forwardRef(function Button(
  { className, variant, size, asChild = false, ...props },
  ref,
) {
  const Component = asChild ? Slot : 'button';
  return <Component ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
