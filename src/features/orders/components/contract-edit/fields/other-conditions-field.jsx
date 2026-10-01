import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { SelectField } from '@/shared/components/ui/select-field';
import { normalizeOtherConditionsList } from '../../../lib/contract-update';

const MAX_OTHER_CONDITIONS = 50;
const YES_NO_OPTIONS = [
  { value: '1', label: 'نعم' },
  { value: '0', label: 'لا' },
];

/** "Are there other conditions?" plus the editable list of conditions. */
export function OtherConditionsField({ values, onPatch, errors }) {
  const items = normalizeOtherConditionsList(values?.other_conditions_list);
  const flagOn = [true, 1, '1'].includes(values?.conditions);
  const enabled = flagOn || items.some((item) => String(item).trim() !== '');
  const displayItems = enabled && items.length === 0 ? [''] : items;

  const setEnabled = (next) =>
    onPatch({ conditions: next ? 1 : 0, other_conditions_list: next ? (items.length > 0 ? items : ['']) : [] });
  const setItems = (next) => onPatch({ conditions: 1, other_conditions_list: next.slice(0, MAX_OTHER_CONDITIONS) });

  const updateItem = (index, value) => setItems(displayItems.map((item, position) => (position === index ? value : item)));
  const addItem = () => displayItems.length < MAX_OTHER_CONDITIONS && setItems([...displayItems, '']);
  const removeItem = (index) => setItems(displayItems.length <= 1 ? [''] : displayItems.filter((_, position) => position !== index));

  return (
    <div className="space-y-4">
      <SelectField label="هل توجد شروط أخرى؟" value={enabled ? '1' : '0'} options={YES_NO_OPTIONS} onChange={(event) => setEnabled(event.target.value === '1')} />

      {enabled && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold">قائمة الشروط</p>
            <Button type="button" size="sm" variant="outline" onClick={addItem} disabled={displayItems.length >= MAX_OTHER_CONDITIONS}>
              <Plus className="size-3.5" />
              إضافة شرط
            </Button>
          </div>

          {displayItems.map((item, index) => (
            <div key={`condition-${index}`} className="space-y-1.5">
              <div className="flex items-start gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(event) => updateItem(index, event.target.value)}
                  placeholder={`الشرط ${index + 1}`}
                  className="h-11 flex-1 rounded-md border border-input bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button type="button" variant="outline" size="icon" aria-label="حذف" onClick={() => removeItem(index)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {errors[`other_conditions_list:${index}`]?.message && (
                <p className="text-xs text-destructive">{errors[`other_conditions_list:${index}`].message}</p>
              )}
            </div>
          ))}

          {errors.other_conditions_list?.message && <p className="text-xs text-destructive">{errors.other_conditions_list.message}</p>}
          <p className="text-xs text-muted-foreground">الحد الأدنى شرط واحد · الحد الأقصى {MAX_OTHER_CONDITIONS}</p>
        </div>
      )}
    </div>
  );
}
