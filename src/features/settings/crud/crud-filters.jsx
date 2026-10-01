import { SearchInput } from '@/shared/components/search-input';
import { SelectField } from '@/shared/components/ui/select-field';

/**
 * Filter bar for a CRUD list. Each filter: { name, kind: 'search' | 'select', placeholder, options? }.
 * `values` is an object keyed by filter name.
 */
export function CrudFilters({ filters, values, onChange }) {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      {filters.map((filter) =>
        filter.kind === 'search' ? (
          <SearchInput
            key={filter.name}
            value={values[filter.name] ?? ''}
            placeholder={filter.placeholder}
            onChange={(value) => onChange(filter.name, value)}
          />
        ) : (
          <div key={filter.name} className="w-48">
            <SelectField
              aria-label={filter.placeholder}
              placeholder={filter.placeholder}
              options={filter.options}
              value={values[filter.name] ?? ''}
              onChange={(event) => onChange(filter.name, event.target.value)}
            />
          </div>
        ),
      )}
    </div>
  );
}
