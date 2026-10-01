import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/** "Back" link shown above a page title. In RTL the chevron points toward the previous screen. */
export function BackLink({ to, children = 'رجوع' }) {
  return (
    <Link
      to={to}
      className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      <ChevronLeft className="size-4 shrink-0" aria-hidden />
      {children}
    </Link>
  );
}
