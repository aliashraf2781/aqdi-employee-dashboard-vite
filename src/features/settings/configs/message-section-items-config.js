import { z } from 'zod';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { createCrudApi } from '@/features/settings/api/crud-api';
import { fetchAllAudiences } from '@/features/settings/api/list-fetchers';
import { generatedEnglishName } from '@/features/settings/lib/generated-name';
import { useSectionOptions } from '@/features/settings/hooks/use-message-options';
import { AUDIENCE_OPTIONS, AUDIENCES, audienceLabel } from '@/features/settings/lib/labels';
import { requiredText } from '@/features/settings/schemas/common-schemas';

const ITEMS_PATH = '/admin/message-alert-section-items';

/** Sections follow the audience chosen in the form. */
const useSectionsOfChosenAudience = (values) => useSectionOptions(values.type);

export const messageSectionItemsConfig = {
  id: 'message-section-items',
  title: 'بنود أقسام الرسائل',
  subtitle: 'قائمة بالقيم',
  section: PERMISSION_SECTIONS.message_alerts,
  queryKey: 'message-alert-section-items',
  fetchRows: () => fetchAllAudiences((audience) => `${ITEMS_PATH}?type=${audience}`),
  getRowKey: (row) => `${row.type}-${row.id}`,
  columns: [
    { key: 'name', header: 'الاسم', cell: (row) => row.name_ar },
    { key: 'type', header: 'النوع', cell: (row) => audienceLabel(row.type) },
    { key: 'section', header: 'القسم', cell: (row) => row.section?.name_ar || row.message_alert_section?.name_ar || '—' },
  ],
  api: createCrudApi({ basePath: ITEMS_PATH, allowDeleteFallback: true }),
  fields: [
    {
      name: 'type',
      label: 'النوع',
      type: 'select',
      placeholder: 'اختر النوع ...',
      options: AUDIENCE_OPTIONS,
      clears: ['message_alert_section_id'],
    },
    {
      name: 'message_alert_section_id',
      label: 'اختر القسم',
      type: 'select',
      placeholder: 'اختر القسم ...',
      useOptions: useSectionsOfChosenAudience,
    },
    { name: 'name_ar', label: 'الاسم', placeholder: 'اكتب هنا ...' },
  ],
  schema: z.object({ type: requiredText(), message_alert_section_id: requiredText(), name_ar: requiredText() }),
  emptyValues: { type: AUDIENCES.client, message_alert_section_id: '', name_ar: '' },
  toFormValues: (row) => ({
    type: row.type || AUDIENCES.client,
    message_alert_section_id: row.message_alert_section_id?.toString() ?? '',
    name_ar: row.name_ar ?? '',
  }),
  toPayload: (values) => ({
    message_alert_section_id: Number(values.message_alert_section_id),
    name_ar: values.name_ar,
    name_en: generatedEnglishName('item'),
    sort_order: 0,
  }),
  deleteTitle: (row) => `هل أنت متأكد من حذف البند "${row.name_ar}"؟`,
  messages: {
    created: 'تم إضافة البند بنجاح',
    createFailed: 'حدث خطأ ما',
    updated: 'تم تعديل البند بنجاح',
    updateFailed: 'حدث خطأ ما',
    deleted: 'تم حذف البند بنجاح',
    deleteFailed: 'حدث خطأ أثناء حذف البند',
  },
};
