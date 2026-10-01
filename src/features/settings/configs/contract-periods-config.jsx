import { z } from 'zod';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { fetchPagedList } from '@/features/settings/api/list-fetchers';
import { createCrudApi } from '@/features/settings/api/crud-api';
import {
  CUSTOM_PERIOD,
  KNOWN_PERIODS,
  buildContractPeriodPayload,
  contractPeriodToFormValues,
  getKnownPeriodMonths,
  resolvePeriod,
} from '@/features/settings/lib/contract-period';
import { CONTRACT_TYPE_OPTIONS, CONTRACT_TYPES, contractTypeLabel } from '@/features/settings/lib/labels';
import { REQUIRED_FIELDS_MESSAGE } from '@/features/settings/crud/crud-config';
import { contractTypeSchema, optionalNonNegativeNumber, requiredText } from '@/features/settings/schemas/common-schemas';
import { formatPrice } from '@/features/settings/lib/price';

const CONTRACT_PERIODS_PATH = '/admin/contract-periods';
const CONTRACT_PERIODS_PER_PAGE = 20;
const ALL_TYPES_LABEL = 'كل الأنواع';

const PERIOD_OPTIONS = [
  ...KNOWN_PERIODS.map((period) => ({ value: period.value, label: period.value })),
  { value: CUSTOM_PERIOD, label: 'أخرى' },
];

const schema = z
  .object({
    periodChoice: requiredText(),
    customPeriod: z.string(),
    note_ar: requiredText(),
    note_en: z.string(),
    contract_type: contractTypeSchema,
    price: optionalNonNegativeNumber('السعر يجب أن يكون رقماً أكبر من أو يساوي صفر'),
  })
  .refine((values) => resolvePeriod(values) !== '', { message: REQUIRED_FIELDS_MESSAGE, path: ['customPeriod'] });

export const contractPeriodsConfig = {
  id: 'contract-periods',
  title: 'مدة العقد',
  section: PERMISSION_SECTIONS.contract_periods,
  queryKey: 'contract-periods',
  fetchRows: ({ page, filters }) =>
    fetchPagedList(CONTRACT_PERIODS_PATH, {
      page,
      per_page: CONTRACT_PERIODS_PER_PAGE,
      contract_type: filters.contract_type || undefined,
    }),
  filters: [{ name: 'contract_type', kind: 'select', placeholder: ALL_TYPES_LABEL, options: CONTRACT_TYPE_OPTIONS }],
  columns: [
    { key: 'period', header: 'المدة', className: 'font-bold', cell: (row) => row.period || '—' },
    {
      key: 'note',
      header: 'الملاحظة',
      cell: (row) => (
        <div>
          <p>{row.note_ar || row.note || '—'}</p>
          {row.note_en && (
            <p dir="ltr" className="mt-0.5 text-xs text-muted-foreground">
              {row.note_en}
            </p>
          )}
        </div>
      ),
    },
    { key: 'contractType', header: 'نوع العقد', cell: (row) => contractTypeLabel(row.contract_type) },
    { key: 'months', header: 'الأشهر', cell: (row) => row.total_months ?? '—' },
    { key: 'price', header: 'السعر', cell: (row) => formatPrice(row.price) },
    { key: 'docFee', header: 'رسوم التوثيق', cell: (row) => formatPrice(row.doc_fee) },
  ],
  api: createCrudApi({ basePath: CONTRACT_PERIODS_PATH, createPath: `${CONTRACT_PERIODS_PATH}/create` }),
  fields: [
    { name: 'periodChoice', label: 'مدة العقد', type: 'select', options: PERIOD_OPTIONS },
    {
      name: 'customPeriod',
      label: 'اسم المدة',
      placeholder: 'أدخل اسم المدة ...',
      visibleWhen: (values) => values.periodChoice === CUSTOM_PERIOD,
    },
    {
      name: 'monthsHint',
      type: 'hint',
      text: (values) => {
        const months = getKnownPeriodMonths(resolvePeriod(values));
        return months ? `يُحسب إجمالي الأشهر تلقائياً: ${months}` : 'قيمة أخرى = بدون عدد أشهر محدد';
      },
    },
    { name: 'note_ar', label: 'الملاحظة بالعربية', placeholder: 'مثال: سنة واحدة' },
    { name: 'note_en', label: 'الملاحظة بالإنجليزية', placeholder: 'Example: One year', dir: 'ltr' },
    { name: 'contract_type', label: 'نوع العقد', type: 'select', options: CONTRACT_TYPE_OPTIONS },
    { name: 'price', label: 'السعر', type: 'number', min: '0', step: '0.01', placeholder: 'اختياري' },
  ],
  schema,
  emptyValues: {
    periodChoice: 'سنوي',
    customPeriod: '',
    note_ar: '',
    note_en: '',
    contract_type: CONTRACT_TYPES.housing,
    price: '',
  },
  toFormValues: contractPeriodToFormValues,
  toPayload: buildContractPeriodPayload,
  deleteTitle: (row) => `هل أنت متأكد من حذف مدة العقد "${row.period ?? ''}"؟`,
  messages: {
    created: 'تم إضافة مدة العقد بنجاح',
    createFailed: 'حدث خطأ أثناء إضافة مدة العقد',
    updated: 'تم تعديل مدة العقد بنجاح',
    updateFailed: 'حدث خطأ أثناء تعديل مدة العقد',
    deleted: 'تم حذف مدة العقد بنجاح',
    deleteFailed: 'حدث خطأ أثناء حذف مدة العقد',
  },
};
