import { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import defaultUserImage from '@/assets/employees/default-user.jpg';
import { FormDialog } from '@/shared/components/form-dialog';
import { SelectField } from '@/shared/components/ui/select-field';
import { TextField } from '@/shared/components/ui/text-field';
import { ProfileImageField } from '@/features/employees/components/profile-image-field';
import { useSaveEmployee } from '@/features/employees/hooks/use-employee-mutations';
import { useRoleOptions } from '@/features/employees/hooks/use-roles';
import { splitFullName } from '@/features/employees/lib/employee-display';
import { sanitizePhoneInput } from '@/features/employees/lib/saudi-phone';
import { DEFAULT_WORK_PERIOD, WORK_PERIODS } from '@/features/employees/lib/work-periods';
import { createEmployeeSchema, editEmployeeSchema } from '@/features/employees/schemas/employee-schema';

const STATUS_OPTIONS = [
  { value: '1', label: 'نشط / مفعل' },
  { value: '0', label: 'غير نشط' },
];

function buildDefaultValues(employee) {
  if (!employee) {
    return {
      firstName: '', lastName: '', password: '', email: '', phone: '', base_salary: '',
      role_id: '', is_active: '1', work_period: DEFAULT_WORK_PERIOD, image: null,
    };
  }

  return {
    ...splitFullName(employee.name),
    password: '',
    email: employee.email || '',
    phone: employee.phone || '',
    base_salary: String(parseFloat(employee.base_salary || 0)),
    role_id: String(employee.role_id || ''),
    is_active: employee.is_active ? '1' : '0',
    work_period: employee.work_period || DEFAULT_WORK_PERIOD,
    image: null,
  };
}

/** The API expects multipart form data with a single `name`. */
function buildFormData(values, isEdit) {
  const formData = new FormData();
  formData.append('name', `${values.firstName} ${values.lastName}`);
  formData.append('email', values.email);
  if (!isEdit || values.password) formData.append('password', values.password);
  formData.append('phone', values.phone);
  formData.append('base_salary', String(values.base_salary));
  formData.append('role_id', String(values.role_id));
  formData.append('is_active', String(values.is_active));
  formData.append('work_period', values.work_period);
  if (values.image?.[0]) formData.append('profile_image', values.image[0]);
  return formData;
}

/** Add dialog when `employee` is empty, edit dialog otherwise. */
export function EmployeeFormDialog({ open, onOpenChange, employee }) {
  const isEdit = Boolean(employee);
  const saveEmployee = useSaveEmployee();
  const { data: roles = [] } = useRoleOptions();

  const defaultValues = useMemo(() => buildDefaultValues(employee), [employee]);
  const roleOptions = roles.map((role) => ({
    value: String(role.id),
    label: role.title_trans || role.title_ar || role.name,
  }));

  async function handleSubmit(values) {
    try {
      await saveEmployee.mutateAsync({ id: employee?.id, formData: buildFormData(values, isEdit) });
      onOpenChange(false);
    } catch {
      // The mutation hook already showed the error toast.
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
      description="بيانات الموظف والصلاحيات الوظيفية"
      size="lg"
      schema={isEdit ? editEmployeeSchema : createEmployeeSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitLabel="حفظ البيانات"
    >
      {({ register, control, setValue, formState: { errors } }) => (
        <>
          <Controller
            control={control}
            name="image"
            render={({ field }) => (
              <ProfileImageField
                currentImage={isEdit ? employee.profile_image || defaultUserImage : null}
                onChange={field.onChange}
                error={errors.image?.message}
              />
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="الإسم الأول" placeholder="أكتب هنا ..." error={errors.firstName?.message} {...register('firstName')} />
            <TextField label="اسم العائلة / اللقب" placeholder="أكتب هنا ..." error={errors.lastName?.message} {...register('lastName')} />
            <TextField label="البريد الإلكتروني" dir="ltr" placeholder="name@example.com" error={errors.email?.message} {...register('email')} />
            <TextField
              label="رقم الهاتف"
              dir="ltr"
              inputMode="numeric"
              placeholder="05xxxxxxxx"
              error={errors.phone?.message}
              {...register('phone', {
                onChange: (event) => setValue('phone', sanitizePhoneInput(event.target.value)),
              })}
            />
            <TextField
              label={isEdit ? 'كلمة المرور (اتركها فارغة إذا لم تكن تريد تغييرها)' : 'كلمة المرور'}
              type="password"
              placeholder="أكتب هنا ..."
              error={errors.password?.message}
              {...register('password')}
            />
            <SelectField key={roleOptions.length} label="الدور الوظيفي" placeholder="اختر الدور الوظيفي للموظف" options={roleOptions} error={errors.role_id?.message} {...register('role_id')} />
            <TextField label="الراتب الأساسي" type="number" step="0.01" placeholder="0.00" error={errors.base_salary?.message} {...register('base_salary')} />
            <SelectField label="فترة العمل" options={WORK_PERIODS} error={errors.work_period?.message} {...register('work_period')} />
            <SelectField label="حالة الحساب" options={STATUS_OPTIONS} error={errors.is_active?.message} {...register('is_active')} />
          </div>
        </>
      )}
    </FormDialog>
  );
}
