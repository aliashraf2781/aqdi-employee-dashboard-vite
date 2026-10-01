import { PERIOD_LABELS } from './report-filters';
import { formatDuration, formatMoney, formatNumber, pick, toChartItems } from './report-format';

const SLA_GOOD_PERCENT = 80;
const LONG_WAIT_SECONDS = 1800;
const DEFAULT_DAILY_DAYS = 14;
const WEEK_DAYS = 7;
const TODAY_DAYS = 3;

function formatRateValue(row) {
  if (row.value_display != null) return row.value_display;
  if (typeof row.value === 'string') return row.value;
  if (row.suffix) return `${row.value}${row.suffix}`;
  if (row.is_percent === false) return row.value;
  return `${row.value ?? 0}%`;
}

export function buildKpis(kpis = {}) {
  return [
    { key: 'total', label: 'إجمالي الطلبات', value: pick(kpis, 'total_count', 'total'), icon: 'file' },
    {
      key: 'done',
      label: 'موثّقة',
      value: pick(kpis, 'documented_count', 'done_count', 'completed_count'),
      icon: 'checkCircle',
    },
    {
      key: 'working',
      label: 'قيد العمل',
      value: pick(kpis, 'working_count', 'active_count'),
      icon: 'activity',
      tone: 'warning',
    },
    {
      key: 'canceled',
      label: 'ملغاة',
      value: pick(kpis, 'canceled_count', 'cancelled_count'),
      icon: 'xCircle',
      tone: 'danger',
    },
    { key: 'refunded', label: 'مسترجعة', value: pick(kpis, 'refunded_count'), icon: 'undo', tone: 'muted' },
    { key: 'revenue', label: 'الإيرادات (ريال)', value: pick(kpis, 'revenue', 'revenue_total'), icon: 'wallet' },
  ].map((kpi) => ({ ...kpi, value: formatNumber(kpi.value) }));
}

export function buildConversionRateItems(data) {
  if (Array.isArray(data?.conversion_rates) && data.conversion_rates.length) {
    return data.conversion_rates.map((row) => ({ label: row.label, value: formatRateValue(row), tone: row.tone }));
  }

  const rates =
    (!Array.isArray(data?.conversion_rates) && data?.conversion_rates) || data?.conversion_rates_map || data?.rates;
  if (!rates) return [];

  return [
    { label: 'نسبة عدم الإكمال (تسرّب)', value: `${rates.incomplete_percent ?? 0}%`, tone: 'gold' },
    { label: 'تحويل المسودة إلى دفع', value: `${rates.draft_to_paid_percent ?? 0}%`, tone: 'green' },
    { label: 'نسبة المُستلمة (بدأ العمل)', value: `${rates.claimed_percent ?? 0}%` },
    { label: 'معدّل التوثيق', value: `${rates.documented_percent ?? 0}%` },
    { label: 'معدّل الإلغاء', value: `${rates.cancel_percent ?? 0}%`, tone: 'red' },
    { label: 'معدّل الاسترجاع (من المدفوع)', value: `${rates.refund_percent ?? 0}%`, tone: 'muted' },
  ];
}

export function buildOperationalItems(operational = {}) {
  const longestWait = pick(operational, 'longest_wait_seconds', 'max_wait_seconds');
  const late15 = pick(operational, 'late_over_15m', 'late_over_15_count');
  const late30 = pick(operational, 'late_over_30m', 'late_over_30_count');
  const sla = pick(operational, 'sla_percent', 'sla_15m_percent');

  return [
    {
      label: 'عدد الطلبات المنتظرة',
      value: `${pick(operational, 'waiting_count', 'pending_count', 'total_orders') ?? 0} طلب`,
    },
    {
      label: 'متوسط زمن الانتظار',
      value: formatDuration(pick(operational, 'avg_wait_seconds', 'avg_receive_seconds')),
    },
    {
      label: 'أطول انتظار حالي',
      value: formatDuration(longestWait),
      tone: Number(longestWait) > LONG_WAIT_SECONDS ? 'red' : undefined,
    },
    { label: 'متأخرة أكثر من 15 دقيقة', value: `${late15 ?? 0} طلب`, tone: Number(late15) > 0 ? 'gold' : undefined },
    { label: 'متأخرة أكثر من 30 دقيقة', value: `${late30 ?? 0} طلب`, tone: Number(late30) > 0 ? 'red' : undefined },
    {
      label: 'نسبة الالتزام (خلال 15 دقيقة)',
      value: `${sla ?? 0}%`,
      tone: Number(sla) >= SLA_GOOD_PERCENT ? 'green' : 'gold',
    },
    { label: 'مرّات التراجع عن الاستلام', value: `${pick(operational, 'unclaim_count', 'unreceive_count') ?? 0} مرة` },
  ];
}

