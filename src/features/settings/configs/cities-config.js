import { z } from 'zod';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { fetchPlainList } from '@/features/settings/api/list-fetchers';
import { createCrudApi } from '@/features/settings/api/crud-api';
import { useRegionOptions } from '@/features/settings/hooks/use-region-options';
import { requiredText } from '@/features/settings/schemas/common-schemas';

const CITIES_PATH = '/admin/cities';

export const citiesConfig = {
  id: 'cities',
  title: 'المدن',
  section: PERMISSION_SECTIONS.cities,
  queryKey: 'cities',
  fetchRows: () => fetchPlainList(CITIES_PATH),
  columns: [
    { key: 'name', header: 'الاسم', cell: (row) => row.name_ar },
    { key: 'region', header: 'المنطقة', cell: (row) => row.regions?.name_ar || '—' },
  ],
  api: createCrudApi({ basePath: CITIES_PATH }),
  fields: [
    { name: 'name_ar', label: 'اسم المدينة', placeholder: 'اكتب هنا ...' },
    { name: 'region_id', label: 'المنطقة', type: 'select', placeholder: 'اختر المنطقة', useOptions: useRegionOptions },
  ],
  schema: z.object({ name_ar: requiredText(), region_id: requiredText() }),
  emptyValues: { name_ar: '', region_id: '' },
  toFormValues: (row) => ({
    name_ar: row.name_ar ?? '',
    region_id: row.regions?.id != null ? String(row.regions.id) : '',
  }),
  toPayload: (values) => ({ name_ar: values.name_ar, region_id: values.region_id }),
  deleteTitle: (row) => `هل أنت متأكد من حذف المدينة "${row.name_ar}"؟`,
  messages: {
    created: 'تم إضافة مدينة بنجاح',
    createFailed: 'حدث خطأ أثناء إضافة مدينة',
    updated: 'تم تعديل مدينة بنجاح',
    updateFailed: 'حدث خطأ أثناء تعديل مدينة',
    deleted: 'تم حذف المدينة بنجاح',
    deleteFailed: 'حدث خطأ أثناء حذف المدينة',
  },
};
