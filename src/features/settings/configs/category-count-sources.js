import { citiesConfig } from '@/features/settings/configs/cities-config';
import { couponsConfig } from '@/features/settings/configs/coupons-config';
import { faqsConfig } from '@/features/settings/configs/faqs-config';
import {
  customerAppMessagesConfig,
  messageForEmployeeConfig,
  messageForPropertyConfig,
} from '@/features/settings/configs/message-alerts-configs';
import { messageSectionItemsConfig } from '@/features/settings/configs/message-section-items-config';
import { messageSectionsConfig } from '@/features/settings/configs/message-sections-config';
import { paperworksConfig } from '@/features/settings/configs/paperworks-config';
import { paymentTypesConfig } from '@/features/settings/configs/payment-types-config';
import {
  propertyTypesConfig,
  propertyUsageConfig,
  unitTypesConfig,
  unitUsageConfig,
} from '@/features/settings/configs/property-reference-configs';
import { regionsConfig } from '@/features/settings/configs/regions-config';
import { tenantRolesConfig } from '@/features/settings/configs/tenant-roles-config';

/** Category id -> the CRUD config whose list is counted on the hub card. */
export const CATEGORY_COUNT_SOURCES = {
  'unit-types': unitTypesConfig,
  'unit-usage': unitUsageConfig,
  regions: regionsConfig,
  cities: citiesConfig,
  'property-types': propertyTypesConfig,
  'property-usage': propertyUsageConfig,
  'message-sections': messageSectionsConfig,
  'message-section-items': messageSectionItemsConfig,
  'customer-app-messages': customerAppMessagesConfig,
  'message-for-employee': messageForEmployeeConfig,
  'message-for-property': messageForPropertyConfig,
  coupons: couponsConfig,
  faqs: faqsConfig,
  'payment-types': paymentTypesConfig,
  'tenant-roles': tenantRolesConfig,
  paperworks: paperworksConfig,
};
