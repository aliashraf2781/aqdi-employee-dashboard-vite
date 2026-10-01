/** Title + explanation shown above each contract-settings panel. */
export function PanelHeader({ title, description, actions }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {description && <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
