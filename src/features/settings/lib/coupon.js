export const COUPON_TYPES = { fixed: 'fixed', percentage: 'percentage' };

export const COUPON_TYPE_OPTIONS = [
  { value: COUPON_TYPES.fixed, label: 'مبلغ ثابت (ريال)' },
  { value: COUPON_TYPES.percentage, label: 'نسبة مئوية (%)' },
];

const API_PERCENTAGE_TYPE = 'ratio';
const API_FIXED_TYPE = 'value';
const DATE_LENGTH = 10; // YYYY-MM-DD

/** The API calls a percentage coupon "ratio" (older payloads used "percentage"). */
export function isPercentageCoupon(coupon) {
  const type = coupon.type_coupon || coupon.type;
  return type === API_PERCENTAGE_TYPE || type === COUPON_TYPES.percentage;
}

export function couponTypeLabel(coupon) {
  return isPercentageCoupon(coupon) ? 'نسبة مئوية' : 'مبلغ ثابت';
}

export function isCouponActive(coupon) {
  return coupon.is_active === true || coupon.is_active === 1 || coupon.is_active === '1';
}

export function couponValue(coupon) {
  return coupon.value_coupon || coupon.value || 0;
}

const toDateInput = (value) => String(value || '').slice(0, DATE_LENGTH);

export function couponToFormValues(coupon) {
  return {
    name: coupon.name || '',
    code: coupon.code_coupon || coupon.code || '',
    type: isPercentageCoupon(coupon) ? COUPON_TYPES.percentage : COUPON_TYPES.fixed,
    value: String(couponValue(coupon) || ''),
    start_date: toDateInput(coupon.date_start || coupon.start_date),
    end_date: toDateInput(coupon.date_end || coupon.end_date),
    use_limit: String(coupon.usage || coupon.use_limit || ''),
    user_use_limit: String(coupon.usage_of_user || coupon.user_use_limit || '1'),
  };
}

export function buildCouponPayload(values) {
  return {
    name: values.name,
    code_coupon: values.code,
    type_coupon: values.type === COUPON_TYPES.percentage ? API_PERCENTAGE_TYPE : API_FIXED_TYPE,
    value_coupon: parseFloat(values.value),
    date_start: values.start_date,
    date_end: values.end_date,
    usage: parseInt(values.use_limit, 10),
    usage_of_user: parseInt(values.user_use_limit, 10),
    is_review: true,
  };
}
