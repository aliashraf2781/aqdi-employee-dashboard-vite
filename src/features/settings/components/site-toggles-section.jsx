import { Loader2 } from 'lucide-react';
import { Badge } from '@/shared/components/badge';
import { Card } from '@/shared/components/card';
import { Switch } from '@/shared/components/ui/switch';
import { GENERAL_SETTINGS_FIELDS } from '@/features/settings/lib/general-settings';

/** One card per site/app toggle (stores, website status, thank-you card). */
export function SiteTogglesSection({ settings, savingKey, isBusy, onToggle }) {
  return (
    <section>
      <h2 className="mb-3 text-base font-bold text-foreground">إعدادات الموقع والتطبيق</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {GENERAL_SETTINGS_FIELDS.map(({ key, label }) => {
          const enabled = settings[key];
          return (
            <Card key={key} className="flex flex-col items-center gap-3 p-5 text-center">
              <p className="font-bold text-foreground">{label}</p>
              <Badge tone={enabled ? 'success' : 'neutral'}>{enabled ? 'مُفعّل' : 'مُعطّل'}</Badge>
              {savingKey === key ? (
                <Loader2 className="size-5 animate-spin text-primary" />
              ) : (
                <Switch checked={enabled} disabled={isBusy} onCheckedChange={(checked) => onToggle(key, checked)} aria-label={label} />
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
