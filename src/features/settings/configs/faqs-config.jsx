import { z } from 'zod';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { fetchPagedList } from '@/features/settings/api/list-fetchers';
import { createCrudApi } from '@/features/settings/api/crud-api';
import { requiredText } from '@/features/settings/schemas/common-schemas';

const FAQS_PATH = '/admin/faqs';
const FAQS_PER_PAGE = 10;

export const faqsConfig = {
  id: 'faqs',
  title: 'الأسئلة الشائعة',
  subtitle: 'قائمة بالقيم',
  section: PERMISSION_SECTIONS.faqs,
  queryKey: 'faqs',
  fetchRows: ({ page }) => fetchPagedList(FAQS_PATH, { per_page: FAQS_PER_PAGE, page }),
  columns: [
    { key: 'question', header: 'السؤال', className: 'font-bold', cell: (row) => row.title_ar || row.title_trans || '—' },
    {
      key: 'answer',
      header: 'الجواب',
      cell: (row) => <p className="line-clamp-3 whitespace-pre-wrap text-muted-foreground">{row.answer_ar || row.answer_trans || '—'}</p>,
    },
  ],
  api: createCrudApi({ basePath: FAQS_PATH }),
  fields: [
    { name: 'title_ar', label: 'السؤال', placeholder: 'اكتب السؤال هنا ...' },
    { name: 'answer_ar', label: 'الجواب', type: 'textarea', placeholder: 'اكتب الجواب هنا ...' },
  ],
  schema: z.object({
    title_ar: requiredText('يرجى إدخال السؤال والجواب'),
    answer_ar: requiredText('يرجى إدخال السؤال والجواب'),
  }),
  emptyValues: { title_ar: '', answer_ar: '' },
  toFormValues: (row) => ({ title_ar: row.title_ar ?? '', answer_ar: row.answer_ar ?? '' }),
  toPayload: (values) => ({ title_ar: values.title_ar.trim(), answer_ar: values.answer_ar.trim() }),
  deleteTitle: (row) => `هل أنت متأكد من حذف السؤال؟ ${row.title_ar ?? ''}`.trim(),
  messages: {
    created: 'تم إضافة السؤال بنجاح',
    createFailed: 'حدث خطأ أثناء إضافة السؤال',
    updated: 'تم تعديل السؤال بنجاح',
    updateFailed: 'حدث خطأ أثناء تعديل السؤال',
    deleted: 'تم حذف السؤال بنجاح',
    deleteFailed: 'حدث خطأ أثناء حذف السؤال',
  },
};
