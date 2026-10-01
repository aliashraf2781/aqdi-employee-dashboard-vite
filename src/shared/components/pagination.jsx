import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

/** Previous/next pager. `page` is 1-based. */
export function Pagination({ page, lastPage, onPageChange }) {
  if (!lastPage || lastPage <= 1) return null;

  return (
    <nav className="mt-4 flex items-center justify-center gap-3" aria-label="التنقل بين الصفحات">
      <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="السابق">
        <ChevronRight className="size-4" />
      </Button>
      <span className="text-sm text-muted-foreground">
        {page} / {lastPage}
      </span>
      <Button variant="outline" size="icon" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)} aria-label="التالي">
        <ChevronLeft className="size-4" />
      </Button>
    </nav>
  );
}
