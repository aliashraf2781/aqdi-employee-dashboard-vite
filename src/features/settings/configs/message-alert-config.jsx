import { z } from 'zod';
import { requiredText } from '@/features/settings/schemas/common-schemas';

const SECTION_FIELD = 'message_alert_section_id';
const ITEM_FIELD = 'message_alert_section_item_id';

const schema = z.object({
  [SECTION_FIELD]: requiredText(),
  [ITEM_FIELD]: requiredText(),
  message: requiredText(),
});

/**
 * Explanatory messages (client, employee, property) are the same screen with different
 * endpoints, sections and wording. This builds the shared part of their configs.
 *
 * `useItemOptions(values)` receives the live form values so items follow the chosen section.
 */
export function createMessageAlertConfig({
  section: permissionSection,
  useSectionOptions,
  useItemOptions,
  showMessageColumn = true,
  messageFieldType = 'textarea',
  messageFieldLabel = 'الرسالة التوضيحية',
  detailsTitle,
  detailsDescription,
  ...config
}) {
  const columns = [
    { key: 'section', header: 'القسم', cell: (row) => row.section?.name_ar || row.section?.name_en || 'بدون قسم' },
    {
      key: 'item',
      header: 'البند',
      cell: (row) => row.section_item?.name_ar || row.section_item?.name_en || (showMessageColumn && row.message) || 'بدون بند',
    },
  ];
  if (showMessageColumn) {
    columns.push({
      key: 'message',
      header: 'الرسالة',
      cell: (row) => <p className="line-clamp-2 max-w-xs">{row.message || '—'}</p>,
    });
  }

  return {
    ...config,
    section: permissionSection,
    columns,
    details: {
      title: detailsTitle,
      description: detailsDescription,
      fields: [
        { label: 'القسم', render: (row) => row.section?.name_ar || row.section?.name_en || '—' },
        { label: 'بند القسم', render: (row) => row.section_item?.name_ar || row.section_item?.name_en || '—' },
        { label: 'نص الرسالة', render: (row) => row.message || '—' },
      ],
    },
    fields: [
      {
        name: SECTION_FIELD,
        label: 'إختر القسم',
        type: 'select',
        placeholder: 'إختر هنا...',
        useOptions: useSectionOptions,
        clears: [ITEM_FIELD],
      },
      { name: ITEM_FIELD, label: 'إختر بند القسم', type: 'select', placeholder: 'إختر هنا...', useOptions: useItemOptions },
      { name: 'message', label: messageFieldLabel, type: messageFieldType, placeholder: 'أكتب هنا...' },
    ],
    schema,
    emptyValues: { [SECTION_FIELD]: '', [ITEM_FIELD]: '', message: '' },
    toFormValues: (row) => ({
      [SECTION_FIELD]: row[SECTION_FIELD]?.toString() ?? '',
      [ITEM_FIELD]: row[ITEM_FIELD]?.toString() ?? '',
      message: row.message ?? '',
    }),
    toPayload: (values) => ({
      [SECTION_FIELD]: Number(values[SECTION_FIELD]),
      [ITEM_FIELD]: Number(values[ITEM_FIELD]),
      message: values.message.trim(),
    }),
    deleteTitle: () => 'هل أنت متأكد من حذف الرسالة؟',
    messages: {
      created: 'تم إضافة الرسالة بنجاح',
      createFailed: 'حدث خطأ ما',
      updated: 'تم تعديل الرسالة بنجاح',
      updateFailed: 'حدث خطأ ما',
      deleted: 'تم حذف الرسالة بنجاح',
      deleteFailed: 'حدث خطأ أثناء حذف الرسالة',
    },
  };
}

