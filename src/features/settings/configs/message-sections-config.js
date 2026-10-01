import { z } from 'zod';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { createCrudApi } from '@/features/settings/api/crud-api';
import { fetchAllAudiences } from '@/features/settings/api/list-fetchers';
import { generatedEnglishName } from '@/features/settings/lib/generated-name';
import { AUDIENCE_OPTIONS, AUDIENCES, audienceLabel } from '@/features/settings/lib/labels';
import { requiredText } from '@/features/settings/schemas/common-schemas';

const SECTIONS_PATH = '/admin/message-alert-sections';

export const messageSectionsConfig = {
  id: 'message-sections',
  title: 'أقسام الرسائل',
  subtitle: 'قائمة بالقيم',
  section: PERMISSION_SECTIONS.message_alerts,
  queryKey: 'message-alert-sections',
  fetchRows: () => fetchAllAudiences((audience) => `${SECTIONS_PATH}/${audience}/options/list`),
  getRowKey: (row) => `${row.type}-${row.id}`,
  columns: [
    { key: 'name', header: 'الاسم', cell: (row) => row.name_ar },
    { key: 'type', header: 'النوع', cell: (row) => audienceLabel(row.type) },
  ],
  api: createCrudApi({ basePath: SECTIONS_PATH, allowDeleteFallback: true }),
  fields: [
    { name: 'name_ar', label: 'الاسم', placeholder: 'اكتب هنا ...' },
    { name: 'type', label: 'النوع', type: 'select', placeholder: 'اختر النوع ...', options: AUDIENCE_OPTIONS },
  ],
  schema: z.object({ name_ar: requiredText(), type: requiredText() }),
  emptyValues: { name_ar: '', type: AUDIENCES.client },
  toFormValues: (row) => ({ name_ar: row.name_ar ?? '', type: row.type || AUDIENCES.client }),
  toPayload: (values) => ({
    name_ar: values.name_ar,
    name_en: generatedEnglishName('section'),
    sort_order: 0,
    type: values.type,
  }),
  deleteTitle: (row) => `هل أنت متأكد من حذف القسم "${row.name_ar}"؟`,
  messages: {
    created: 'تم إضافة القسم بنجاح',
    createFailed: 'حدث خطأ ما',
    updated: 'تم تعديل القسم بنجاح',
    updateFailed: 'حدث خطأ ما',
    deleted: 'تم حذف القسم بنجاح',
    deleteFailed: 'حدث خطأ أثناء حذف القسم',
  },
};
