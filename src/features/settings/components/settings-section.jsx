import { Card } from '@/shared/components/card';

/** A titled card used to group one block of a settings screen. */
export function SettingsSection({ title, description, children }) {
  return (
    <Card>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      {description && <p className="mt-1 text-sm leading-7 text-muted-foreground">{description}</p>}
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </Card>
  );
}
