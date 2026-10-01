import { Grid2x2, LayoutTemplate, MessageCircleMore, Smartphone, Sparkles, Tags } from 'lucide-react';
import { badgeField, descriptionField, mainTitleField, titleDescriptionFields } from '@/features/marketing/schemas/common-fields';

const FEATURE_DEFAULTS = [
  { title: 'ثقة عالية', description: 'منصة مرخصة من شبكة إيجار والهيئة العامة لكامل تضمن لك عقود موثقة ومعتمدة رسميًا.' },
  { title: 'نوفر وقتك', description: 'أنجز عقدك الإلكتروني خلال دقائق فقط دون الحاجة لزيارة مكتب.' },
  { title: 'دعم قوي 24/7', description: 'دعم قوي لمساعدتك في إنشاء العقد وحل أي مشكلة بسرعة.' },
];

const AUTHORITY_DEFAULTS = [
  { title: 'شبكة إيجار', description: 'منصة موثقة ومعتمدة رسميًا.' },
  { title: 'الهيئة العامة للعقار', description: 'ترخيص رسمي من الجهة المنظمة.' },
  { title: 'المركز السعودي للأعمال', description: 'سجل تجاري معتمد ومسجل.' },
];

const PRICING_DEFAULTS = [
  {
    title: 'عقد سكني',
    subtitle: 'مناسبة للإيجار، عقد فردي، عقد عائلي ...',
    price: '249',
    duration_label: '/ السنة الواحدة',
    features: [
      { text: 'خلال دقائق ينجز عقدك' },
      { text: 'مناسب لحساب المواطن' },
      { text: 'مناسب للضمان المطور' },
      { text: 'سند تنفيذي' },
      { text: 'يطلبه للإيجار أو الاستثمار' },
    ],
  },
  {
    title: 'عقد تجاري',
    subtitle: 'مناسبة لمحلات تجارية، مكتب، مصنع ...',
    price: '349',
    duration_label: '/ السنة الواحدة',
    features: [
      { text: 'خلال دقائق ينجز عقدك' },
      { text: 'متوافق مع وزارة التجارة' },
      { text: 'توثيق عقد تجاري' },
      { text: 'متوافق مع المركز السعودي للأعمال' },
      { text: 'يطلبه للإيجار أو الاستثمار' },
    ],
  },
];

const hero = {
  key: 'hero',
  title: 'القسم الرئيسي',
  description: 'أضف النصوص الأساسية والصورة الخاصة بأول جزء يظهر للزائر في الصفحة الرئيسية.',
  submitLabel: 'حفظ القسم الرئيسي',
  fields: [
    badgeField('مثال: عقدك الموثق من شبكة ايجار خلال دقائق', 'عقدك الموثق من شبكة ايجار خلال دقائق', 'نص الشارة'),
    mainTitleField('مثال: عقد إيجار إلكتروني موثق..', 'عقد إيجار إلكتروني موثق..'),
    descriptionField(
      'أدخل الوصف التعريفي للقسم الرئيسي',
      'عقود إيجار معتمدة وموثقة عبر منصة إيجار الإلكترونية، بخطوات بسيطة وآمنة تضمن حقوق جميع الأطراف.',
      'يظهر هذا النص أسفل العنوان الرئيسي في واجهة الموقع.',
    ),
  ],
  image: { label: 'صورة القسم', uploadTitle: 'ارفع صورة القسم الرئيسي' },
};

const officialAuthorities = {
  key: 'official_authorities',
  title: 'قسم الجهات الرسمية',
  description: 'عدل بيانات القسم العامة، ثم حرّر بطاقات الجهات — يمكنك إضافة بطاقة أو حذفها.',
  submitLabel: 'حفظ قسم الجهات الرسمية',
  fields: [
    badgeField('مثال: جهات موثوقة ومعتمدة', 'جهات موثوقة ومعتمدة'),
    mainTitleField('مثال: مرخصون من الجهات الرسمية', 'مرخصون من الجهات الرسمية'),
    descriptionField('أدخل الوصف الخاص بالقسم', 'نعمل وفق أنظمة معتمدة لضمان موثوقية وأمان جميع التعاملات.'),
  ],
  cards: {
    heading: 'محتوى البطاقات',
    addLabel: 'إضافة بطاقة',
    itemLabel: 'بطاقة',
    titleField: 'title',
    columns: 2,
    defaults: AUTHORITY_DEFAULTS,
    fields: titleDescriptionFields('عنوان البطاقة مطلوب', 'وصف البطاقة مطلوب'),
    image: { label: 'صورة البطاقة', uploadTitle: 'ارفع صورة البطاقة' },
    license: {
      label: 'ملف الترخيص',
      uploadTitle: 'ارفع ملف الترخيص',
      hint: 'يمكنك رفع صورة للترخيص أو ملف PDF.',
    },
  },
};

