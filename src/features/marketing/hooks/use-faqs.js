import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { createFaq, deleteFaq, listFaqs, updateFaq } from '@/features/marketing/api/faqs-api';

export const FAQS_QUERY_KEY = 'faqs';
export const FAQS_PER_PAGE = 10;

export function useFaqs(page) {
  return useQuery({
    queryKey: [FAQS_QUERY_KEY, page],
    queryFn: () => listFaqs({ page, perPage: FAQS_PER_PAGE }),
    placeholderData: keepPreviousData,
  });
}

function useFaqMutation(mutationFn, { successMessage, errorMessage, onDone }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      toast.success(data?.message || successMessage);
      queryClient.invalidateQueries({ queryKey: [FAQS_QUERY_KEY] });
      onDone?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, errorMessage)),
  });
}

export const useCreateFaq = (onDone) =>
  useFaqMutation(createFaq, { successMessage: 'تم إضافة السؤال بنجاح', errorMessage: 'حدث خطأ أثناء إضافة السؤال', onDone });

export const useUpdateFaq = (onDone) =>
  useFaqMutation(updateFaq, { successMessage: 'تم تعديل السؤال بنجاح', errorMessage: 'حدث خطأ أثناء تعديل السؤال', onDone });

export const useDeleteFaq = (onDone) =>
  useFaqMutation(deleteFaq, { successMessage: 'تم حذف السؤال بنجاح', errorMessage: 'حدث خطأ أثناء حذف السؤال', onDone });
