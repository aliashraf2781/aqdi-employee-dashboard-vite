import parse from 'html-react-parser';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useTenantRoles } from '../../../hooks/use-reference-data';
import { parseTenantRoleIds } from '../../../lib/contract-update';
import { getTenantRoleLabel } from '../../../lib/reference-options';

function RoleInput({ role, value, error, onChange }) {
  return (
    <div className="mt-3 space-y-1.5 ps-7">
      <label className="block text-xs font-medium text-muted-foreground">
        {role.input_field_label || 'القيمة'}
        <span className="text-destructive"> *</span>
      </label>
      <input
        type={role.input_field_type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={role.input_field_label || ''}
        dir="ltr"
        className="h-11 w-full rounded-md border border-input bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/** Tenant permissions: pick any of the available roles; some ask for a value (e.g. an amount). */
export function TenantRolesField({ values, onPatch, errors }) {
  const { items: roles, isLoading } = useTenantRoles(true);
  const selectedIds = parseTenantRoleIds(values?.tenant_role_ids);
  const roleValues = values?.tenant_role_values || {};

  const emit = (ids, nextValues) => onPatch({ tenant_role_ids: ids, tenant_role_values: nextValues, tenant_roles: ids.length > 0 ? 1 : 0 });

  const toggleRole = (roleId, checked) => {
    const id = Number(roleId);
    const nextIds = checked ? [...selectedIds.filter((item) => item !== id), id] : selectedIds.filter((item) => item !== id);
    const nextValues = { ...roleValues };
    if (!checked) delete nextValues[String(roleId)];
    emit(nextIds, nextValues);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        جاري تحميل صلاحيات المستأجر...
      </div>
    );
  }
  if (!roles.length) return <div className="text-sm text-muted-foreground">لا توجد صلاحيات متاحة حالياً</div>;

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold">صلاحيات المستأجر</p>
      {roles.map((role) => {
        const id = String(role.id);
        const checked = selectedIds.map(String).includes(id);
        return (
          <div key={role.id} className={cn('rounded-2xl border p-4', checked ? 'border-primary bg-accent' : 'border-border bg-surface')}>
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox className="mt-1" checked={checked} onCheckedChange={(next) => toggleRole(role.id, next === true)} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{getTenantRoleLabel(role)}</span>
                {role.service_definition && (
                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{parse(String(role.service_definition))}</div>
                )}
              </span>
            </label>
            {checked && role.has_user_input && (
              <RoleInput
                role={role}
                value={roleValues[id] ?? ''}
                error={errors[`tenant_role_values:${id}`]?.message}
                onChange={(value) => emit(selectedIds, { ...roleValues, [id]: value })}
              />
            )}
          </div>
        );
      })}
      {errors.tenant_role_ids?.message && <p className="text-xs text-destructive">{errors.tenant_role_ids.message}</p>}
    </div>
  );
}
