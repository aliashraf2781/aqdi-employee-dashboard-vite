import { FileText } from 'lucide-react';

export function DetailSection({ title, children }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2 px-2">
        <FileText className="size-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>
      <div className="rounded-card border border-border bg-surface-muted p-6">{children}</div>
    </section>
  );
}
