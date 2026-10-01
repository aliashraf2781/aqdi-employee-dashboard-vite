import { cn } from '@/shared/lib/cn';

export function Card({ className, ...props }) {
  return <section className={cn('rounded-card border border-border bg-surface p-6 shadow-card', className)} {...props} />;
}
