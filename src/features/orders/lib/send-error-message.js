import { getOrderId } from './order-contact';
import { formatSectionDataBlock, getOrderSectionFields } from './order-section-fields';

const GREETING = 'عميلنا العزيز،';
const FOOTER = 'نرجو تزويدنا بالبيانات الصحيحة هنا في المحادثة ليتمكن فريقنا من استكمال الإجراء';

const sectionMessage = (title, issue) => ({ title, intro: `${GREETING}\n${issue}`, footer: FOOTER });

/** Fixed WhatsApp texts asking the client to correct one section of the order. */
const SEND_ERROR_CONFIG = {
  owner: sectionMessage('بيانات المالك غير صحيحة', 'يوجد خطأ في إحدى بيانات المالك الموضحة أدناه:'),
  agent: sectionMessage('بيانات الوكيل غير صحيحة', 'يوجد خطأ في إحدى بيانات وكيل المالك الموضحة أدناه:'),
  propertyAddress: sectionMessage('خطأ في العنوان الوطني', 'يوجد خطأ في بيانات العنوان الوطني للعقار الموضحة أدناه:'),
  propertyDetails: sectionMessage('خطأ في تفاصيل العقار', 'يوجد خطأ في تفاصيل العقار الموضحة أدناه:'),
  unitDetails: sectionMessage('خطأ في تفاصيل الوحدات', 'يوجد خطأ في بيانات الوحدة الموضحة أدناه:'),
  contractTenant: sectionMessage('خطأ في بيانات المستأجر', 'يوجد خطأ في بيانات المستأجر الموضحة أدناه:'),
  financialTerms: sectionMessage(
    'خطأ في البيانات المالية والشروط',
    'يوجد خطأ في البيانات المالية أو شروط العقد الموضحة أدناه:',
  ),
};

/** Sections the employee can send an error message about, in menu order. */
export const SECTION_ERROR_CONTEXTS = ['owner', 'agent', 'propertyAddress', 'contractTenant', 'financialTerms', 'unitDetails'];

export function getSendErrorTitle(context) {
  return SEND_ERROR_CONFIG[context]?.title ?? 'إرسال تنبيه للعميل';
}

/** Full message: intro, the section's data, footer and the order number. */
export function composeSendErrorMessage(orderData, context) {
  const config = SEND_ERROR_CONFIG[context];
  const parts = [];

  if (config?.intro) parts.push(config.intro);

  if (config && context) {
    const fields = getOrderSectionFields(orderData, context).filter((field) => field.label !== 'رقم الطلب');
    const dataBlock = formatSectionDataBlock(fields);
    if (dataBlock) parts.push(dataBlock);
  }

  if (config?.footer) parts.push(config.footer);

  const orderId = getOrderId(orderData);
  if (orderId) parts.push(`رقم الطلب: ${orderId}`);

  return parts.join('\n\n');
}
