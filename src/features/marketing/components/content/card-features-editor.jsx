import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { SectionTextFields } from '@/features/marketing/components/content/section-text-fields';
import { newLocalId } from '@/features/marketing/lib/content-pages';

/** Editable bullet list inside a card (the pricing package features). */
export function CardFeaturesEditor({ form, cardIndex, featuresConfig }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: `cards.${cardIndex}.features` });

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-muted p-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-bold text-foreground">{featuresConfig.heading}</h5>
        <Button type="button" variant="outline" size="sm" onClick={() => append({ id: newLocalId(), text: '' })}>
          <Plus className="size-4" />
          {featuresConfig.addLabel}
        </Button>
      </div>

      {fields.map((item, featureIndex) => (
        <div key={item.id} className="flex items-start gap-2">
          <div className="flex-1">
            <SectionTextFields
              form={form}
              prefix={`cards.${cardIndex}.features.${featureIndex}`}
              fields={[{ name: 'text', placeholder: `${featuresConfig.placeholder} ${featureIndex + 1}` }]}
            />
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="حذف" className="text-danger" onClick={() => remove(featureIndex)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
