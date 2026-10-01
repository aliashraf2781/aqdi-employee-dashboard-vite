import { FileText, Gauge, MessageSquareText, Percent, ScrollText, Settings2 } from 'lucide-react';
import { PERMISSION_SECTIONS } from '@/features/permissions';

/**
 * The tabs of the contract settings screen.
 * `section: null` means "no dedicated permission section yet": the umbrella `settings.view` applies.
 * `shortLabel` is the wording used when the tabs are embedded in the system settings hub.
 */
export const CONTRACT_SETTINGS_TABS = [
  { id: 'popup-contracts', label: 'محتوى إرشادي للعقود', shortLabel: 'محتوى إرشادي للعقود', icon: FileText, section: PERMISSION_SECTIONS.popup_contracts },
  { id: 'instrument-types', label: 'إعدادات أنواع الصكوك', shortLabel: 'أنواع الصكوك', icon: ScrollText, section: PERMISSION_SECTIONS.instrument_settings },
  { id: 'sms-settings', label: 'إعدادات رسائل SMS', shortLabel: 'إعدادات رسائل SMS', icon: MessageSquareText, section: PERMISSION_SECTIONS.sms },
  { id: 'meter-fees', label: 'رسوم العدادات', shortLabel: 'رسوم العدادات', icon: Gauge, section: null },
  { id: 'tax-fees', label: 'الضريبة ورسوم التطبيق', shortLabel: 'الضريبة ورسوم التطبيق', icon: Percent, section: PERMISSION_SECTIONS.settings },
  { id: 'payment-messages', label: 'إعدادات رسايل الدفع', shortLabel: 'إعدادات رسائل الدفع', icon: Settings2, section: PERMISSION_SECTIONS.payment_messages },
];

/** Old `?sub=` values that still appear in bookmarks. */
export const CONTRACT_SUB_TAB_ALIASES = { guidance: 'popup-contracts', sms: 'sms-settings' };

export const DEFAULT_CONTRACT_TAB = CONTRACT_SETTINGS_TABS[0].id;

/** Resolves an alias, and falls back to `fallback` for unknown ids. */
export function resolveContractTab(raw, fallback = DEFAULT_CONTRACT_TAB) {
  const id = CONTRACT_SUB_TAB_ALIASES[raw] ?? raw;
  return CONTRACT_SETTINGS_TABS.some((tab) => tab.id === id) ? id : fallback;
}
