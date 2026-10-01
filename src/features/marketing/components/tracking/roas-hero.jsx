import { cn } from '@/shared/lib/cn';
import { formatMoney, formatRoas, formatSignedMoney } from '@/features/marketing/lib/format';

function HeroKpi({ value, label, tone }) {
  return (
    <div className="text-center">
      <div className={cn('text-lg font-extrabold', tone)}>{value}</div>
      <div className="text-xs text-primary-foreground/80">{label}</div>
    </div>
  );
}

/** The ROAS header of the overview: return on ad spend plus spend / revenue / profit. */
export function RoasHero({ summary, currency }) {
  const isProfit = Number(summary.profit) >= 0;

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-6 rounded-card bg-primary p-6 text-primary-foreground">
      <div>
        <div className="text-sm font-medium">العائد على الإنفاق الإعلاني (ROAS)</div>
        <div className="mt-1 text-4xl font-black">{formatRoas(summary.roas)}</div>
        {summary.roas_caption_ar && <div className="mt-1 text-xs text-primary-foreground/80">{summary.roas_caption_ar}</div>}
      </div>
      <div className="flex flex-wrap gap-8">
        <HeroKpi value={formatMoney(summary.spend, currency)} label="إجمالي الصرف" />
        <HeroKpi value={formatMoney(summary.revenue, currency)} label="إيراد مُسنَد" />
        <HeroKpi value={formatSignedMoney(summary.profit, currency)} label="ربح صافٍ" tone={isProfit ? undefined : 'text-warning'} />
      </div>
    </div>
  );
}
