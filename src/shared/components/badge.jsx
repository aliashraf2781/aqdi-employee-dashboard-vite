import { cva } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    tone: {
      success: 'bg-success-soft text-success',
      warning: 'bg-warning-soft text-warning',
      danger: 'bg-danger-soft text-danger',
      neutral: 'bg-neutral-soft text-neutral',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

/** Small status pill. `tone` maps to the success/warning/danger/neutral tokens. */
export function Badge({ tone, className, ...props }) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
