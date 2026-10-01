import { BarChart3, HeartHandshake, LayoutTemplate, Telescope, Users } from 'lucide-react';
import { badgeField, descriptionField, mainTitleField, placeholderFromDefaults, titleDescriptionFields } from '@/features/marketing/schemas/common-fields';

const STORY_DEFAULTS = [
  { value: '8.3M+', label: 'عدد العقود السكنية الموثقة' },
  { value: '2M+', label: 'عدد العقود التجارية الموثقة' },
  { value: '4+', label: 'سنوات خبرة' },
  { value: '98%+', label: 'رضا العملاء' },
];

const BENEFICIARY_DEFAULTS = [
  { title: 'المستأجر', description: 'يهدف من المواطن والمقيم.' },
  { title: 'المؤجر', description: 'المستثمرون في العقارات السكنية وملاكها من أفراد ومنشآت وأوقاف.' },
  { title: 'الوسيط العقاري', description: 'مكاتب عقارات وشركات الوساطة العقارية.' },
];

const VALUE_DEFAULTS = [
  { title: 'نحو إدارة واضحة ومسؤولة', description: 'نوفر معلومات واضحة ومحدثة بشكل كامل للجمهور بشفافية لتعزيز قيم المواطنين.' },
  { title: 'أساس علاقتنا مع المواطن', description: 'يمكنكم تستند إلى مبادئ شفافة ومعلومات دقيقة لخدمتكم بكفاءة.' },
  { title: 'خدمة فعالة ورؤية واضحة', description: 'نوفر معلومات واضحة ومحدثة بشكل كامل للجمهور بشفافية لتعزيز قيم المواطنين.' },
];

const hero = {
  key: 'hero',
  title: 'القسم الرئيسي',
  description: 'عدل الشارة والعنوان الرئيسي والوصف الخاص ببداية صفحة من نحن.',
  submitLabel: 'حفظ القسم الرئيسي',
  fields: [
    badgeField('مثال: من نحن؟', 'من نحن؟'),
    mainTitleField('مثال: نُبسّط إدارة العقود الإيجارية', 'نُبسّط إدارة العقود الإيجارية', { multiline: true }),
    descriptionField(
      'أدخل وصف القسم الرئيسي',
      'تقدم عقاري حلولًا إلكترونية متكاملة لإدارة عقود الإيجار السكنية والتجارية بإجراءات سهلة وآمنة تضمن حقوق جميع الأطراف وتعزز الثقة والحياد.',
      'يظهر هذا النص أسفل العنوان الرئيسي في صفحة من نحن.',
    ),
  ],
};

const story = {
  key: 'story',
  title: 'قسم قصتنا',
  description: 'عدل الشارة والعنوان والوصف، ثم حدّث بطاقات الأرقام الأساسية، ويمكنك إضافة بطاقات جديدة عند الحاجة.',
  submitLabel: 'حفظ قسم قصتنا',
  fields: [
    badgeField('مثال: قصتنا', 'قصتنا'),
    mainTitleField('مثال: أرقام نعتز بها', 'أرقام نعتز بها'),
    descriptionField('أدخل وصف القسم', 'نعمل تحت إشراف وتراخيص الجهات الحكومية المعتمدة لضمان موثوقية وأمان كافة المعاملات.'),
  ],
  cards: {
    heading: 'بطاقات الأرقام',
    addLabel: 'إضافة بطاقة',
    itemLabel: 'بطاقة',
    titleField: 'label',
    columns: 4,
    // The story cards are matched by id on the server only when they already have one.
    omitNewId: true,
    defaults: STORY_DEFAULTS,
    fields: [
      { name: 'value', label: 'الرقم', required: 'الرقم أو القيمة مطلوبة', placeholder: placeholderFromDefaults(STORY_DEFAULTS, 'value', 'مثال: 8.3M+') },
      {
        name: 'label',
        label: 'الوصف',
        multiline: true,
        required: 'وصف البطاقة مطلوب',
        placeholder: placeholderFromDefaults(STORY_DEFAULTS, 'label', 'أدخل وصف البطاقة'),
      },
    ],
  },
};

