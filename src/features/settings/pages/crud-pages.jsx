import { CrudPage } from '@/features/settings/crud/crud-page';
import { citiesConfig } from '@/features/settings/configs/cities-config';
import { contractPeriodsConfig } from '@/features/settings/configs/contract-periods-config';
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
import { servicesPricingConfig } from '@/features/settings/configs/services-pricing-config';
import { tenantRolesConfig } from '@/features/settings/configs/tenant-roles-config';

/*
 * Every config-driven settings page is just <CrudPage config={...} />.
 * To add another simple list, write its config and add one line here.
 */
export const UnitTypesPage = () => <CrudPage config={unitTypesConfig} />;
export const UnitUsagePage = () => <CrudPage config={unitUsageConfig} />;
export const PropertyTypesPage = () => <CrudPage config={propertyTypesConfig} />;
export const PropertyUsagePage = () => <CrudPage config={propertyUsageConfig} />;
export const RegionsPage = () => <CrudPage config={regionsConfig} />;
export const CitiesPage = () => <CrudPage config={citiesConfig} />;
export const MessageSectionsPage = () => <CrudPage config={messageSectionsConfig} />;
export const MessageSectionItemsPage = () => <CrudPage config={messageSectionItemsConfig} />;
export const MessageForEmployeePage = () => <CrudPage config={messageForEmployeeConfig} />;
export const MessageForPropertyPage = () => <CrudPage config={messageForPropertyConfig} />;
export const CustomerAppMessagesPage = () => <CrudPage config={customerAppMessagesConfig} />;
export const PaymentTypesPage = () => <CrudPage config={paymentTypesConfig} />;
export const ContractPeriodsPage = () => <CrudPage config={contractPeriodsConfig} />;
export const ServicesPricingPage = () => <CrudPage config={servicesPricingConfig} />;
export const CouponsPage = () => <CrudPage config={couponsConfig} />;
export const FaqsPage = () => <CrudPage config={faqsConfig} />;
export const TenantRolesPage = () => <CrudPage config={tenantRolesConfig} />;
export const PaperworksPage = () => <CrudPage config={paperworksConfig} />;
