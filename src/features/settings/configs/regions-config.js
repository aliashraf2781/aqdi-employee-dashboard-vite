import { z } from 'zod';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { fetchPlainList } from '@/features/settings/api/list-fetchers';
import { createCrudApi } from '@/features/settings/api/crud-api';
import { requiredText } from '@/features/settings/schemas/common-schemas';

export const REGIONS_QUERY_KEY = 'regions';
export const REGIONS_PATH = '/admin/regions';

export const regionsConfig = {
  id: 'regions',
  title: 'المناطق',
  subtitle: 'قائمة',
  section: PERMISSION_SECTIONS.regions,
  queryKey: REGIONS_QUERY_KEY,
  fetchRows: () => fetchPlainList(REGIONS_PATH),
  columns: [{ key: 'name', header: 'الاسم', cell: (row) => row.name_ar }],
  api: createCrudApi({ basePath: REGIONS_PATH }),
  fields: [{ name: 'name_ar', label: 'الاسم', placeholder: 'مثال: الرياض' }],
  schema: z.object({ name_ar: requiredText('يرجى إدخال اسم المنطقة') }),
  emptyValues: { name_ar: '' },
  toFormValues: (row) => ({ name_ar: row.name_ar ?? '' }),
  toPayload: (values) => ({ name_ar: values.name_ar }),
  deleteTitle: (row) => `هل أنت متأكد من حذف المنطقة "${row.name_ar}"؟`,
  messages: {
    created: 'تم إضافة المنطقة بنجاح',
    createFailed: 'حدث خطأ أثناء إضافة المنطقة',
    updated: 'تم تعديل المنطقة بنجاح',
    updateFailed: 'حدث خطأ أثناء تعديل المنطقة',
    deleted: 'تم حذف المنطقة بنجاح',
    deleteFailed: 'حدث خطأ أثناء حذف المنطقة',
  },
};
