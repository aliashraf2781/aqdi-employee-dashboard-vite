/** Paperwork forms carry an icon file, so the request body is multipart FormData. */
export function buildPaperworkFormData(values) {
  const formData = new FormData();
  formData.append('name_ar', values.name_ar.trim());
  formData.append('name_en', values.name_en.trim());
  formData.append('contract_type', values.contract_type);

  if (values.icon instanceof File) formData.append('icon', values.icon);
  if (values.delete_icon) formData.append('delete_icon', '1');

  return formData;
}
