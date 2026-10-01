import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';

const DEFAULT_MESSAGES = {
  created: 'تمت الإضافة بنجاح',
  createFailed: 'حدث خطأ أثناء الإضافة',
  updated: 'تم التعديل بنجاح',
  updateFailed: 'حدث خطأ أثناء التعديل',
  deleted: 'تم الحذف بنجاح',
  deleteFailed: 'حدث خطأ أثناء الحذف',
};

/** Save (create or update) and delete mutations for a CRUD config, with toasts and cache refresh. */
export function useCrudMutations(config, { onSaved, onDeleted }) {
  const queryClient = useQueryClient();
  const messages = { ...DEFAULT_MESSAGES, ...config.messages };

  const refreshLists = () => {
    const keys = [config.queryKey, ...(config.alsoRefresh ?? [])];
    keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
  };

  const save = useMutation({
    mutationFn: ({ row, values }) => {
      const payload = config.toPayload(values, { isEdit: Boolean(row) });
      return row ? config.api.update(row.id, payload) : config.api.create(payload);
    },
    onSuccess: (body, { row }) => {
      toast.success(body?.message || (row ? messages.updated : messages.created));
      refreshLists();
      onSaved?.();
    },
    onError: (error, { row }) => {
      toast.error(getErrorMessage(error, row ? messages.updateFailed : messages.createFailed));
    },
  });

  const remove = useMutation({
    mutationFn: (row) => config.api.remove(row.id),
    onSuccess: (body) => {
      toast.success(body?.message || messages.deleted);
      refreshLists();
      onDeleted?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, messages.deleteFailed)),
  });

  return { save, remove };
}
