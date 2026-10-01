import { ClipboardList, BarChart3, Radio, Receipt, RotateCcw, Users } from 'lucide-react';

export const DASHBOARD_MOTTO = {
  brandLabel: 'عقدي · لوحة الموظفين',
  title: 'الإتقــان طريــق الخلــود في الأثــر',
  body: 'الإتقان ليس في كثرة العمل، بل في صدق النية وجودة الأداء. من يعمل بضمير يترك أثراً لا يُمحى.',
  verse: '﴿لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا﴾',
  footnote: 'العبرة بمعيار الجودة والإحسان، لا بالكثرة والقلة.',
};

export const START_BUTTON_LABEL = 'ابدأ الآن';

/** `section` is a key of DASHBOARD_ROUTE_SECTIONS; `badgeKey` is a key of the summary. */
export const QUICK_ACTIONS = [
  { id: 'realtime-orders', label: 'الطلبات مباشر', href: '/home/realtime-orders', icon: Radio, section: 'realtimeOrders', badgeKey: 'unreceivedOrders' },
  { id: 'orders', label: 'جميع الطلبات', href: '/home/orders', icon: ClipboardList, section: 'orders' },
  { id: 'clients', label: 'العملاء', href: '/home/clients', icon: Users, section: 'clients' },
  { id: 'return-orders', label: 'طلبات الاسترجاع', href: '/home/return-orders', icon: RotateCcw, section: 'returnOrders', badgeKey: 'returnOrders' },
  { id: 'reports', label: 'التقارير', href: '/home/reports', icon: BarChart3, section: 'reports' },
  { id: 'invoices', label: 'الفواتير', href: '/home/invoices', icon: Receipt, section: 'invoices' },
];
