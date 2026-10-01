import { z } from 'zod';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { formatDate } from '@/shared/lib/format';
import { COUPONS_PATH, COUPONS_QUERY_KEY } from '@/features/settings/api/coupons-api';
import { fetchPagedList } from '@/features/settings/api/list-fetchers';
import { createCrudApi } from '@/features/settings/api/crud-api';
import { CouponStatusCell } from '@/features/settings/components/coupon-status-cell';
import {
  COUPON_TYPES,
  COUPON_TYPE_OPTIONS,
  buildCouponPayload,
  couponToFormValues,
  couponTypeLabel,
  couponValue,
  isPercentageCoupon,
} from '@/features/settings/lib/coupon';


const schema = z.object({
  name: z.string().trim().min(2, 'اسم الخصم يجب أن يكون على الأقل حرفين'),
  code: z.string().trim().min(3, 'كود الخصم يجب أن يكون على الأقل 3 أحرف'),
  type: z.enum([COUPON_TYPES.fixed, COUPON_TYPES.percentage], { errorMap: () => ({ message: 'نوع الخصم مطلوب' }) }),
  value: z.string().trim().min(1, 'قيمة الخصم مطلوبة'),
  start_date: z.string().min(1, 'تاريخ بداية الخصم مطلوب'),
  end_date: z.string().min(1, 'تاريخ نهاية الخصم مطلوب'),
  use_limit: z.string().trim().min(1, 'عدد مرات استخدام الخصم مطلوب'),
  user_use_limit: z.string().trim().min(1, 'عدد مرات استخدام الخصم لكل مستخدم مطلوب'),
});

export const couponsConfig = {
  id: 'coupons',
  title: 'الخصومات (الكوبونات)',
  section: PERMISSION_SECTIONS.coupons,
  queryKey: COUPONS_QUERY_KEY,
  fetchRows: ({ page }) => fetchPagedList(COUPONS_PATH, { page }),
  columns: [
    { key: 'name', header: 'الاسم', cell: (row) => row.name },
    { key: 'code', header: 'الكود', className: 'font-mono', cell: (row) => <span dir="ltr">{row.code_coupon || row.code || '—'}</span> },
    { key: 'type', header: 'النوع', cell: couponTypeLabel },
    {
      key: 'value',
      header: 'القيمة',
      cell: (row) => (isPercentageCoupon(row) ? `${couponValue(row)}%` : couponValue(row)),
    },
    { key: 'start', header: 'البداية', cell: (row) => formatDate(row.date_start || row.start_date) },
    { key: 'end', header: 'النهاية', cell: (row) => formatDate(row.date_end || row.end_date) },
    { key: 'status', header: 'الحالة', cell: (row) => <CouponStatusCell coupon={row} /> },
  ],
  api: createCrudApi({ basePath: COUPONS_PATH }),
  formColumns: 2,
  fields: [
    { name: 'name', label: 'اسم الخصم', placeholder: 'اكتب هنا ...' },
    { name: 'code', label: 'كود الخصم', placeholder: 'NATIONAL93', dir: 'ltr' },
    { name: 'type', label: 'نوع الخصم', type: 'select', placeholder: 'اختر نوع الخصم', options: COUPON_TYPE_OPTIONS },
    { name: 'value', label: 'قيمة الخصم', type: 'number', step: '0.01', placeholder: 'أدخل القيمة' },
    { name: 'start_date', label: 'تاريخ البداية', type: 'date' },
    { name: 'end_date', label: 'تاريخ النهاية', type: 'date' },
    { name: 'use_limit', label: 'مرات الاستخدام', type: 'number', placeholder: 'مثال: 100' },
    { name: 'user_use_limit', label: 'مرات الاستخدام للمستخدم', type: 'number', placeholder: 'مثال: 1' },
  ],
  schema,
  emptyValues: {
    name: '',
    code: '',
    type: COUPON_TYPES.fixed,
    value: '',
    start_date: '',
    end_date: '',
    use_limit: '',
    user_use_limit: '1',
  },
  toFormValues: couponToFormValues,
  toPayload: buildCouponPayload,
  deleteTitle: (row) => `هل أنت متأكد من حذف الخصم "${row.name}"؟`,
  messages: {
    created: 'تم إضافة الخصم بنجاح',
    createFailed: 'حدث خطأ أثناء حفظ الخصم',
    updated: 'تم تعديل الخصم بنجاح',
    updateFailed: 'حدث خطأ أثناء حفظ الخصم',
    deleted: 'تم حذف الخصم بنجاح',
    deleteFailed: 'حدث خطأ أثناء حذف الخصم',
  },
};
