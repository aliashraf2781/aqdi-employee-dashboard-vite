import { z } from 'zod';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { fetchBothContractTypes } from '@/features/settings/api/list-fetchers';
import { createCrudApi } from '@/features/settings/api/crud-api';
import { CONTRACT_TYPE_OPTIONS, contractTypeLabel } from '@/features/settings/lib/labels';
import { contractTypeSchema, requiredText } from '@/features/settings/schemas/common-schemas';

const REFERENCE_SCHEMA = z.object({ name_ar: requiredText(), contract_type: contractTypeSchema });

/**
 * The four property reference lists (unit types/usages, property types/usages) are identical
 * except for their endpoint and wording, so one factory builds all of them.
 *
 * `noun` is the singular name used in messages, e.g. "نوع الوحدة".
 */
function createReferenceConfig({ id, queryKey, title, subtitle, path, categoryHeader, namePlaceholder, noun }) {
  return {
    id,
    title,
    subtitle,
    section: PERMISSION_SECTIONS.property_reference,
    queryKey,
    fetchRows: () => fetchBothContractTypes(path),
    columns: [
      { key: 'name', header: 'الاسم', cell: (row) => row.name_ar },
      { key: 'category', header: categoryHeader, cell: (row) => contractTypeLabel(row.contract_type) },
    ],
    api: createCrudApi({ basePath: path }),
    fields: [
      { name: 'name_ar', label: 'الاسم', placeholder: namePlaceholder },
      {
        name: 'contract_type',
        label: categoryHeader,
        type: 'select',
        placeholder: 'سكني أو تجاري',
        options: CONTRACT_TYPE_OPTIONS,
      },
    ],
    schema: REFERENCE_SCHEMA,
    emptyValues: { name_ar: '', contract_type: '' },
    toFormValues: (row) => ({ name_ar: row.name_ar ?? '', contract_type: row.contract_type ?? '' }),
    toPayload: (values) => ({ name_ar: values.name_ar, contract_type: values.contract_type }),
    deleteTitle: (row) => `هل أنت متأكد من حذف "${row.name_ar}"؟`,
    messages: {
      created: `تم إضافة ${noun} بنجاح`,
      createFailed: `حدث خطأ أثناء إضافة ${noun}`,
      updated: `تم تعديل ${noun} بنجاح`,
      updateFailed: `حدث خطأ أثناء تعديل ${noun}`,
      deleted: `تم حذف ${noun} بنجاح`,
      deleteFailed: `حدث خطأ أثناء حذف ${noun}`,
    },
  };
}

export const unitTypesConfig = createReferenceConfig({
  id: 'unit-types',
  queryKey: 'unit-types',
  title: 'أنواع الوحدات',
  subtitle: 'قائمة بقيم',
  path: '/admin/unit-types',
  categoryHeader: 'تصنيف الوحدة',
  namePlaceholder: 'مثال: شقة',
  noun: 'نوع الوحدة',
});

export const unitUsageConfig = createReferenceConfig({
  id: 'unit-usage',
  queryKey: 'unit-usages',
  title: 'استخدام الوحدة',
  subtitle: 'قائمة بالقيم',
  path: '/admin/unit-usages',
  categoryHeader: 'تصنيف الوحدة',
  namePlaceholder: 'اكتب هنا ...',
  noun: 'استخدام الوحدة',
});

export const propertyTypesConfig = createReferenceConfig({
  id: 'property-types',
  queryKey: 'property-types',
  title: 'أنواع العقار',
  subtitle: 'قائمة بالقيم',
  path: '/admin/real-estate-types',
  categoryHeader: 'تصنيف العقار',
  namePlaceholder: 'اكتب هنا ...',
  noun: 'نوع العقار',
});

export const propertyUsageConfig = createReferenceConfig({
  id: 'property-usage',
  queryKey: 'property-usage',
  title: 'استخدام العقار',
  subtitle: 'قائمة بالقيم',
  path: '/admin/real-estate-usages',
  categoryHeader: 'تصنيف العقار',
  namePlaceholder: 'اكتب هنا ...',
  noun: 'استخدام العقار',
});
