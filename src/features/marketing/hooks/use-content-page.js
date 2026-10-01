import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { getContentPage, saveContentPage } from '@/features/marketing/api/content-pages-api';
import { CONTENT_PAGE_ENDPOINTS, CONTENT_PAGE_QUERY_KEY } from '@/features/marketing/lib/content-pages';

const STALE_TIME = 30_000;

export function useContentPage(pageKey, { enabled = true } = {}) {
  return useQuery({
    queryKey: [CONTENT_PAGE_QUERY_KEY, pageKey],
    queryFn: () => getContentPage(pageKey),
    enabled: enabled && Boolean(CONTENT_PAGE_ENDPOINTS[pageKey]),
    staleTime: STALE_TIME,
  });
}

/** Save mutation shared by every section form and the SEO form of a page. */
export function useSaveContentPage(pageKey, { successMessage = 'تم حفظ القسم بنجاح', errorMessage = 'حدث خطأ أثناء حفظ القسم' } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => saveContentPage(pageKey, formData),
    onSuccess: (data) => {
      toast.success(data?.message || successMessage);
      queryClient.invalidateQueries({ queryKey: [CONTENT_PAGE_QUERY_KEY, pageKey] });
    },
    onError: (error) => toast.error(getErrorMessage(error, errorMessage)),
  });
}
