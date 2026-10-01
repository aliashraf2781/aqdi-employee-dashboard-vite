import { z } from 'zod';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { fetchBothContractTypes } from '@/features/settings/api/list-fetchers';
import { createCrudApi } from '@/features/settings/api/crud-api';
import { CONTRACT_TYPE_OPTIONS, CONTRACT_TYPES, contractTypeLabel } from '@/features/settings/lib/labels';
import { contractTypeSchema, requiredText } from '@/features/settings/schemas/common-schemas';

const PAYMENT_TYPES_PATH = '/admin/payment-types';
const api = createCrudApi({ basePath: PAYMENT_TYPES_PATH, createPath: `${PAYMENT_TYPES_PATH}/create` });

export const paymentTypesConfig = {
  id: 'payment-types',
  title: 'طرق الدفع',
  subtitle: 'قائمة بالقيم',
  section: PERMISSION_SECTIONS.app_content,
  queryKey: 'payment-types',
  fetchRows: () => fetchBothContractTypes(PAYMENT_TYPES_PATH),
  getRowKey: (row) => `${row.contract_type}-${row.id}`,
  columns: [
    {
      key: 'name',
      header: 'الاسم',
      cell: (row) => (
        <div>
          <p>{row.name_ar || row.name}</p>
          {row.name_en && (
            <p dir="ltr" className="mt-0.5 text-xs text-muted-foreground">
              {row.name_en}
            </p>
          )}
        </div>
      ),
    },
    { key: 'contractType', header: 'نوع العقد', cell: (row) => contractTypeLabel(row.contract_type) },
  ],
  // Payment types can be added and edited but never deleted.
  api: { create: api.create, update: api.update },
  fields: [
    { name: 'name_ar', label: 'الاسم بالعربية', placeholder: 'أدخل الاسم بالعربية ...' },
    { name: 'name_en', label: 'الاسم بالإنجليزية', placeholder: 'Enter English name ...', dir: 'ltr' },
    { name: 'contract_type', label: 'نوع العقد', type: 'select', options: CONTRACT_TYPE_OPTIONS },
  ],
  schema: z.object({ name_ar: requiredText(), name_en: requiredText(), contract_type: contractTypeSchema }),
  emptyValues: { name_ar: '', name_en: '', contract_type: CONTRACT_TYPES.housing },
  toFormValues: (row) => ({
    name_ar: row.name_ar ?? '',
    name_en: row.name_en ?? '',
    contract_type: row.contract_type || CONTRACT_TYPES.housing,
  }),
  toPayload: (values) => ({ name_ar: values.name_ar, name_en: values.name_en, contract_type: values.contract_type }),
  messages: {
    created: 'تم إضافة طريقة الدفع بنجاح',
    createFailed: 'حدث خطأ أثناء إضافة طريقة الدفع',
    updated: 'تم تعديل طريقة الدفع بنجاح',
    updateFailed: 'حدث خطأ أثناء تعديل طريقة الدفع',
  },
};
