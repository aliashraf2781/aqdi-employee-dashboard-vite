import { Trash2 } from 'lucide-react';
import { useWatch } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { CheckboxField } from '@/shared/components/ui/checkbox-field';
import { CardFeaturesEditor } from '@/features/marketing/components/content/card-features-editor';
import { SectionImageField } from '@/features/marketing/components/content/section-image-field';
import { SectionTextFields } from '@/features/marketing/components/content/section-text-fields';

/** Title shown on the card header: what the user typed, else the default, else "<label> <n>". */
function getCardHeading(cardConfig, typedTitle, index) {
  return typedTitle?.trim() || cardConfig.defaults[index]?.[cardConfig.titleField] || `${cardConfig.itemLabel} ${index + 1}`;
}

/** One editable card of a section: text fields, optional images, default toggle and features. */
export function SectionCardItem({ form, cardConfig, index, canRemove, onRemove }) {
  const typedTitle = useWatch({ control: form.control, name: `cards.${index}.${cardConfig.titleField}` });
  const imageUpload = cardConfig.image;
  const licenseUpload = cardConfig.license;

  return (
    <div className="rounded-card border border-border bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-bold text-foreground">{getCardHeading(cardConfig, typedTitle, index)}</h4>
        {canRemove && (
          <Button type="button" variant="ghost" size="icon" aria-label="حذف البطاقة" className="text-danger" onClick={onRemove}>
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <SectionTextFields form={form} prefix={`cards.${index}`} fields={cardConfig.fields} index={index} />

        {imageUpload && <SectionImageField control={form.control} name={`cards.${index}.image`} {...imageUpload} />}
        {licenseUpload && <SectionImageField control={form.control} name={`cards.${index}.license`} allowPdf {...licenseUpload} />}

        {cardConfig.defaultToggle && (
          <CheckboxField label={cardConfig.defaultToggle.label} {...form.register(`cards.${index}.is_default`)} />
        )}

        {cardConfig.features && <CardFeaturesEditor form={form} cardIndex={index} featuresConfig={cardConfig.features} />}
      </div>
    </div>
  );
}