function toToneFromAmount(row) {
  if (row.tone) return row.tone;
  if (Number(row.value) < 0) return 'red';
  return row.is_total || row.is_subtotal ? 'green' : undefined;
}

export function buildProfitAndLoss(data) {
  return (data?.pnl ?? data?.income_statement ?? []).map((row) => ({
    label: row.label,
    value: row.value_display ?? formatMoney(row.value),
    tone: toToneFromAmount(row),
    bold: row.is_total || row.is_subtotal || row.bold,
    separator: row.is_subtotal || row.separator,
  }));
}

export function buildFinancialSummary(data) {
  return (data?.financial_summary ?? data?.revenue_by_source ?? []).map((row) => ({
    label: row.label,
    value: row.value_display ?? formatMoney(row.value),
    tone: row.tone,
    bold: row.is_total || row.bold,
    separator: row.is_total || row.separator,
  }));
}

function withRevenueDetail(rows = [], prefix = 'إيراد') {
  return toChartItems(
    rows.map((row) => ({
      ...row,
      detail: row.detail ?? (row.revenue != null ? `${prefix} ${formatNumber(row.revenue)}` : undefined),
    })),
  );
}

function dailyTitleDays(dailyOrders, period) {
  if (dailyOrders.length) return dailyOrders.length;
  if (period === 'today') return TODAY_DAYS;
  if (period === 'last_7_days') return WEEK_DAYS;
  return DEFAULT_DAILY_DAYS;
}

/** Shapes the raw performance report into ready-to-render sections. */
export function buildPerformanceView(data, period) {
  const dailyOrders = data?.daily_orders ?? [];
  const rawLeakage = data?.leakage;

  return {
    kpis: buildKpis(data?.kpis),
    funnel: data?.conversion_funnel ?? [],
    leakage:
      data?.conversion_leakage ??
      (rawLeakage
        ? { count: rawLeakage.count ?? rawLeakage.value, percent: rawLeakage.percent ?? rawLeakage.pct }
        : null),
    conversionRateItems: buildConversionRateItems(data),
    operationalItems: buildOperationalItems(data?.operational_metrics ?? data?.receive_queue),
    profitAndLoss: buildProfitAndLoss(data),
    unitEconomics: data?.unit_economics ?? [],
    unitEconomicsNote: data?.unit_economics_note,
    financialSummary: buildFinancialSummary(data),
    ordersByStatus: toChartItems(data?.orders_by_status),
    byContract: withRevenueDetail(data?.by_contract_type ?? data?.contract_type_distribution, 'إيراد'),
    byEmployee: toChartItems(data?.by_employee ?? data?.employee_performance),
    byDocType: withRevenueDetail(data?.by_document_type),
    correctionErrors: toChartItems(data?.correction_errors ?? data?.common_errors),
    paymentMethods: toChartItems(data?.revenue_by_payment_method).map((row) => ({
      ...row,
      suffix: row.suffix ?? 'ريال',
    })),
    refundBars: toChartItems(data?.refund_requests_by_status ?? data?.refund_statuses),
    refundTotal: data?.refund_requests_total ?? data?.refunds_total_amount,
    dailyOrders,
    dailyTitleDays: dailyTitleDays(dailyOrders, period),
    periodLabel: data?.period_label ?? PERIOD_LABELS[period] ?? 'الفترة',
  };
}
