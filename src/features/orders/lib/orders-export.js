import { writeExcelFile } from '@/shared/lib/xlsx-export';
import { getOrderAdminApprovalStatus } from './refund-ids';
import { isAdminRefundApproved } from './refund-status';

function isPaid(row) {
  return row?.is_paid === true || row?.is_paid === 1 || (row?.amount_payment && row?.is_paid !== false && row?.is_paid !== 0);
}

function formatPaymentValue(row) {
  if (!isPaid(row)) return row?.payment_label_ar || 'لم يتم الدفع';
  return row?.amount_payment ?? '';
}

function formatDateValue(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('ar-SA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function formatCustomerRefunded(value) {
  if (value === true || value === 1) return 'تم الموافقة';
  if (value === false || value === 0) return 'لم تتم الموافقة';
  return 'بانتظار الاسترجاع';
}

function formatAdminApproval(value) {
  return isAdminRefundApproved(value) ? 'تم الموافقة' : 'لم تتم الموافقة';
}

export function mapOrderToExportRow(order, { showStatusColumn = true } = {}) {
  const row = {
    'رقم الطلب': order?.uuid ?? '',
    'رقم جوال العميل': order?.user_mobile ?? '',
    'نوع العقد': order?.contract_type ?? '',
    'نوع الوثيقة': order?.instrument_type ?? '',
    الدفع: formatPaymentValue(order),
    'مستلم منذ': formatDateValue(order?.updated_at),
  };

  if (showStatusColumn) {
    row['حالة الطلب'] = order?.status?.name || order?.contract_status_name || 'قيد المعالجة';
  }
  row.الاستلام = order?.employee_name ?? '';
  return row;
}

export function mapReturnOrderToExportRow(row = {}) {
  return {
    'رقم الطلب': row.uuid ?? '',
    'رقم جوال العميل': row.user_mobile ?? '',
    'نوع العقد': row.contract_type ?? '',
    الدفع: formatPaymentValue(row),
    'المبلغ المطالب استرجاعه': row.refund_amount ?? '',
    'تم الاسترجاع': formatCustomerRefunded(row.customer_refunded ?? row.is_refunded ?? row.refunded),
    'رافع الطلب': row.employee_name ?? row.accept_retrun_contract_employee?.name ?? '',
    'موافقة الإدارة': formatAdminApproval(getOrderAdminApprovalStatus(row)),
  };
}

export async function exportOrdersToExcel(orders, { filename = 'orders', showStatusColumn = true } = {}) {
  if (!orders?.length) return false;
  const rows = orders.map((order) => mapOrderToExportRow(order, { showStatusColumn }));
  return writeExcelFile(rows, { filename, sheetName: 'الطلبات' });
}

export async function exportReturnOrdersToExcel(orders, { filename = 'الطلبات-المسترجعة' } = {}) {
  if (!orders?.length) return false;
  return writeExcelFile(orders.map(mapReturnOrderToExportRow), { filename, sheetName: 'الطلبات المسترجعة' });
}