const visionMission = {
  key: 'vision_mission',
  title: 'قسم الرؤية والرسالة',
  description: 'عدل محتوى جزئي الرسالة والرؤية، مع صورة مستقلة لكل جزء.',
  submitLabel: 'حفظ قسم الرؤية والرسالة',
  fields: [
    { name: 'section_title', label: 'عنوان القسم', placeholder: 'مثال: كل ما تريد معرفته', default: 'كل ما تريد معرفته', required: 'عنوان القسم مطلوب' },
    {
      name: 'section_description',
      label: 'وصف القسم',
      placeholder: 'مثال: يمكنك استخدام منصة "عقدي" لتوثيق عقودك السكنية والتجارية بسهولة ويسر.',
      default: 'يمكنك استخدام منصة "عقدي" لتوثيق عقودك السكنية والتجارية بسهولة ويسر.',
      multiline: true,
      required: 'وصف القسم مطلوب',
    },
  ],
  groups: [
    {
      name: 'mission',
      title: 'الرسالة',
      fields: [
        { name: 'badge_text', label: 'الشارة', default: 'الرسالة', required: 'نص الشارة مطلوب' },
        { name: 'title', label: 'العنوان', default: 'رسالتنا', required: 'العنوان مطلوب' },
        {
          name: 'description',
          label: 'الوصف',
          multiline: true,
          default: 'نقدم حلولًا عقارية موثوقة تركز على الكفاءة والفعالية لتشغيل أعمالنا وحماية الوقت، لنكون عنصرًا أساسيًا في نجاح شركائنا وموظفينا.',
          required: 'الوصف مطلوب',
        },
      ],
      image: { label: 'صورة الجزء', uploadTitle: 'ارفع صورة الرسالة' },
    },
    {
      name: 'vision',
      title: 'الرؤية',
      fields: [
        { name: 'badge_text', label: 'الشارة', default: 'الرؤية', required: 'نص الشارة مطلوب' },
        { name: 'title', label: 'العنوان', default: 'رؤيتنا..', required: 'العنوان مطلوب' },
        {
          name: 'description',
          label: 'الوصف',
          multiline: true,
          default: 'أن تكون إيجار الأولى في قطاع المنشآت العقارية ومرافق مستهدفات رؤية 2030.',
          required: 'الوصف مطلوب',
        },
      ],
      image: { label: 'صورة الجزء', uploadTitle: 'ارفع صورة الرؤية' },
    },
  ],
};

const beneficiaries = {
  key: 'beneficiaries',
  title: 'قسم المستفيدون من إيجار',
  description: 'عدل الشارة والعنوان والوصف، ثم حدّث البطاقات الثلاث الأساسية مع إمكانية إضافة بطاقات جديدة.',
  submitLabel: 'حفظ قسم المستفيدون من إيجار',
  fields: [
    badgeField('مثال: العملية الإيجارية', 'العملية الإيجارية'),
    mainTitleField('مثال: المستفيدون من (إيجار)', 'المستفيدون من (إيجار)'),
    descriptionField(
      'أدخل وصف القسم',
      'يُطلق على المشتركين في إيجار العقاري السكني اسم (أطراف العملية)، وهم المجتمع المستفيدة للتسجيل في الشبكة الإلكترونية لخدمات الإيجار.',
    ),
  ],
  cards: {
    heading: 'محتوى البطاقات',
    addLabel: 'إضافة بطاقة',
    itemLabel: 'بطاقة',
    titleField: 'title',
    defaults: BENEFICIARY_DEFAULTS,
    fields: titleDescriptionFields('عنوان البطاقة مطلوب', 'وصف البطاقة مطلوب', 'أدخل عنوان البطاقة', 'أدخل وصف البطاقة'),
    image: { label: 'صورة البطاقة', uploadTitle: 'ارفع صورة البطاقة' },
  },
};

const values = {
  key: 'values',
  title: 'قسم قيم عقدي',
  description: 'عدل الشارة والعنوان والوصف، ثم حدّث البطاقات الثلاث الأساسية مع إمكانية إضافة بطاقات جديدة.',
  submitLabel: 'حفظ قسم قيم عقدي',
  fields: [
    badgeField('مثال: قيمنا', 'قيمنا'),
    mainTitleField('مثال: قيم عقدي', 'قيم عقدي'),
    descriptionField(
      'أدخل وصف القسم',
      'يهدف (إيجار) إلى تنظيم قطاع الإيجار العقاري في المملكة العربية السعودية بصورة متوازنة تحفظ حقوق أطراف العملية الإيجارية.',
    ),
  ],
  cards: {
    heading: 'محتوى البطاقات',
    addLabel: 'إضافة بطاقة',
    itemLabel: 'بطاقة',
    titleField: 'title',
    defaults: VALUE_DEFAULTS,
    fields: titleDescriptionFields('عنوان البطاقة مطلوب', 'وصف البطاقة مطلوب', 'أدخل عنوان البطاقة', 'أدخل وصف البطاقة'),
    image: { label: 'صورة البطاقة', uploadTitle: 'ارفع صورة البطاقة' },
  },
};

/** Tabs of the about page editor, after the SEO tab. */
export const ABOUT_PAGE = {
  pageKey: 'about',
  seoLabel: 'صفحة من نحن',
  tabs: [
    { value: 'hero', label: 'القسم الرئيسي', icon: LayoutTemplate, section: hero },
    { value: 'story', label: 'قصتنا', icon: BarChart3, section: story },
    { value: 'vision-mission', label: 'الرؤية والرسالة', icon: Telescope, section: visionMission },
    { value: 'beneficiaries', label: 'المستفيدون', icon: Users, section: beneficiaries },
    { value: 'values', label: 'قيم عقدي', icon: HeartHandshake, section: values },
  ],
};
