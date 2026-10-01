import { cn } from '@/shared/lib/cn';

/**
 * Pill with the name of an order's contract status.
 * The colors are set by the admin per status and arrive from the API, so they are applied inline;
 * without them a neutral pill is shown.
 */
export function OrderStatusBadge({ name, color, colorText, className }) {
  const hasColor = Boolean(color);

  return (
    <span
      style={hasColor ? { backgroundColor: color, color: colorText || undefined } : undefined}
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold',
        hasColor ? 'text-primary-foreground' : 'bg-neutral-soft text-neutral',
        className,
      )}
    >
      {name || '—'}
    </span>
  );
}

/** Same pill for a table row mapped with mapTableOrderRow (status_name / status_color / status_color_text). */
export function OrderRowStatusBadge({ order, className }) {
  return <OrderStatusBadge name={order?.status_name} color={order?.status_color} colorText={order?.status_color_text} className={className} />;
}
