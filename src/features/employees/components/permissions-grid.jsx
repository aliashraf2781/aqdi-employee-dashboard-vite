import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/card';
import { countPermissions } from '@/features/employees/lib/role-permissions';

/** One checkbox per permission, grouped by module. The parent owns the selection. */
export function PermissionsGrid({ modules, selected, activateAll, onToggle, onSelectAll, disabled, error }) {
  const isChecked = (permissionName) => activateAll || selected.includes(permissionName);

  return (
    <Card className="mt-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-bold text-primary">
          صلاحيات النظام{' '}
          <span className="font-normal text-muted-foreground">
            ({countPermissions(modules)} صلاحية · {modules.length} وحدة)
          </span>
        </h2>
        <Button type="button" variant="outline" size="sm" onClick={onSelectAll} disabled={disabled || modules.length === 0}>
          تحديد الكل
        </Button>
      </div>

      {modules.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">لا توجد صلاحيات متاحة حالياً.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map((module) => (
            <fieldset key={module.section_key} className="rounded-lg border border-border bg-surface-muted p-3">
              <legend className="px-1 text-sm font-bold text-primary">{module.section_label_ar ?? module.section_key}</legend>
              {module.actions.map((action) => (
                <label key={action.permission_name} className="flex cursor-pointer items-center gap-2 py-1.5 text-sm hover:text-primary">
                  <input
                    type="checkbox"
                    className="size-4 accent-primary"
                    checked={isChecked(action.permission_name)}
                    disabled={disabled}
                    onChange={() => onToggle(action.permission_name)}
                  />
                  {action.action_label_ar ?? action.action}
                </label>
              ))}
            </fieldset>
          ))}
        </div>
      )}
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </Card>
  );
}