const features = {
  key: 'features',
  title: 'قسم المميزات',
  description: 'عدل الشارة والعنوان والوصف، ثم حدّث محتوى بطاقات المميزات الثابتة دون تغيير عددها.',
  submitLabel: 'حفظ قسم المميزات',
  fields: [
    badgeField('مثال: مميزاتنا', 'مميزاتنا'),
    mainTitleField('مثال: لماذا عقدي!', 'لماذا عقدي!'),
    descriptionField('أدخل الوصف الخاص بالقسم', 'عقدك الموثق من شبكة إيجار والهيئة العامة للعقار خلال دقائق.'),
  ],
  cards: {
    heading: 'محتوى البطاقات',
    addLabel: 'إضافة ميزة',
    itemLabel: 'ميزة',
    titleField: 'title',
    defaults: FEATURE_DEFAULTS,
    fields: titleDescriptionFields('عنوان الميزة مطلوب', 'وصف الميزة مطلوب'),
    image: { label: 'صورة الميزة', uploadTitle: 'ارفع صورة الميزة' },
  },
};

const pricing = {
  key: 'pricing',
  title: 'قسم الأسعار',
  description: 'عدل بيانات القسم العامة ثم حرّر باقات الأسعار — يمكنك إضافة باقة أو حذفها وإضافة مميزات داخل كل باقة.',
  submitLabel: 'حفظ قسم الأسعار',
  fields: [
    badgeField('مثال: الأسعار', 'الأسعار'),
    mainTitleField('مثال: وثّق عقدك', 'وثّق عقدك'),
    descriptionField('أدخل الوصف الخاص بالقسم', 'اختر نوع العقد المناسب لك وابدأ التوثيق فورًا.'),
  ],
  cards: {
    heading: 'باقات الأسعار',
    addLabel: 'إضافة باقة',
    itemLabel: 'باقة',
    titleField: 'title',
    columns: 2,
    defaults: PRICING_DEFAULTS,
    fields: [
      { name: 'title', label: 'العنوان', required: 'عنوان الباقة مطلوب' },
      { name: 'subtitle', label: 'الوصف المختصر', required: 'الوصف المختصر مطلوب' },
      { name: 'price', label: 'السعر', required: 'السعر مطلوب' },
      { name: 'duration_label', label: 'وصف المدة', required: 'مدة السعر مطلوبة' },
    ],
    image: { label: 'صورة الباقة', uploadTitle: 'ارفع صورة الباقة' },
    defaultToggle: { label: 'الباقة المميزة (الافتراضية)' },
    features: { heading: 'مميزات الباقة', addLabel: 'إضافة ميزة', placeholder: 'الميزة' },
  },
};

const contact = {
  key: 'contact',
  title: 'قسم التواصل',
  description: 'عدل نصوص قسم التواصل، رقم الواتساب، وصورة القسم الرئيسية.',
  submitLabel: 'حفظ قسم التواصل',
  fields: [
    badgeField('مثال: دعم مباشر وشخصي', 'دعم مباشر وشخصي'),
    mainTitleField('مثال: للاستفسار عن توثيق العقود على الواتساب!', 'للاستفسار عن توثيق العقود على الواتساب !', { multiline: true }),
    descriptionField(
      'أدخل وصف قسم التواصل',
      'فريقنا المتخصص جاهز لمساعدتك في أي استفسار حول توثيق العقود التجارية تواصل معنا في أي وقت ونرد عليك خلال دقائق.',
    ),
    { name: 'contact_number', label: 'رقم التواصل', placeholder: '05xxxxxxxx', kind: 'phone', default: '' },
  ],
  image: { label: 'صورة القسم', uploadTitle: 'ارفع صورة قسم التواصل' },
};

const app = {
  key: 'app',
  title: 'قسم التطبيق',
  description: 'عدل نصوص قسم التطبيق وصورته الرئيسية كما تظهر في الصفحة الرئيسية.',
  submitLabel: 'حفظ قسم التطبيق',
  fields: [
    badgeField('مثال: تطبيق الجوال', 'تطبيق الجوال'),
    mainTitleField('مثال: وثّق عقودك من هاتفك الذكي', 'وثّق عقودك من هاتفك الذكي', { multiline: true }),
    descriptionField(
      'أدخل وصف قسم التطبيق',
      'حمّل تطبيق عقدي وأنجز جميع معاملاتك الإيجارية من أي مكان، بواجهة سهلة الاستخدام وإشعارات فورية وتجربة سلسة تغنيك عن زيارة أي مكتب.',
    ),
  ],
  image: { label: 'صورة القسم', uploadTitle: 'ارفع صورة قسم التطبيق' },
};

/** Tabs of the home page editor, after the SEO tab. */
export const HOME_PAGE = {
  pageKey: 'home',
  seoLabel: 'الصفحة الرئيسية',
  tabs: [
    { value: 'hero', label: 'القسم الرئيسي', icon: LayoutTemplate, section: hero },
    { value: 'official-authorities', label: 'الجهات الرسمية', icon: Grid2x2, section: officialAuthorities },
    { value: 'features', label: 'المميزات', icon: Sparkles, section: features },
    { value: 'pricing', label: 'الأسعار', icon: Tags, section: pricing },
    { value: 'contact', label: 'التواصل', icon: MessageCircleMore, section: contact },
    { value: 'app', label: 'التطبيق', icon: Smartphone, section: app },
  ],
};
