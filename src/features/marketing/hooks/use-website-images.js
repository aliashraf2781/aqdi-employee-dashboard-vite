import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import {
  deleteWebsiteImage,
  listWebsiteImages,
  syncWebsiteImageDefaults,
  updateWebsiteImage,
} from '@/features/marketing/api/website-images-api';
import { WEBSITE_IMAGES_QUERY_KEY } from '@/features/marketing/lib/website-images';

const STALE_TIME = 30_000;

export function useWebsiteImages({ search = '', isActive = null } = {}) {
  return useQuery({
    queryKey: [WEBSITE_IMAGES_QUERY_KEY, search, isActive],
    queryFn: () => listWebsiteImages({ search, isActive }),
    staleTime: STALE_TIME,
  });
}

/** Shared wiring: refresh the list, then toast the server message or a fallback. */
function useCatalogMutation(mutationFn, { successMessage, errorMessage, onDone }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      toast.success(data?.message || successMessage);
      queryClient.invalidateQueries({ queryKey: [WEBSITE_IMAGES_QUERY_KEY] });
      onDone?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, errorMessage)),
  });
}

export function useUpdateWebsiteImage(options) {
  return useCatalogMutation(updateWebsiteImage, {
    successMessage: 'تم حفظ بيانات الصورة',
    errorMessage: 'تعذر حفظ بيانات الصورة',
    ...options,
  });
}

export function useDeleteWebsiteImage(options) {
  return useCatalogMutation(deleteWebsiteImage, {
    successMessage: 'تم حذف السجل',
    errorMessage: 'تعذر حذف السجل',
    ...options,
  });
}

export function useSyncWebsiteImageDefaults() {
  return useCatalogMutation(syncWebsiteImageDefaults, {
    successMessage: 'تمت مزامنة الصور الافتراضية',
    errorMessage: 'تعذر تنفيذ المزامنة',
  });
}
