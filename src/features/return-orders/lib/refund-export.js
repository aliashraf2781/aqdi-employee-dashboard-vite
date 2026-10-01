import { isAdminRefundApproved } from '@/features/orders';
import { writeExcelFile } from '@/shared/lib/xlsx-export';

const DEFAULT_FILENAME = 'الطلبات-المسترجعة';
const SHEET_NAME = 'المسترجع';

function formatCustomerRefunded(value) {
  if (value === true || value === 1) return 'تم الموافقة';
  if (value === false || value === 0) return 'لم تتم الموافقة';
  return 'بانتظار الاسترجاع';
}

function formatPayment(refund) {
  return refund.isPaid ? (refund.amountPayment ?? '') : refund.paymentLabelAr || 'لم يتم الدفع';
}

/** One spreadsheet row from a normalized refund (see normalizeRefundContract). */
export function mapRefundToExportRow(refund) {
  return {
    'رقم الطلب': refund.orderUuid ?? '',
    'رقم جوال العميل': refund.userMobile ?? '',
    'نوع العقد': refund.contractType ?? '',
    الدفع: formatPayment(refund),
    'المبلغ المطالب استرجاعه': refund.refundAmount ?? '',
    'تم الاسترجاع': formatCustomerRefunded(refund.customerRefunded),
    'رافع الطلب': refund.employeeName ?? '',
    'موافقة الإدارة': isAdminRefundApproved(refund.adminConfirmed) ? 'تم الموافقة' : 'لم تتم الموافقة',
    'رقم مسودة العقد': refund.draftContractNumber ?? '',
  };
}

/** Downloads the refunds as an .xlsx file. Returns false when there is nothing to export. */
export async function exportRefundsToExcel(refunds, { filename = DEFAULT_FILENAME } = {}) {
  if (!refunds?.length) return false;
  return writeExcelFile(refunds.map(mapRefundToExportRow), { filename, sheetName: SHEET_NAME });
}
