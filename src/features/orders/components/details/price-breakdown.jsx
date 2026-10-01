import { getQuoteDetails, isHiddenAmount } from '../../lib/financial-display';
import { Money, MoneyField } from './detail-fields';

/** Fees listed separately only when the quote's own detail lines do not already contain them. */
const QUOTE_FEES = [
  { key: 'electricity_meter_fee', label: 'رسوم نقل الكهرباء' },
  { key: 'water_meter_fee', label: 'رسوم نقل الماء' },
  { key: 'paper_deed_fee', label: 'رسوم الصك الورقي' },
];

const SECTION_CLASS = 'space-y-2 border-t border-border pt-2';

function detailLabel(item) {
  return item.percent != null && !isHiddenAmount(item.percent) ? `${item.label} (${item.percent}%)` : item.label;
}

/** Price lines of the quote the backend computed (fees, tax, total, paid). */
export function QuoteBreakdown({ quote }) {
  const details = getQuoteDetails(quote);
  const detailKeys = new Set(details.map((item) => item.key));
  const showTaxPercent = !isHiddenAmount(quote.tax_percent) && !detailKeys.has('tax');
  const taxLabel = showTaxPercent ? `الضريبة (${quote.tax_percent}%)` : 'الضريبة';

  const hasRows =
    details.length > 0 ||
    [quote.electricity_meter_fee, quote.water_meter_fee, quote.paper_deed_fee, quote.tax_amount, quote.total_price, quote.paid_amount].some(
      (amount) => !isHiddenAmount(amount),
    );
  if (!hasRows) return null;

  return (
    <div className={SECTION_CLASS}>
      <p className="text-xs font-bold text-muted-foreground">بنود السعر</p>
      {details.map((item) => (
        <MoneyField key={item.key || item.label} label={detailLabel(item)} value={item.amount} />
      ))}
      {QUOTE_FEES.filter((fee) => !detailKeys.has(fee.key)).map((fee) => (
        <MoneyField key={fee.key} label={fee.label} value={quote[fee.key]} />
      ))}
      {!detailKeys.has('tax') && <MoneyField label={taxLabel} value={quote.tax_amount} />}
      <MoneyField label="السعر الإجمالي" value={quote.total_price} strong />
      <MoneyField label="المدفوع" value={quote.paid_amount} />
    </div>
  );
}

/** Price lines of `total_price` (the older shape, used when there is no quote). */
export function TotalPriceBreakdown({ totalPrice }) {
  if (!totalPrice?.items?.length) return null;

  return (
    <div className={SECTION_CLASS}>
      <p className="text-xs font-bold text-muted-foreground">تفاصيل السعر</p>
      {totalPrice.items.map((item) => (
        <div key={item.key || item.label} className="flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-muted-foreground">
            {item.label}
            {item.percent != null ? ` (${item.percent}%)` : ''}
          </span>
          <Money value={item.amount} />
        </div>
      ))}
      {totalPrice.subtotal != null && (
        <div className="flex items-center justify-between gap-3 pt-1 text-xs">
          <span className="font-medium text-muted-foreground">المجموع الفرعي</span>
          <Money value={totalPrice.subtotal} />
        </div>
      )}
      <div className="flex items-center justify-between gap-3 text-xs font-black">
        <span>الإجمالي</span>
        <Money value={totalPrice.total} className="text-sm" />
      </div>
    </div>
  );
}
