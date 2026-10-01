import { FileText } from 'lucide-react';
import { z } from 'zod';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { fetchBothContractTypes } from '@/features/settings/api/list-fetchers';
import { createCrudApi } from '@/features/settings/api/crud-api';
import { CONTRACT_TYPE_OPTIONS, CONTRACT_TYPES, contractTypeLabel } from '@/features/settings/lib/labels';
import { buildPaperworkFormData } from '@/features/settings/lib/paperwork';
import { contractTypeSchema, requiredText } from '@/features/settings/schemas/common-schemas';

const PAPERWORKS_PATH = '/admin/paperworks';

function PaperworkNameCell({ row }) {
  const name = row.name_ar || row.name;
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface">
        {row.icon_url ? (
          <img src={row.icon_url} alt={name} className="size-full object-contain p-1" />
        ) : (
          <FileText className="size-5 text-muted-foreground" />
        )}
      </div>
      <div>
        <p>{name}</p>
        {row.name_en && (
          <p dir="ltr" className="mt-0.5 text-xs text-muted-foreground">
            {row.name_en}
          </p>
        )}
      </div>
    </div>
  );
}

export const paperworksConfig = {
  id: 'paperworks',
  title: 'أوراق العمل',
  subtitle: 'قائمة بالقيم',
  section: PERMISSION_SECTIONS.paperworks,
  queryKey: 'paperworks',
  fetchRows: () => fetchBothContractTypes(PAPERWORKS_PATH),
  getRowKey: (row) => `${row.contract_type}-${row.id}`,
  columns: [
    { key: 'name', header: 'الاسم', cell: (row) => <PaperworkNameCell row={row} /> },
    { key: 'contractType', header: 'نوع العقد', cell: (row) => contractTypeLabel(row.contract_type) },
  ],
  api: createCrudApi({ basePath: PAPERWORKS_PATH }),
  fields: [
    { name: 'name_ar', label: 'الاسم بالعربية', placeholder: 'أدخل الاسم بالعربية ...' },
    { name: 'name_en', label: 'الاسم بالإنجليزية', placeholder: 'Enter English name ...', dir: 'ltr' },
    { name: 'icon', label: 'الأيقونة', type: 'image', savedUrlKey: 'icon_url', removeFlag: 'delete_icon' },
    { name: 'contract_type', label: 'نوع العقد', type: 'select', options: CONTRACT_TYPE_OPTIONS },
  ],
  schema: z.object({
    name_ar: requiredText(),
    name_en: requiredText(),
    contract_type: contractTypeSchema,
    icon: z.any().nullable(),
    delete_icon: z.boolean(),
  }),
  emptyValues: { name_ar: '', name_en: '', contract_type: CONTRACT_TYPES.housing, icon: null, delete_icon: false },
  toFormValues: (row) => ({
    name_ar: row.name_ar ?? '',
    name_en: row.name_en ?? '',
    contract_type: row.contract_type || CONTRACT_TYPES.housing,
    icon: null,
    delete_icon: false,
  }),
  toPayload: buildPaperworkFormData,
  deleteTitle: (row) => `هل أنت متأكد من حذف ورقة العمل "${row.name_ar || row.name || ''}"؟`,
  messages: {
    created: 'تم إضافة ورقة العمل بنجاح',
    createFailed: 'حدث خطأ أثناء إضافة ورقة العمل',
    updated: 'تم تعديل ورقة العمل بنجاح',
    updateFailed: 'حدث خطأ أثناء تعديل ورقة العمل',
    deleted: 'تم حذف ورقة العمل بنجاح',
    deleteFailed: 'حدث خطأ أثناء حذف ورقة العمل',
  },
};
