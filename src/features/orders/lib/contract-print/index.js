import { printHtmlDocument } from '@/shared/lib/print-html';
import { display } from './html-helpers';
import { buildContractPrintSections } from './build-sections';
import { buildContractPrintStyles } from './print-styles';

export { buildContractPrintSections };

function wrapPrintDocument(title, innerHtml) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>${buildContractPrintStyles()}</style>
</head>
<body>
${innerHtml}
</body>
</html>`;
}

export function buildContractPrintHtml(orderData) {
  if (!orderData) return '';
  return wrapPrintDocument(`طباعة العقد - ${display(orderData.uuid)}`, buildContractPrintSections(orderData));
}

/** One print document holding every contract, one per page. */
export function buildBatchContractPrintHtml(ordersData = []) {
  const orders = ordersData.filter(Boolean);
  if (!orders.length) return '';

  const articles = orders
    .map((orderData, index) => {
      const pageBreak = index < orders.length - 1 ? ' style="page-break-after: always;"' : '';
      return `<article class="contract-doc"${pageBreak}>${buildContractPrintSections(orderData)}</article>`;
    })
    .join('\n');

  return wrapPrintDocument(`طباعة العقود (${orders.length})`, articles);
}

export const printOrderContract = (orderData) => printHtmlDocument(buildContractPrintHtml(orderData));
export const printOrderContracts = (ordersData) => printHtmlDocument(buildBatchContractPrintHtml(ordersData));
