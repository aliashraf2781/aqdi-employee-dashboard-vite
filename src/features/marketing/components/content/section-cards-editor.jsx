import { Plus } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { SectionCardItem } from '@/features/marketing/components/content/section-card-item';
import { buildEmptyCard } from '@/features/marketing/lib/section-form';

const GRID_BY_COLUMNS = {
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
};
const DEFAULT_COLUMNS = 3;

/** The repeating "cards" part of a section (add / remove / edit). */
export function SectionCardsEditor({ form, cardConfig }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'cards' });
  const gridClass = GRID_BY_COLUMNS[cardConfig.columns ?? DEFAULT_COLUMNS];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-t border-border pt-6">
        <h3 className="text-base font-bold text-foreground">{cardConfig.heading}</h3>
        <Button type="button" variant="outline" onClick={() => append(buildEmptyCard(cardConfig))}>
          <Plus className="size-4" />
          {cardConfig.addLabel}
        </Button>
      </div>

      <div className={`grid grid-cols-1 gap-4 ${gridClass}`}>
        {fields.map((item, index) => (
          <SectionCardItem
            key={item.id}
            form={form}
            cardConfig={cardConfig}
            index={index}
            canRemove={fields.length > 1}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
    </div>
  );
}
