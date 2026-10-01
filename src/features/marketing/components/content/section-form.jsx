import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/card';
import { SectionCardsEditor } from '@/features/marketing/components/content/section-cards-editor';
import { SectionGroupFields } from '@/features/marketing/components/content/section-group-fields';
import { SectionImageField } from '@/features/marketing/components/content/section-image-field';
import { SectionTextFields } from '@/features/marketing/components/content/section-text-fields';
import { useSaveContentPage } from '@/features/marketing/hooks/use-content-page';
import { buildSectionDefaults, buildSectionPayload, buildSectionSchema } from '@/features/marketing/lib/section-form';

/**
 * The one form used by every home/about content section.
 * `config` (see schemas/*-sections.js) says which fields, images, groups and cards the section has;
 * `initialData` is the saved section from the API.
 */
export function SectionForm({ config, pageKey, initialData }) {
  const schema = useMemo(() => buildSectionSchema(config), [config]);
  const form = useForm({ resolver: zodResolver(schema), defaultValues: buildSectionDefaults(config, initialData) });
  const { mutate: saveSection, isPending } = useSaveContentPage(pageKey);

  // Refill the form whenever fresh data arrives from the server (after a save, for example).
  useEffect(() => {
    form.reset(buildSectionDefaults(config, initialData));
  }, [form, config, initialData]);

  const handleSubmit = form.handleSubmit((values) => saveSection(buildSectionPayload(config, values)));

  return (
    <Card>
      <h2 className="text-lg font-black text-foreground">{config.title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{config.description}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          <SectionTextFields form={form} fields={config.fields} />
          {config.image && <SectionImageField control={form.control} name="image" {...config.image} />}
        </div>

        {config.groups && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {config.groups.map((group) => (
              <SectionGroupFields key={group.name} form={form} group={group} />
            ))}
          </div>
        )}

        {config.cards && <SectionCardsEditor form={form} cardConfig={config.cards} />}

        <Button type="submit" size="lg" disabled={isPending} className="self-start">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            config.submitLabel
          )}
        </Button>
      </form>
    </Card>
  );
}
