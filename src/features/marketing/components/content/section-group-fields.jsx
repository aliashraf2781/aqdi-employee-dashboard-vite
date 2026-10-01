import { SectionImageField } from '@/features/marketing/components/content/section-image-field';
import { SectionTextFields } from '@/features/marketing/components/content/section-text-fields';

/** A named block of fields (e.g. the "mission" and "vision" parts of one section). */
export function SectionGroupFields({ form, group }) {
  return (
    <div className="rounded-card border border-border bg-surface p-5 shadow-card">
      <h4 className="mb-4 text-sm font-bold text-foreground">{group.title}</h4>
      <div className="flex flex-col gap-4">
        <SectionTextFields form={form} prefix={group.name} fields={group.fields} />
        {group.image && <SectionImageField control={form.control} name={`${group.name}.image`} {...group.image} />}
      </div>
    </div>
  );
}
