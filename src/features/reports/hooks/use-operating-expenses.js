import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import {
  createOperatingExpense,
  deleteOperatingExpense,
  fetchOperatingExpenses,
  updateOperatingExpense,
} from '../api/operating-expenses-api';

const OPERATING_EXPENSES_KEY = 'operating-expenses';

/** List + pagination + summary (count, total_amount). */
export function useOperatingExpenses({ search, createdAt, page, perPage }) {
  return useQuery({
    queryKey: [OPERATING_EXPENSES_KEY, search, createdAt, page, perPage],
    queryFn: () => fetchOperatingExpenses({ search, createdAt, page, perPage }),
    placeholderData: keepPreviousData,
  });
}

function useExpenseMutation(mutationFn, { success, failure }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OPERATING_EXPENSES_KEY] });
      toast.success(success);
    },
    onError: (error) => toast.error(getErrorMessage(error, failure)),
  });
}

export const useCreateOperatingExpense = () =>
  useExpenseMutation(createOperatingExpense, { success: 'تم إضافة المصروف', failure: 'تعذر إضافة المصروف' });

export const useUpdateOperatingExpense = () =>
  useExpenseMutation(updateOperatingExpense, { success: 'تم تحديث المصروف', failure: 'تعذر تحديث المصروف' });

export const useDeleteOperatingExpense = () =>
  useExpenseMutation(deleteOperatingExpense, { success: 'تم حذف المصروف', failure: 'تعذر حذف المصروف' });
