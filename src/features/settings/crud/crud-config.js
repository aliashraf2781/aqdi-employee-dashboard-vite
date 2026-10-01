/**
 * Shape of a CRUD page config (see configs/*.js for real examples).
 *
 * {
 *   id, title, subtitle?            page heading
 *   section                         permission section (view/create/edit/delete come from it)
 *   queryKey                        cache key; every list/mutation of the page shares it
 *   alsoRefresh?                    other query keys to refresh after a change
 *   fetchRows({ page, filters })    -> { rows, lastPage }
 *   getRowKey?                      defaults to row.id
 *   columns                         [{ key, header, cell(row), className? }]
 *   filters?                        [{ name, kind: 'search' | 'select', placeholder, options? }]
 *   api                             { create, update, remove? }  (see api/crud-api.js)
 *   fields                          form fields, see crud-field.jsx
 *   schema, emptyValues             zod schema + blank form values
 *   toFormValues(row)               row -> form values when editing
 *   toPayload(values, { isEdit })   form values -> request body
 *   messages?                       success / failure toasts (defaults are generic)
 *   deleteTitle?(row)               confirm dialog heading; omit `api.remove` to hide delete
 *   details?                        { title, fields: [{ label, render(row) }] } adds a "view" button
 *   formColumns?                    1 (default) or 2
 *   formSize?                       Modal size
 * }
 */
export const CRUD_ADD_LABEL = 'إضافة';
export const CRUD_EDIT_LABEL = 'تعديل';
export const CRUD_DELETE_LABEL = 'حذف';
export const CRUD_VIEW_LABEL = 'عرض';
export const CRUD_NEW_ITEM_TITLE = 'عنصر جديد';
export const CRUD_EDIT_ITEM_TITLE = 'تعديل العنصر';

export const REQUIRED_FIELDS_MESSAGE = 'يرجى ملء جميع الحقول المطلوبة';
