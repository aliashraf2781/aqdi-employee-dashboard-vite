import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/card';
import { PageHeader } from '@/shared/components/page-header';
import { SelectField } from '@/shared/components/ui/select-field';
import { Switch } from '@/shared/components/ui/switch';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { TextField } from '@/shared/components/ui/text-field';
import { PermissionsGrid } from '@/features/employees/components/permissions-grid';
import { listPermissionNames } from '@/features/employees/lib/role-permissions';

const ROLES_TAB_URL = '/home/roles-and-employees?tab=roles';

/**
 * Create / edit role form. The create-only field is the system key; the edit-only
 * fields are the linked employee and the active switch.
 *
 * `onSubmit(values, allPermissionNames)` receives validated values.
 */
export function RoleForm({ title, schema, defaultValues, modules, employees = [], isEdit = false, isSaving, onSubmit }) {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const allPermissionNames = useMemo(() => listPermissionNames(modules), [modules]);
  const activateAll = useWatch({ control, name: 'activate_all' });
  const selected = useWatch({ control, name: 'permissions' });
  const isActive = useWatch({ control, name: 'is_active' });

  const employeeOptions = [
    { value: '', label: 'بدون موظف' },
    ...employees.map((employee) => ({ value: String(employee.id), label: employee.name })),
  ];

  function setActivateAll(checked) {
    setValue('activate_all', checked);
    setValue('permissions', checked ? allPermissionNames : [], { shouldValidate: true });
  }

  function togglePermission(permissionName) {
    const next = selected.includes(permissionName)
      ? selected.filter((name) => name !== permissionName)
      : [...selected, permissionName];
    setValue('activate_all', false);
    setValue('permissions', next, { shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, allPermissionNames))} noValidate>
      <PageHeader
        title={title}
        description="بيانات الدور والصلاحيات"
        actions={
          <>
            <Button asChild variant="outline"><Link to={ROLES_TAB_URL}>رجوع</Link></Button>
            <Button type="submit" disabled={isSaving}>حفظ البيانات</Button>
          </>
        }
      />

      <Card>
        <h2 className="mb-4 font-bold text-primary">بيانات الدور</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="اللقب" placeholder="مثال: موظف خدمة العملاء" error={errors.title_ar?.message} disabled={isSaving} {...register('title_ar')} />
          {isEdit ? (
            <TextField label="الاسم (مفتاح النظام)" dir="ltr" value={defaultValues.name} readOnly disabled />
          ) : (
            <TextField label="الاسم (مفتاح النظام)" dir="ltr" placeholder="customer_service" error={errors.name?.message} disabled={isSaving} {...register('name')} />
          )}
          <div className="sm:col-span-2">
            <TextareaField label="الوصف" rows={2} placeholder="وصف اختياري للدور…" disabled={isSaving} {...register('description')} />
          </div>
          {isEdit && (
            <>
              <SelectField label="الموظف المرتبط" options={employeeOptions} disabled={isSaving} {...register('employee_id')} />
              <div className="flex items-center justify-between gap-3 rounded-md border border-input px-3">
                <span className="text-sm font-medium">حالة الدور: {isActive ? 'نشط' : 'غير نشط'}</span>
                <Switch checked={isActive} onCheckedChange={(checked) => setValue('is_active', checked)} disabled={isSaving} />
              </div>
            </>
          )}
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2.5 rounded-lg bg-accent px-3.5 py-2.5 text-sm font-bold text-accent-foreground">
          <input type="checkbox" className="size-4 accent-primary" checked={activateAll} disabled={modules.length === 0 || isSaving} onChange={(event) => setActivateAll(event.target.checked)} />
          تفعيل كافة الصلاحيات لهذا الدور
        </label>
      </Card>

      <PermissionsGrid
        modules={modules}
        selected={selected}
        activateAll={activateAll}
        onToggle={togglePermission}
        onSelectAll={() => setActivateAll(true)}
        disabled={isSaving}
        error={errors.permissions?.message}
      />
    </form>
  );
}
