import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { detachOrderUnit, fetchSingleOrder, updateContractFields, updateOrderUnit } from '../api/single-order-api';
import { mapApiValidationErrors } from '../lib/contract-update';
import { invalidateOrdersCaches, SINGLE_ORDER_QUERY_KEY } from '../lib/order-query-keys';

const ORDER_UNITS_QUERY_KEY = 'order-units';

/**
 * A failed save is rethrown so the editor can keep the form open. Validation errors
 * from the server are rethrown as `{ fieldErrors }` so the editor can mark the fields.
 */
function rethrowSaveError(error) {
  const apiErrors = error?.response?.data?.errors;
  if (apiErrors) {
    const fieldErrors = mapApiValidationErrors(apiErrors);
    toast.error(Object.values(fieldErrors)[0] || error.response.data.message || 'خطأ في التحقق');
    throw { fieldErrors, message: error.response.data.message };
  }
  toast.error(getErrorMessage(error, 'حدث خطأ أثناء حفظ البيانات'));
  throw error;
}

/** A partial update response would drop contract_summary (images, owner...), so it is only used when it is the full order. */
function isFullOrder(updated, contractId) {
  return Boolean(updated) && !Array.isArray(updated) && updated.id === Number(contractId) && updated.contract_summary != null;
}

/** The order of the details page and the mutations that edit it (contract fields, units). */
export function useSingleOrder(contractId) {
  const queryClient = useQueryClient();
  const queryKey = [SINGLE_ORDER_QUERY_KEY, contractId];

  const query = useQuery({ queryKey, queryFn: () => fetchSingleOrder(contractId), enabled: Boolean(contractId) });

  const refreshAfterSave = (response) => {
    if (isFullOrder(response?.data, contractId)) {
      queryClient.setQueryData(queryKey, (old) => ({ ...old, data: response.data }));
    } else {
      queryClient.invalidateQueries({ queryKey });
    }
    queryClient.invalidateQueries({ queryKey: [ORDER_UNITS_QUERY_KEY, contractId] });
    invalidateOrdersCaches(queryClient, { queryKey, orderId: contractId });
  };

  const updateContract = useMutation({
    mutationFn: (payload) => updateContractFields(contractId, payload),
    onSuccess: (response) => {
      toast.success(response?.message || 'تم تحديث بيانات العقد بنجاح');
      refreshAfterSave(response);
    },
    onError: rethrowSaveError,
  });

  const updateUnit = useMutation({
    mutationFn: ({ unitId, payload }) => updateOrderUnit(contractId, unitId, payload),
    onSuccess: (response) => {
      toast.success(response?.message || 'تم تحديث الوحدة بنجاح');
      refreshAfterSave(response);
      query.refetch();
    },
    onError: rethrowSaveError,
  });

  const deleteUnit = useMutation({
    mutationFn: (unitId) => detachOrderUnit(contractId, unitId),
    onSuccess: (response) => {
      toast.success(response?.message || 'تم فصل الوحدة عن العقد');
      refreshAfterSave(response);
      query.refetch();
    },
    onError: rethrowSaveError,
  });

  return {
    orderData: query.data?.data,
    contractId,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    updateContract: updateContract.mutateAsync,
    isSaving: updateContract.isPending,
    updateUnit: (unitId, payload) => updateUnit.mutateAsync({ unitId, payload }),
    isSavingUnit: updateUnit.isPending,
    deleteUnit: deleteUnit.mutateAsync,
    isDeletingUnit: deleteUnit.isPending,
  };
}
