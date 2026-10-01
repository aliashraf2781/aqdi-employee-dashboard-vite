import { Activity, Banknote, CheckCircle2, FileText, Undo2, Wallet, XCircle } from 'lucide-react';
import { KpiGrid } from '@/shared/components/kpi-card';
import { useReport } from '../../hooks/use-reports';
import { buildPerformanceView } from '../../lib/performance-view-model';
import { formatMoney, toArabicDigits } from '../../lib/report-format';
import { EmptyNote } from '../empty-note';
import { HorizontalBarChart } from '../horizontal-bar-chart';
import { ReportLineList } from '../report-line-list';
import { ReportPanel } from '../report-panel';
import { ReportSection } from '../report-section';
import { VerticalBarChart } from '../vertical-bar-chart';
import { ConversionFunnel } from './conversion-funnel';
import { FinancialSettingsCard, PROFIT_SETTING_FIELDS } from './financial-settings-card';
import { UnitEconomicsTable } from './unit-economics-table';

const KPI_ICONS = {
  file: FileText,
  checkCircle: CheckCircle2,
  activity: Activity,
  xCircle: XCircle,
  undo: Undo2,
  wallet: Wallet,
  banknote: Banknote,
};
const ALL_SETTING_FIELDS = PROFIT_SETTING_FIELDS.map((field) => field.name);
const SINGLE_COLOR = { employees: 5, documents: 1, errors: 2 };
const SHORT_DAY_LIST_LIMIT = 10;

function ListOrEmpty({ rows, children }) {
  return rows.length ? children : <EmptyNote />;
}

export function PerformancePanel({ filters }) {
  const query = useReport('performance', filters);

  return (
    <ReportPanel title="لوحة الأداء" query={query} errorFallback="تعذّر تحميل لوحة الأداء.">
      {(data) => {
        const view = buildPerformanceView(data, filters.period);
        const kpis = view.kpis.map((kpi) => ({ ...kpi, icon: KPI_ICONS[kpi.icon] }));
        const dayUnit = view.dailyTitleDays <= SHORT_DAY_LIST_LIMIT ? 'أيام' : 'يومًا';

        return (
          <>
            <KpiGrid items={kpis} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ReportSection title="قمع التحويل">
                <ConversionFunnel stages={view.funnel} leakage={view.leakage} />
              </ReportSection>
              <ReportSection title="معدّلات التحويل">
                <ListOrEmpty rows={view.conversionRateItems}>
                  <ReportLineList items={view.conversionRateItems} />
                </ListOrEmpty>
              </ReportSection>
              <ReportSection title={`الاتجاه اليومي للطلبات (آخر ${toArabicDigits(view.dailyTitleDays)} ${dayUnit})`}>
                <ListOrEmpty rows={view.dailyOrders}>
                  <VerticalBarChart items={view.dailyOrders} height={160} showValues />
                </ListOrEmpty>
              </ReportSection>
              <ReportSection title="الطلبات حسب الحالة">
                <HorizontalBarChart items={view.ordersByStatus} />
              </ReportSection>
              <ReportSection title="توزيع نوع العقد">
                <HorizontalBarChart items={view.byContract} />
              </ReportSection>
              <ReportSection title="أداء الموظفين (طلبات مُستلمة)">
                <HorizontalBarChart items={view.byEmployee} seriesIndex={SINGLE_COLOR.employees} />
              </ReportSection>
              <ReportSection title="الأداء التشغيلي — طابور الاستلام">
                <ReportLineList items={view.operationalItems} />
              </ReportSection>
              <ReportSection title="الإيرادات حسب طريقة الدفع">
                <HorizontalBarChart items={view.paymentMethods} />
              </ReportSection>
              <ReportSection title={`قائمة الدخل (P&L) — ${view.periodLabel}`}>
                <ListOrEmpty rows={view.profitAndLoss}>
                  <ReportLineList items={view.profitAndLoss} />
                </ListOrEmpty>
              </ReportSection>
              <ReportSection title="اقتصاد العقد الواحد (بعد إيجار وموياسر)">
                <UnitEconomicsTable rows={view.unitEconomics} note={view.unitEconomicsNote} />
              </ReportSection>
              <FinancialSettingsCard
                fieldNames={ALL_SETTING_FIELDS}
                note="تُوزَّع الثابتة على أيام الفترة المختارة (شهر = 30 يومًا)"
              />
              <ReportSection title="الملخّص المالي الشامل — حسب المصدر">
                <ListOrEmpty rows={view.financialSummary}>
                  <ReportLineList items={view.financialSummary} />
                </ListOrEmpty>
              </ReportSection>
              <ReportSection title="الطلبات حسب نوع الوثيقة">
                <HorizontalBarChart items={view.byDocType} seriesIndex={SINGLE_COLOR.documents} />
              </ReportSection>
              <ReportSection title="أكثر أخطاء التصحيح شيوعًا">
                <HorizontalBarChart items={view.correctionErrors} seriesIndex={SINGLE_COLOR.errors} />
              </ReportSection>
              <ReportSection title="طلبات الاسترجاع وحالاتها">
                <HorizontalBarChart items={view.refundBars} />
                {view.refundTotal != null && view.refundBars.length > 0 && (
                  <div className="flex items-center justify-between border-t border-border pt-2 text-sm">
                    <span className="font-bold text-muted-foreground">إجمالي المبالغ المسترجعة</span>
                    <b className="tabular-nums text-foreground">{formatMoney(view.refundTotal)}</b>
                  </div>
                )}
              </ReportSection>
            </div>
          </>
        );
      }}
    </ReportPanel>
  );
}
