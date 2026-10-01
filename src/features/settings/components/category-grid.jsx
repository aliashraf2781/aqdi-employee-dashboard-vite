import { ChevronLeft, ListTree } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categorySubtitle } from '@/features/settings/lib/system-categories';

/** Cards linking to each settings page. `counts` maps category id -> row count (see useCategoryCounts). */
export function CategoryGrid({ categories, counts }) {
  return (
    <section>
      <h2 className="mb-3 text-base font-bold text-foreground">
        إعدادات النظام <span className="text-sm font-normal text-muted-foreground">({categories.length} فئة)</span>
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.href}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-accent"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <ListTree className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <b className="block truncate text-sm text-foreground">{category.label}</b>
              <small className="block truncate text-xs text-muted-foreground">{categorySubtitle(category, counts[category.id])}</small>
            </span>
            <ChevronLeft className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </section>
  );
}
