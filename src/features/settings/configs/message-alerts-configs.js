import { PERMISSION_SECTIONS } from '@/features/permissions';
import { createCrudApi } from '@/features/settings/api/crud-api';
import { fetchPlainList } from '@/features/settings/api/list-fetchers';
import { apiClient } from '@/shared/lib/api-client';
import { createMessageAlertConfig } from '@/features/settings/configs/message-alert-config';
import {
  useClientItemOptions,
  useClientSectionOptions,
  useSectionItemOptions,
  useSectionOptions,
} from '@/features/settings/hooks/use-message-options';
import { AUDIENCES } from '@/features/settings/lib/labels';
import { getMessagesByType, parseCustomerMessagesAll } from '@/features/settings/lib/customer-messages';

const useEmployeeSections = () => useSectionOptions(AUDIENCES.employee);
const useEmployeeItems = (values) => useSectionItemOptions(AUDIENCES.employee, values.message_alert_section_id);
const usePropertySections = () => useSectionOptions(AUDIENCES.property);
const usePropertyItems = (values) => useSectionItemOptions(AUDIENCES.property, values.message_alert_section_id);

export const messageForEmployeeConfig = createMessageAlertConfig({
  id: 'message-for-employee',
  title: 'رسائل توضيحية للموظفين',
  subtitle: 'قائمة بالقيم',
  section: PERMISSION_SECTIONS.message_alerts,
  queryKey: 'message-alerts-employee',
  fetchRows: () => fetchPlainList('/admin/message-alerts/employee'),
  api: createCrudApi({ basePath: '/admin/message-alerts/employee' }),
  useSectionOptions: useEmployeeSections,
  useItemOptions: useEmployeeItems,
  detailsTitle: 'عرض رسالة الموظف',
  detailsDescription: 'تفاصيل الرسالة التوضيحية المرتبطة بالقسم والبند.',
});

export const messageForPropertyConfig = createMessageAlertConfig({
  id: 'message-for-property',
  title: 'رسائل توضيحية للعقار',
  subtitle: 'قائمة بالقيم',
  section: PERMISSION_SECTIONS.message_alerts,
  queryKey: 'message-alerts-property',
  fetchRows: () => fetchPlainList('/admin/message-alerts/property'),
  api: createCrudApi({ basePath: '/admin/message-alerts/property', allowDeleteFallback: true }),
  useSectionOptions: usePropertySections,
  useItemOptions: usePropertyItems,
  detailsTitle: 'عرض رسالة العقار',
  detailsDescription: 'تفاصيل الرسالة التوضيحية المرتبطة بالقسم والبند.',
});

async function fetchClientMessages() {
  const response = await apiClient.get('/admin/customer-messages/all');
  const { messages } = parseCustomerMessagesAll(response.data);
  return { rows: getMessagesByType(messages, AUDIENCES.client), lastPage: null };
}

export const customerAppMessagesConfig = createMessageAlertConfig({
  id: 'customer-app-messages',
  title: 'الرسائل التطبيقية للعميل',
  subtitle: 'قائمة بالقيم',
  section: PERMISSION_SECTIONS.app_content,
  queryKey: 'customer-messages',
  alsoRefresh: ['message-alerts-client'],
  fetchRows: fetchClientMessages,
  api: createCrudApi({ basePath: '/admin/customer-messages' }),
  useSectionOptions: useClientSectionOptions,
  useItemOptions: useClientItemOptions,
  showMessageColumn: false,
  messageFieldType: 'text',
  detailsTitle: 'عرض رسالة العميل',
  detailsDescription: 'تفاصيل الرسالة التوضيحية المرتبطة بالقسم والبند.',
});
