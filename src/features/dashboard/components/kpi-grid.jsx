import { CheckCircle2, ClipboardList, Radio, RotateCcw, UserPlus, Wallet } from 'lucide-react';
import { formatCount, formatRevenue } from '@/features/dashboard/lib/dashboard-format';
import { KpiCard } from './kpi-card';

const ACCENT = 'bg-accent text-accent-foreground';
const SUCCESS = 'bg-success-soft text-success';
const WARNING = 'bg-warning-soft text-warning';
const DANGER = 'bg-danger-soft text-danger';
const NEUTRAL = 'bg-neutral-soft text-neutral';

function buildCards(summary, access) {
  return [
    { key: 'pending', label: 'طلبات معلّقة', value: formatCount(summary.pendingOrders), icon: ClipboardList, tone: ACCENT, href: '/home/orders', visible: access.canOrders },
    { key: 'completed', label: 'مكتملة اليوم', value: formatCount(summary.completedToday), icon: CheckCircle2, tone: SUCCESS, href: '/home/orders', visible: access.canOrders },
    { key: 'returns', label: 'استرجاعات', value: formatCount(summary.returnOrders), icon: RotateCcw, tone: WARNING, href: '/home/return-orders', visible: access.canReturns },
    { key: 'clients', label: 'عملاء جدد (أسبوع)', value: formatCount(summary.newClientsThisWeek), icon: UserPlus, tone: NEUTRAL, href: '/home/clients', visible: access.canClients },
    { key: 'realtime', label: 'طلبات مباشر', value: formatCount(summary.unreceivedOrders), icon: Radio, tone: DANGER, href: '/home/realtime-orders', visible: access.canRealtime },
    { key: 'revenue', label: 'إيراد اليوم', value: formatRevenue(summary.revenueToday), icon: Wallet, tone: ACCENT, href: '/home/reports', visible: access.canAnalytics },
  ];
}

/** Only shows the cards the user is allowed to open. */
export function KpiGrid({ summary, access }) {
  const cards = buildCards(summary, access).filter((card) => card.visible);
  if (cards.length === 0) return null;

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <KpiCard key={card.key} label={card.label} value={card.value} icon={card.icon} iconClassName={card.tone} href={card.href} />
      ))}
    </section>
  );
}
