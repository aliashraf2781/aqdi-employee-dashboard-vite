/*
 * Display-only inventory of ad pixels and analytics sources. The Next.js app showed this static
 * list too: there is no backend endpoint to manage pixels yet, so the UI says it is a demo.
 */

export const AD_PIXELS = [
  {
    name: 'إكس بكسل (تويتر)',
    connected: false,
    id: null,
    events: [],
    lastEvent: 'غير مربوط',
  },
  {
    name: 'سناب بكسل',
    connected: true,
    id: 'a1b2c3d4-***',
    events: ['PURCHASE', 'SIGN_UP', 'PAGE_VIEW'],
    lastEvent: '6,120 حدث · آخر حدث قبل 22 دقيقة',
  },
  {
    name: 'ميتا بكسل (فيسبوك/إنستغرام)',
    connected: true,
    id: '318742***',
    badge: '+ Conversions API (خادمي)',
    events: ['Purchase', 'Lead', 'PageView'],
    lastEvent: '20,310 حدث · آخر حدث قبل 6 دقائق',
  },
  {
    name: 'تيك توك بكسل',
    connected: true,
    id: 'C8QF3ARC77U***',
    badge: '+ Conversions API (خادمي)',
    events: ['CompletePayment', 'Lead', 'ViewContent', 'PageView'],
    lastEvent: '12,840 حدث · آخر حدث قبل 3 دقائق',
  },
];

export const ANALYTICS_SOURCES = [
  {
    name: 'Google Search Console',
    connected: true,
    id: 'aqdi.sa',
    note: 'مصدر بيانات SEO (النقرات والترتيب)',
    lastEvent: '9,300 حدث · آخر حدث قبل 5 دقائق',
  },
  {
    name: 'Google Tag Manager',
    connected: true,
    id: 'GTM-P4X***',
    note: 'حاوية الوسوم – تدير كل البكسلات من مكان واحد',
    lastEvent: '48,200 حدث · آخر حدث قبل دقيقة',
  },
  {
    name: 'Google Ads – تتبع التحويل',
    connected: true,
    id: 'AW-1129***',
    events: ['purchase', 'conversion'],
    lastEvent: '9,300 حدث · آخر حدث قبل 5 دقائق',
  },
  {
    name: 'Google Analytics 4',
    connected: false,
    id: 'G-7QX***',
    events: ['purchase', 'generate_lead', 'page_view'],
    lastEvent: 'مصدر بيانات نشط',
  },
];

export const TRACKED_EVENTS = [
  { event: 'PageView', meaning: 'زيارة صفحة', value: '–', platforms: 'كل المنصات' },
  { event: 'ViewContent', meaning: 'عرض باقة/محتوى', value: '–', platforms: 'تيك توك، ميتا' },
  { event: 'Lead', meaning: 'عميل محتمل (بدأ طلبًا)', value: '–', platforms: 'قوقل، تيك توك، ميتا' },
  { event: 'InitiateCheckout', meaning: 'بدء الدفع', value: '–', platforms: 'ميتا، تيك توك' },
  { event: 'Purchase', meaning: 'دفع/توثيق عقد', value: 'قيمة العقد (الرسوم)', platforms: 'كل المنصات', highlight: true },
];
