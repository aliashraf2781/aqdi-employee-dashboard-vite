import { z } from 'zod';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { Badge } from '@/shared/components/badge';
import { fetchPagedList } from '@/features/settings/api/list-fetchers';
import { createCrudApi } from '@/features/settings/api/crud-api';
import { stripHtml } from '@/shared/lib/html';
import { INPUT_FIELD_TYPES, buildTenantRolePayload, tenantRoleToFormValues } from '@/features/settings/lib/tenant-role';

const TENANT_ROLES_PATH = '/admin/tenant-roles';
const TENANT_ROLES_PER_PAGE = 20;

const schema = z
  .object({
    text_of_reason: z.string().trim().min(1, 'عنوان الصلاحية مطلوب'),
    service_definition: z.string(),
    hasUserInput: z.boolean(),
    input_field_label: z.string(),
    input_field_type: z.string(),
  })
  .superRefine((values, context) => {
    if (values.hasUserInput && !values.input_field_label.trim()) {
      context.addIssue({ code: 'custom', path: ['input_field_label'], message: 'اسم حقل الإدخال مطلوب' });
    }
  });

export const tenantRolesConfig = {
  id: 'tenant-roles',
  title: 'صلاحيات المستأجر',
  section: PERMISSION_SECTIONS.tenant_roles,
  queryKey: 'admin-tenant-roles',
  alsoRefresh: ['tenant-roles'],
  fetchRows: ({ page, filters }) =>
    fetchPagedList(TENANT_ROLES_PATH, {
      page,
      per_page: TENANT_ROLES_PER_PAGE,
      search: filters.search?.trim() || undefined,
      sort_by: 'id',
      sort_order: 'asc',
    }),
  filters: [{ name: 'search', kind: 'search', placeholder: 'بحث في العنوان / التعريف / اسم الحقل...' }],
  columns: [
    {
      key: 'title',
      header: 'العنوان',
      cell: (row) => (
        <div>
          <p className="font-bold">{row.text_of_reason || row.name || '—'}</p>
          {row.service_definition && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{stripHtml(row.service_definition)}</p>
          )}
        </div>
      ),
    },
    {
      key: 'hasInput',
      header: 'حقل مستخدم',
      cell: (row) => <Badge tone={row.has_user_input ? 'success' : 'neutral'}>{row.has_user_input ? 'نعم' : 'لا'}</Badge>,
    },
    {
      key: 'fieldSummary',
      header: 'ملخص الحقل',
      cell: (row) =>
        row.has_user_input ? (
          <div>
            <p className="font-bold">{row.input_field_label || '—'}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">النوع: {row.input_field_type || '—'}</p>
          </div>
        ) : (
          '—'
        ),
    },
  ],
  api: createCrudApi({ basePath: TENANT_ROLES_PATH }),
  formSize: 'lg',
  fields: [
    { name: 'text_of_reason', label: 'عنوان الصلاحية', placeholder: 'مثال: غرامة يومية لتأخير الإخلاء' },
    {
      name: 'service_definition',
      label: 'تعريف الخدمة',
      type: 'richtext',
      placeholder: 'نص يظهر داخل المودال عند اختيار الصلاحية...',
    },
    {
      name: 'hasUserInput',
      label: 'حقل من المستخدم؟',
      type: 'switch',
      description: 'يطلب إدخال قيمة (نص أو رقم) داخل المودال في التطبيق',
    },
    {
      name: 'input_field_label',
      label: 'اسم حقل الإدخال',
      placeholder: 'أدخل مبلغ الغرامة اليومية',
      visibleWhen: (values) => values.hasUserInput,
    },
    {
      name: 'input_field_type',
      label: 'نوع الحقل',
      type: 'select',
      options: INPUT_FIELD_TYPES,
      visibleWhen: (values) => values.hasUserInput,
    },
  ],
  schema,
  emptyValues: { text_of_reason: '', service_definition: '', hasUserInput: false, input_field_label: '', input_field_type: 'text' },
  toFormValues: tenantRoleToFormValues,
  toPayload: buildTenantRolePayload,
  deleteTitle: (row) => `هل أنت متأكد من حذف الصلاحية "${row.text_of_reason || row.name || ''}"؟`,
  messages: {
    created: 'تم إضافة الصلاحية بنجاح',
    createFailed: 'حدث خطأ أثناء الإضافة',
    updated: 'تم تحديث الصلاحية بنجاح',
    updateFailed: 'حدث خطأ أثناء التحديث',
    deleted: 'تم حذف الصلاحية بنجاح',
  },
};
