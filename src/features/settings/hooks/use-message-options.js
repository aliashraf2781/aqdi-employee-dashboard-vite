import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/api-client';
import { pickItems } from '@/features/settings/lib/list-response';
import { getAudienceSections, parseCustomerMessagesAll, toSelectOptions } from '@/features/settings/lib/customer-messages';

const SECTIONS_QUERY_KEY = 'message-alert-sections';
const ITEMS_QUERY_KEY = 'message-alert-section-items';
const CUSTOMER_MESSAGES_QUERY_KEY = 'customer-messages';
const CLIENT_AUDIENCE = 'client';
const ONE_MINUTE_MS = 60_000;

/** Sections of one audience (client / employee / property) as select options. */
export function useSectionOptions(audience) {
  const { data } = useQuery({
    queryKey: [SECTIONS_QUERY_KEY, 'options', audience],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/message-alert-sections/${audience}/options/list`);
      return pickItems(response.data);
    },
    enabled: Boolean(audience),
  });
  return toSelectOptions(data ?? []);
}

/** Items of one section, as select options. Waits until a section is chosen. */
export function useSectionItemOptions(audience, sectionId) {
  const { data } = useQuery({
    queryKey: [ITEMS_QUERY_KEY, 'options', audience, sectionId],
    queryFn: async () => {
      const response = await apiClient.get('/admin/message-alert-section-items', {
        params: { type: audience, message_alert_section_id: sectionId },
      });
      return pickItems(response.data);
    },
    enabled: Boolean(audience && sectionId),
  });
  return toSelectOptions(data ?? []);
}

/** Customer-app messages come with their sections and items in one request. */
export function useCustomerMessagesAll() {
  return useQuery({
    queryKey: [CUSTOMER_MESSAGES_QUERY_KEY, 'all'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/customer-messages/all');
      return parseCustomerMessagesAll(response.data);
    },
    staleTime: ONE_MINUTE_MS,
  });
}

export function useClientSectionOptions() {
  const { data } = useCustomerMessagesAll();
  return toSelectOptions(getAudienceSections(data?.audiences ?? [], CLIENT_AUDIENCE));
}

export function useClientItemOptions(values) {
  const { data } = useCustomerMessagesAll();
  const sections = getAudienceSections(data?.audiences ?? [], CLIENT_AUDIENCE);
  const section = sections.find((entry) => String(entry.id) === values.message_alert_section_id);
  return toSelectOptions(section?.items ?? []);
}
