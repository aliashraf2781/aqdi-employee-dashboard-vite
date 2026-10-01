import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { fetchContentPage, saveContentPage } from '@/features/settings/api/content-pages-api';

/** Loads and saves one static content page (terms, privacy...). */
export function useContentPage({ endpoint, queryKey }) {
  const queryClient = useQueryClient();
  const page = useQuery({ queryKey: [queryKey], queryFn: () => fetchContentPage(endpoint) });

  const save = useMutation({
    mutationFn: (html) => saveContentPage(endpoint, html),
    onSuccess: (body) => {
      toast.success(body?.message || 'تم حفظ المحتوى بنجاح');
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) => toast.error(getErrorMessage(error, 'حدث خطأ أثناء حفظ المحتوى')),
  });

  return { page, save };
}
