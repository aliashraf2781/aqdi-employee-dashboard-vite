import { useQuery } from '@tanstack/react-query';
import { fetchRecipients } from '@/features/settings/api/notifications-api';

const STALE_TIME_MS = 30_000;

/** "Name — email" style label; falls back to the id when the record has no name. */
function recipientLabel(record) {
  const name =
    record.name ||
    record.full_name ||
    record.name_ar ||
    [record.first_name, record.last_name].filter(Boolean).join(' ') ||
    'بدون اسم';
  const extra = record.email || record.phone || record.mobile || '';
  return extra ? `${name} — ${extra}` : `${name} (#${record.id})`;
}

export function useRecipientOptions({ kind, search }) {
  const { data, isFetching } = useQuery({
    queryKey: ['notification-recipients', kind, search],
    queryFn: () => fetchRecipients({ kind, search }),
    staleTime: STALE_TIME_MS,
  });
  const options = (data ?? []).map((record) => ({ value: String(record.id), label: recipientLabel(record) }));
  return { options, isFetching };
}
