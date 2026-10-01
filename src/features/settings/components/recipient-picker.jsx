import { useState } from 'react';
import { SearchInput } from '@/shared/components/search-input';
import { SelectField } from '@/shared/components/ui/select-field';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { useRecipientOptions } from '@/features/settings/hooks/use-recipient-options';

/** Search box + dropdown to choose one user or employee. `kind`: 'user' | 'employee'. */
export function RecipientPicker({ kind, label, value, onChange, error }) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim());
  const { options, isFetching } = useRecipientOptions({ kind, search: debouncedSearch });

  return (
    <div className="flex flex-col gap-2">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder={kind === 'employee' ? 'بحث عن موظف...' : 'بحث عن مستخدم...'}
        className="max-w-none"
      />
      <SelectField
        label={label}
        placeholder={isFetching ? 'جاري التحميل...' : 'اختر...'}
        options={options}
        error={error}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
