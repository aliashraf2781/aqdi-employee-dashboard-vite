const PAGE_SIZE_OPTIONS = [10, 20, 25, 50, 100];

/** "Rows per page" picker used under paged tables. */
export function PageSizeSelect({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      صفوف/صفحة
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-9 rounded-full border border-input bg-surface px-3 text-sm font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  );
}
