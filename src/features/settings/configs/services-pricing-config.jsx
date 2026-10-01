import { z } from 'zod';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { fetchPagedList } from '@/features/settings/api/list-fetchers';
import { createCrudApi } from '@/features/settings/api/crud-api';
import { CONTRACT_TYPE_OPTIONS, CONTRACT_TYPES, contractTypeLabel } from '@/features/settings/lib/labels';
import { formatPrice } from '@/features/settings/lib/price';
import { buildServicesPricingPayload } from '@/features/settings/lib/services-pricing';
import { contractTypeSchema, requiredText } from '@/features/settings/schemas/common-schemas';

const SERVICES_PRICING_PATH = '/admin/services-pricing';
const SERVICES_PRICING_PER_PAGE = 20;
const PRICE_ERROR = 'السعر يجب أن يكون رقماً أكبر من أو يساوي صفر';

const schema = z.object({
  name_ar: requiredText(),
  name_en: z.string(),
  contract_type: contractTypeSchema,
  price: z
    .string()
    .trim()
    .refine((value) => value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0, PRICE_ERROR),
});

export const servicesPricingConfig = {
  id: 'services-pricing',
  title: 'أسعار الخدمات',
  section: PERMISSION_SECTIONS.services_pricing,
  queryKey: 'services-pricing',
  fetchRows: ({ page, filters }) =>
    fetchPagedList(SERVICES_PRICING_PATH, {
      page,
      per_page: SERVICES_PRICING_PER_PAGE,
      contract_type: filters.contract_type || undefined,
      search: filters.search?.trim() || undefined,
    }),
  filters: [
    { name: 'search', kind: 'search', placeholder: 'بحث في اسم الخدمة...' },
    { name: 'contract_type', kind: 'select', placeholder: 'كل الأنواع', options: CONTRACT_TYPE_OPTIONS },
  ],
  columns: [
    {
      key: 'name',
      header: 'الخدمة',
      cell: (row) => (
        <div>
          <p className="font-bold">{row.name_ar || row.name || '—'}</p>
          {row.name_en && (
            <p dir="ltr" className="mt-0.5 text-xs text-muted-foreground">
              {row.name_en}
            </p>
          )}
        </div>
      ),
    },
    { key: 'contractType', header: 'نوع العقد', cell: (row) => contractTypeLabel(row.contract_type) },
    { key: 'price', header: 'السعر', cell: (row) => formatPrice(row.price) },
  ],
  api: createCrudApi({ basePath: SERVICES_PRICING_PATH }),
  fields: [
    { name: 'name_ar', label: 'الاسم بالعربية', placeholder: 'مثال: توثيق عقد إيجار سكني' },
    { name: 'name_en', label: 'الاسم بالإنجليزية', placeholder: 'Example: Housing contract certification', dir: 'ltr' },
    { name: 'price', label: 'السعر', type: 'number', min: '0', step: '0.01', placeholder: '150' },
    { name: 'contract_type', label: 'نوع العقد', type: 'select', options: CONTRACT_TYPE_OPTIONS },
  ],
  schema,
  emptyValues: { name_ar: '', name_en: '', price: '', contract_type: CONTRACT_TYPES.housing },
  toFormValues: (row) => ({
    name_ar: row.name_ar || row.name || '',
    name_en: row.name_en || '',
    price: row.price == null || row.price === '' ? '' : String(row.price),
    contract_type: row.contract_type || CONTRACT_TYPES.housing,
  }),
  toPayload: buildServicesPricingPayload,
  deleteTitle: (row) => `هل أنت متأكد من حذف "${row.name_ar || row.name || ''}"؟`,
  messages: {
    created: 'تم إضافة سعر الخدمة بنجاح',
    createFailed: 'حدث خطأ أثناء إضافة سعر الخدمة',
    updated: 'تم تعديل سعر الخدمة بنجاح',
    updateFailed: 'حدث خطأ أثناء تعديل سعر الخدمة',
    deleted: 'تم حذف سعر الخدمة بنجاح',
    deleteFailed: 'حدث خطأ أثناء حذف سعر الخدمة',
  },
};
